// Renders every generated SVG and saves a contact sheet so the artwork can be
// reviewed by eye. Usage: node scripts/sheet.mjs [outfile] [cols]
import { chromium } from '/home/salman/.local/mcp/playwright/node_modules/playwright/index.mjs';
import fs from 'fs';

const dir = '/home/salman/WebApps/luna-and-lace/public/img';
const out = process.argv[2] || '/tmp/opencode/art-sheet.png';
const cols = Number(process.argv[3] || 7);

const files = fs.readdirSync(dir).filter((f) => f.endsWith('.svg')).sort();
const cells = files
  .map(
    (f) =>
      `<figure><img src="file://${dir}/${f}" alt=""><figcaption>${f.replace('.svg', '')}</figcaption></figure>`
  )
  .join('');

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  body { margin:0; background:#fff; font:12px/1.3 system-ui, sans-serif; }
  .grid { display:grid; grid-template-columns:repeat(${cols},1fr); gap:10px; padding:12px; }
  figure { margin:0; }
  img { width:100%; display:block; border:1px solid #ddd; }
  figcaption { color:#555; padding-top:3px; font-size:11px; word-break:break-word; }
</style></head><body><div class="grid">${cells}</div></body></html>`;

const tmp = '/tmp/opencode/_sheet.html';
fs.writeFileSync(tmp, html);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1500, height: 1000 } });
const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
await page.goto('file://' + tmp);
await page.waitForLoadState('networkidle');
const broken = await page.evaluate(() =>
  [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.src)
);
await page.screenshot({ path: out, fullPage: true });
await browser.close();

console.log('files:', files.length);
console.log('broken images:', broken.length, broken.slice(0, 10));
if (errors.length) console.log('console errors:', errors.slice(0, 5));
console.log('wrote', out);
