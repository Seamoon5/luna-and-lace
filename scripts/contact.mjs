// Builds a labelled contact sheet from staged candidate photos so they can be
// reviewed by eye before any are used in the site.
// Usage: node scripts/contact.mjs <category> [outFile]
import fs from 'fs';
import path from 'path';
import { chromium } from '/home/salman/.local/mcp/playwright/node_modules/playwright/index.mjs';

const STAGE = '/home/salman/WebApps/luna-and-lace/.photo-stage';
const OUT_DIR = '/tmp/opencode/sheets-photos';
fs.mkdirSync(OUT_DIR, { recursive: true });

const mf = process.env.MF || 'manifest.json';
const manifest = JSON.parse(fs.readFileSync(path.join(STAGE, mf), 'utf8'));
const cats = process.argv[2] === 'all' ? Object.keys(manifest) : process.argv[2].split(',');
const outFile = process.argv[3] || `${OUT_DIR}/sheet.png`;

const CELL = 235;
const CAPTION = 30;
const COLS = 7;

let cells = '';
let n = 0;
for (const cat of cats) {
  (manifest[cat] || []).forEach((it) => {
    cells += `<figure><img src="file://${STAGE}/${it.file}"><figcaption><b>[${n}] ${cat}</b><br>${it.id}</figcaption></figure>`;
    n++;
  });
}

const html = `<!doctype html><meta charset="utf-8"><style>
  body{margin:0;background:#fff;font:11px/1.25 system-ui,sans-serif}
  .g{display:grid;grid-template-columns:repeat(${COLS},1fr);gap:7px;padding:9px}
  figure{margin:0}
  img{width:100%;height:${CELL - CAPTION}px;object-fit:cover;background:#f2f2f2;border:1px solid #d5d5d5;display:block}
  figcaption{padding-top:2px;color:#111}
  b{color:#a11}
</style><div class="g">${cells}</div>`;

const tmp = '/tmp/opencode/_contact.html';
fs.writeFileSync(tmp, html);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: COLS * (CELL + 7) + 20, height: 1000 } });
await page.goto('file://' + tmp, { waitUntil: 'networkidle' });
const broken = await page.evaluate(
  () => [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).length
);
await page.screenshot({ path: outFile, fullPage: true });
await browser.close();
console.log(`${n} images -> ${outFile} (broken: ${broken})`);
