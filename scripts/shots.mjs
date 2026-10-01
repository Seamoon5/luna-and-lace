// Screenshots key pages at desktop + mobile so the layout can be reviewed by eye.
// Usage: node scripts/shots.mjs [baseUrl]
import { chromium } from '/home/salman/.local/mcp/playwright/node_modules/playwright/index.mjs';

const base = process.argv[2] || 'http://127.0.0.1:5180';
const OUT = '/tmp/opencode/shots';

const SHOTS = [
  ['home-desktop', '/', 1440, 900, true],
  ['shop-desktop', '/shop', 1440, 900, false],
  ['product-desktop', '/product/luna-mini-shoulder-bag', 1440, 1000, false],
  ['category-desktop', '/category/jewelry', 1440, 900, false],
  ['cart-desktop', '/cart', 1440, 900, false],
  ['home-mobile', '/', 390, 844, true],
  ['shop-mobile', '/shop', 390, 844, false],
  ['product-mobile', '/product/luna-mini-shoulder-bag', 390, 844, false],
];

const browser = await chromium.launch();
const issues = [];

for (const [name, route, w, h, full] of SHOTS) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: 1,
    isMobile: w < 500,
    hasTouch: w < 500,
  });
  const page = await ctx.newPage();
  page.on('console', (m) => m.type() === 'error' && issues.push(`${name}: ${m.text()}`));
  page.on('pageerror', (e) => issues.push(`${name}: ${e.message}`));
  await page.goto(base + route, { waitUntil: 'networkidle' });
  if (full) {
   try {
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(1200);
   } catch { /* page reloaded while scrolling - fine */ }
  }
  let overflow = 0;
  try {
    overflow = await page.evaluate(() => {
      const d = document.documentElement;
      return d.scrollWidth - d.clientWidth;
    });
  } catch { /* ignore */ }
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: full });
  console.log(
    `${name.padEnd(20)} ${route.padEnd(34)} overflow=${overflow > 2 ? '+' + overflow + 'px !!' : 'ok'}`
  );
  await ctx.close();
}

await browser.close();
if (issues.length) {
  console.log('\n--- console issues ---');
  [...new Set(issues)].forEach((i) => console.log(i));
} else {
  console.log('\nno console errors');
}
