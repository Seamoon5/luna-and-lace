// Crawls every route, records console errors, failed requests and broken images.
// Usage: node scripts/audit.mjs [baseUrl]
import { chromium } from '/home/salman/.local/mcp/playwright/node_modules/playwright/index.mjs';
import fs from 'fs';

const base = process.argv[2] || 'http://127.0.0.1:5180';
const ROUTES = [
  '/', '/shop', '/category/handbags', '/category/jewelry', '/category/watches',
  '/category/sunglasses', '/category/hair-accessories', '/category/scarves',
  '/category/wallets', '/category/belts', '/category/gift-sets', '/category/necklaces',
  '/category/earrings', '/category/bracelets', '/category/rings', '/category/shoulder-bags',
  '/category/crossbody-bags',
  '/product/luna-mini-shoulder-bag', '/product/vintage-signet-ring', '/product/structured-tote-canvas',
  '/product/silk-print-scarf-taupe', '/product/cat-eye-sunglasses-black',
  '/search?q=bag', '/cart', '/checkout', '/wishlist', '/account',
  '/about', '/contact', '/faq', '/shipping', '/returns', '/privacy', '/terms', '/nope-404',
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

let current = '';
const errors = [];
page.on('console', (m) => {
  if (m.type() === 'error' || m.type() === 'warning') errors.push(`[${current}] ${m.type()}: ${m.text()}`);
});
page.on('pageerror', (e) => errors.push(`[${current}] pageerror: ${e.message}`));
page.on('requestfailed', (r) => errors.push(`[${current}] requestfailed: ${r.url()} ${r.failure()?.errorText}`));
page.on('response', (r) => {
  if (r.status() >= 400) errors.push(`[${current}] http ${r.status()}: ${r.url()}`);
});

const rows = [];
for (const r of ROUTES) {
  current = r;
  const before = errors.length;
  try {
    await page.goto(base + r, { waitUntil: 'networkidle', timeout: 25000 });
  } catch (e) {
    errors.push(`[${r}] NAV FAIL: ${e.message.slice(0, 120)}`);
    continue;
  }
  // force lazy-loaded images to actually load before we judge them
  try {
    await page.evaluate(async () => {
      const step = window.innerHeight;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 50));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 200));
    });
    await page.waitForLoadState('networkidle');
  } catch (e) {
    errors.push(`[${r}] scroll/wait: ${e.message.slice(0, 80)}`);
  }
  const info = await page.evaluate(() => {
    const imgs = [...document.images];
    const broken = imgs.filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.getAttribute('src'));
    const noAlt = imgs.filter((i) => !i.getAttribute('alt')).map((i) => i.getAttribute('src'));
    const h1 = document.querySelectorAll('h1').length;
    const links = [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href'));
    return {
      title: document.title,
      h1,
      imgTotal: imgs.length,
      broken,
      noAlt,
      emptyLinks: links.filter((h) => !h || h === '#').length,
      textLen: (document.body.innerText || '').trim().length,
      scrollW: document.documentElement.scrollWidth,
      clientW: document.documentElement.clientWidth,
    };
  });
  rows.push({ route: r, ...info, newErrors: errors.length - before });
}

await browser.close();

let bad = 0;
console.log(
  'route'.padEnd(36) + 'imgs broken noalt h1 overflow chars errs'
);
for (const r of rows) {
  const overflow = r.scrollW > r.clientW + 2 ? `+${r.scrollW - r.clientW}px` : 'ok';
  const problems =
    r.broken.length || r.noAlt.length || r.h1 !== 1 || overflow !== 'ok' || r.newErrors || r.textLen < 200;
  if (problems) bad++;
  console.log(
    r.route.padEnd(36) +
      String(r.imgTotal).padEnd(5) +
      String(r.broken.length).padEnd(7) +
      String(r.noAlt.length).padEnd(6) +
      String(r.h1).padEnd(3) +
      overflow.padEnd(9) +
      String(r.textLen).padEnd(6) +
      r.newErrors +
      (problems ? '  <-- CHECK' : '')
  );
  for (const b of r.broken.slice(0, 3)) console.log('      broken img:', b);
}
console.log(`\n${bad} of ${rows.length} routes flagged`);
if (errors.length) {
  console.log('\n--- console / network issues ---');
  [...new Set(errors)].slice(0, 40).forEach((e) => console.log(e));
}
fs.writeFileSync('/tmp/opencode/audit.json', JSON.stringify(rows, null, 1));
