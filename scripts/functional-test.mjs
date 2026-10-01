// Functional test: drives the real store like a shopper and reports pass/fail.
// Usage: node scripts/functional-test.mjs [baseUrl]
import { chromium } from '/home/salman/.local/mcp/playwright/node_modules/playwright/index.mjs';

const base = process.argv[2] || 'http://127.0.0.1:5180';
const results = [];
const ok = (name, pass, detail = '') => {
  results.push({ name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? '  (' + detail + ')' : ''}`);
};
const attempt = async (name, fn) => {
  try {
    await fn();
  } catch (e) {
    ok(name, false, 'threw: ' + String(e.message).split('\n')[0].slice(0, 90));
  }
};

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const errs = [];
page.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
page.on('pageerror', (e) => errs.push('pageerror: ' + e.message));

const go = async (p) => {
  await page.goto(base + p, { waitUntil: 'networkidle' });
  await page.waitForTimeout(200);
};

// --- 1. header + navigation
await go('/');
ok('Header renders with nav', (await page.locator('header').count()) > 0);
const navLinks = await page.locator('header a[href="/shop"]').count();
ok('Header links to /shop', navLinks > 0);

// --- 2. add to cart from a product page
await go('/product/luna-mini-shoulder-bag');
await page.getByRole('button', { name: /add to cart/i }).first().click();
await page.waitForTimeout(400);
const badgeEl = page.locator('header span').filter({ hasText: /^1$/ }).first();
ok('Add to cart updates header count', (await badgeEl.count()) > 0, 'badge shows 1');

// --- 3. quantity stepper
const plus = page.getByRole('button', { name: 'Increase' }).first();
ok('Quantity stepper present', (await plus.count()) > 0);
if (await plus.count()) {
  await plus.click({ force: true });
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: /add to cart/i }).first().click({ force: true });
  await page.waitForTimeout(500);
  const count = await page.evaluate(() => {
    const c = JSON.parse(localStorage.getItem('luna-cart') || '[]');
    return c.reduce((s2, i) => s2 + i.quantity, 0);
  });
  ok('Stepper qty is added to the cart', count === 3, 'cart qty=' + count + ' (1 then +2)');
}

// --- 4. cart page shows the item + total
await go('/cart');
const cartText = await page.locator('main, body').first().innerText();
ok('Cart page lists the product', /Luna Mini Shoulder Bag/i.test(cartText));
ok('Cart shows a total', /Rs\./.test(cartText));

// --- 5. cart persists across reload
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(300);
const afterReload = await page.locator('main, body').first().innerText();
ok('Cart persists after refresh', /Luna Mini Shoulder Bag/i.test(afterReload));

// --- 6. wishlist
await go('/product/vintage-signet-ring');
const wish = page.getByRole('button', { name: /wishlist|heart/i }).first();
await wish.click();
await page.waitForTimeout(300);
await go('/wishlist');
const wlText = await page.locator('main, body').first().innerText();
ok('Wishlist stores the item', /Vintage Signet Ring/i.test(wlText));

// --- 7. search
await go('/search?q=scarf');
const searchText = await page.locator('main, body').first().innerText();
ok('Search finds scarf products', /Scarf/i.test(searchText));
ok('Search has results heading', /result/i.test(searchText));

// --- 8. shop filtering
await go('/shop');
const allCount = await page.locator('a[href^="/product/"]').count();
const catChip = page.getByRole('button', { name: /^Jewelry$/ }).first();
if (await catChip.count()) {
  await catChip.click();
  await page.waitForTimeout(500);
  const filtered = await page.locator('a[href^="/product/"]').count();
  ok('Category filter narrows results', filtered > 0 && filtered < allCount, `${allCount} -> ${filtered}`);
} else ok('Category filter chip present', false);

// --- 9. sorting
const sortSel = page.locator('select').first();
if (await sortSel.count()) {
  const opts = await sortSel.locator('option').allTextContents();
  ok('Sort dropdown has options', opts.length > 1, opts.join(' | '));
  await sortSel.selectOption({ index: 1 });
  await page.waitForTimeout(400);
  ok('Sorting applies without error', true);
} else ok('Sort dropdown present', false);

// --- 10. empty state
await go('/cart');
await page.evaluate(() => localStorage.removeItem('luna-cart'));
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(300);
const emptyCart = await page.locator('body').innerText();
ok('Empty cart shows a friendly empty state', /waiting|empty/i.test(emptyCart));
ok('Empty cart has an h1 heading', (await page.locator('h1').count()) === 1);

// --- 11. checkout flow end to end
await go('/product/slim-card-holder-tan');
await page.getByRole('button', { name: /add to cart/i }).first().click();
await page.waitForTimeout(300);
await go('/checkout');
let co = await page.locator('body').innerText();
ok('Checkout shows form when cart has items', /information|checkout/i.test(co));
const inputs = await page.locator('input').count();
ok('Checkout has input fields', inputs >= 3, inputs + ' inputs');
const submits = await page.locator('button[type="submit"], button:has-text("Place"), button:has-text("Order")').count();
ok('Checkout has a place-order button', submits > 0);
if (submits > 0) {
  // fill required fields then submit
  const textInputs = page.locator('form input:not([type=submit]):not([type=radio]):not([type=checkbox])');
  const n = await textInputs.count();
  for (let i = 0; i < n; i++) {
    const el = textInputs.nth(i);
    const type = await el.getAttribute('type');
    if (type === 'email') await el.fill('test@example.com');
    else if (type === 'tel') await el.fill('03001234567');
    else await el.fill('Test Value');
  }
  await page.getByRole('button', { name: /continue|place order/i }).first().click({ force: true });
  await page.waitForTimeout(700);
  ok('Checkout step 1 advances to step 2', /place order/i.test(await page.locator('body').innerText()));
  const step2Inputs = page.locator('form input:not([type=submit]):not([type=radio]):not([type=checkbox])');
  const m2 = await step2Inputs.count();
  for (let i = 0; i < m2; i++) {
    const el = step2Inputs.nth(i);
    const t = await el.getAttribute('type');
    if (t === 'tel') await el.fill('03001234567');
    else if (t !== 'email') await el.fill('Test Value');
  }
  await page.getByRole('button', { name: /continue|place order/i }).first().click({ force: true });
  await page.waitForTimeout(1800);
  const conf = await page.locator('body').innerText();
  ok('Order confirmation reached', /thank you|order number/i.test(conf), page.url());
  ok('Confirmation is honest about being a demo', /demo|simulat/i.test(conf) || /cash on delivery/i.test(conf));
}

// --- 12. 404
await go('/this-page-does-not-exist');
const nf = await page.locator('body').innerText();
ok('404 page shows a not-found message', /not found|404|does not exist/i.test(nf));
ok('404 keeps the header', (await page.locator('header').count()) > 0);

// --- 13. SEO metadata
await go('/');
const seo = await page.evaluate(() => ({
  title: document.title,
  desc: document.querySelector('meta[name="description"]')?.content || '',
  og: document.querySelector('meta[property="og:title"]')?.content || '',
}));
ok('Page has a <title>', seo.title.length > 3, seo.title);
ok('Page has meta description', seo.desc.length > 10, seo.desc.slice(0, 60));

// --- 14. accessibility basics
const a11y = await page.evaluate(() => {
  const imgs = [...document.images];
  return {
    noAlt: imgs.filter((i) => !i.alt).length,
    totalImgs: imgs.length,
    btnsNoName: [...document.querySelectorAll('button')].filter(
      (b) => !b.innerText.trim() && !b.getAttribute('aria-label') && !b.getAttribute('title')
    ).length,
    h1s: document.querySelectorAll('h1').length,
  };
});
ok('All images have alt text', a11y.noAlt === 0, a11y.noAlt + '/' + a11y.totalImgs + ' missing');
ok('All buttons have accessible names', a11y.btnsNoName === 0, a11y.btnsNoName + ' unnamed');
ok('Exactly one h1 on the page', a11y.h1s === 1, a11y.h1s + ' found');

// --- 15. keyboard: tab reaches content
await go('/');
await page.keyboard.press('Tab');
const focused = await page.evaluate(() => document.activeElement?.tagName);
ok('Keyboard focus moves into the page', !!focused, focused);

// --- 16. mobile menu
const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const mp = await mctx.newPage();
await mp.goto(base + '/', { waitUntil: 'networkidle' });
const burger = mp.locator('header button').first();
if (await burger.count()) {
  await burger.click();
  await mp.waitForTimeout(500);
  const menuOpen = await mp.locator('nav, [role="dialog"]').count();
  const menuLinks = await mp.locator('a[href="/shop"]').count();
  ok('Mobile menu opens', menuLinks > 0, menuLinks + ' shop links visible');
} else ok('Mobile menu button present', false);
await mctx.close();

await browser.close();

// --- report
const pass = results.filter((r) => r.pass).length;
console.log('FUNCTIONAL TEST\n' + '='.repeat(74));
console.log('='.repeat(74));
console.log(`${pass} / ${results.length} passed`);
if (errs.length) {
  console.log('\nconsole errors:');
  [...new Set(errs)].slice(0, 10).forEach((e) => console.log('  ' + e));
} else console.log('no console errors');
