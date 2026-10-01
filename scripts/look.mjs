// Screenshots one or more SVGs at a chosen width so wide scenes can be checked.
import { chromium } from '/home/salman/.local/mcp/playwright/node_modules/playwright/index.mjs';
import fs from 'fs';

const dir = '/home/salman/WebApps/luna-and-lace/public/img';
const names = process.argv.slice(3);
const out = process.argv[2];

const cells = names
  .map((n) => `<figure><img src="file://${dir}/${n}.svg"><figcaption>${n}</figcaption></figure>`)
  .join('');
const html = `<!doctype html><meta charset="utf-8"><style>
 body{margin:0;background:#fff;font:12px system-ui} figure{margin:0 0 10px}
 img{width:100%;display:block;border:1px solid #ddd} figcaption{padding:3px;color:#555}
</style>${cells}`;

const tmp = '/tmp/opencode/_look.html';
fs.writeFileSync(tmp, html);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });
await page.goto('file://' + tmp, { waitUntil: 'networkidle' });
const broken = await page.evaluate(() =>
  [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).length
);
await page.screenshot({ path: out, fullPage: true });
await browser.close();
console.log('broken:', broken, '->', out);
