// Collects candidate photos for every product from free stock libraries and
// saves them into .photo-stage for visual review before anything is used.
//
// Sources, both free for commercial use:
//   Pixabay - cdn.pixabay.com only. The search page also shows iStock adverts,
//             those are a PAID agency and are deliberately ignored.
//   Pexels  - images.pexels.com. Cloudflare challenges repeat visits, so each
//             navigation waits for the challenge to clear.
//
// Usage: node scripts/fetch-photos.mjs [perCategory]
import { chromium } from '/home/salman/.local/mcp/playwright/node_modules/playwright/index.mjs';
import fs from 'fs';
import path from 'path';

const PER = Number(process.argv[2] || 16);
const STAGE = '/home/salman/WebApps/luna-and-lace/.photo-stage';
fs.mkdirSync(STAGE, { recursive: true });

const QUERIES = {
  'shoulder-bag': 'leather shoulder bag',
  crossbody: 'crossbody bag',
  tote: 'tote bag',
  clutch: 'evening clutch bag',
  wallet: 'leather wallet',
  'pearl-earrings': 'pearl earrings',
  'chain-necklace': 'layered gold necklace',
  'cuff-bracelet': 'cuff bracelet',
  'signet-ring': 'signet ring',
  'minimal-watch': 'minimalist wrist watch',
  'gold-watch': 'gold wrist watch',
  'cat-eye': 'cat eye sunglasses',
  aviator: 'aviator sunglasses',
  scrunchie: 'silk scrunchie',
  'silk-scarf': 'silk scarf',
  'cashmere-scarf': 'cashmere scarf',
  'leather-belt': 'leather belt',
  'gift-set': 'gift box accessories',
  'silver-hoops': 'silver hoop earrings',
  'pearl-necklace': 'pearl necklace',
  'gold-bangles': 'gold bangle bracelet',
  hero: 'fashion accessories flat lay',
  banner: 'jewellery accessories',
  lifestyle: 'woman fashion bag',
};


// Second pass: better search wording for categories the first pass failed.
const TOPUP = {
  'tu-hair-tie': 'hair tie ponytail',
  'tu-satin-tie': 'satin hair band',
  'tu-knit-scarf': 'knitted wool scarf',
  'tu-wool-scarf': 'winter scarf woman neck',
  'tu-gold-ring': 'gold ring jewellery',
  'tu-earrings-gold': 'gold earrings woman',
  'tu-earrings-stud': 'gold stud earrings',
  'tu-earrings-silver': 'silver earrings jewellery',
  'tu-hoops': 'hoop earrings',
  'tu-canvas-tote': 'canvas tote bag',
  'tu-shopping-bag': 'woman shopping bag fashion',
  'tu-jewelry-box': 'jewellery gift box',
  'tu-gift-wrap': 'gift box ribbon elegant',
  'tu-taupe-watch': 'beige watch strap',
  'tu-black-bag': 'black leather handbag',
};


// Third pass: Pexels only, for categories with no usable Pixabay results.
const PEXONLY = {
  'px-scarf': 'wool scarf',
  'px-scarf2': 'woman neck scarf winter',
  'px-hair': 'hair accessory',
  'px-hairclip': 'hair clip accessory',
  'px-scrunchie': 'scrunchie hair',
  'px-signet': 'signet ring gold',
  'px-ring2': 'gold ring hand',
  'px-tote': 'tote bag',
  'px-hoops': 'hoop earrings',
  'px-pearl-earr': 'pearl earrings',
};

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const browser = await chromium.launch();
const ctx = await browser.newContext({ userAgent: UA, viewport: { width: 1400, height: 1000 } });
const page = await ctx.newPage();

const settle = async () => {
  await page.evaluate(async () => {
    for (let y = 0; y < 7000; y += 700) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 200));
    }
  });
  await page.waitForTimeout(1200);
};

async function fromPixabay(phrase) {
  await page.goto(`https://pixabay.com/images/search/${encodeURIComponent(phrase)}/`, {
    waitUntil: 'domcontentloaded',
    timeout: 45000,
  });
  await page.waitForTimeout(2500);
  await settle();
  return page.evaluate(() => {
    const out = [];
    const seen = new Set();
    for (const img of document.images) {
      const src = img.src || '';
      // cdn.pixabay.com/photo/... only - skips iStock adverts and user avatars
      const m = src.match(/^(https:\/\/cdn\.pixabay\.com\/photo\/[\d/]+?[\w-]+?)_\d+\.(jpg|png|webp)$/);
      if (!m) continue;
      if (img.naturalWidth < 400) continue;
      const id = src.match(/-(\d{3,})_\d+\./)?.[1];
      if (!id || seen.has(id)) continue;
      seen.add(id);
      const page_ = img.closest('a')?.href || '';
      out.push({
        src: `${m[1]}_1280.jpg`,
        id,
        w: img.naturalWidth,
        h: img.naturalHeight,
        desc: (page_.split('/photos/')[1] || '').replace(/-\d+\/?$/, '').replace(/-/g, ' ').slice(0, 60),
        source: 'pixabay',
      });
    }
    return out;
  });
}

async function fromPexels(phrase) {
  await page.goto(`https://www.pexels.com/search/${encodeURIComponent(phrase)}/`, {
    waitUntil: 'domcontentloaded',
    timeout: 45000,
  });
  // Cloudflare may show "Just a moment..." - give it time to clear itself.
  for (let i = 0; i < 12; i++) {
    await page.waitForTimeout(2500);
    const n = await page.evaluate(() => document.querySelectorAll('a[href^="/photo/"]').length);
    if (n > 0) break;
  }
  await settle();
  return page.evaluate(() => {
    const out = [];
    const seen = new Set();
    for (const a of document.querySelectorAll('a[href^="/photo/"]')) {
      const m = a.getAttribute('href').match(/^\/photo\/(?:[^/]+-)?(\d+)\/?$/);
      if (!m || seen.has(m[1])) continue;
      seen.add(m[1]);
      out.push({
        src: `https://images.pexels.com/photos/${m[1]}/pexels-photo-${m[1]}.jpeg?auto=compress&cs=tinysrgb&w=1400`,
        id: m[1],
        desc: a.getAttribute('href').replace(/^\/photo\/|\/$/g, '').replace(/-\d+$/, '').replace(/-/g, ' ').slice(0, 60),
        source: 'pexels',
      });
    }
    return out;
  });
}

const manifest = {};
let newFiles = 0;

const MODE = process.argv[3];
const SET = MODE === 'topup' ? TOPUP : MODE === 'pexels' ? PEXONLY : QUERIES;
const ONLY_PEXELS = MODE === 'pexels';

for (const [key, phrase] of Object.entries(SET)) {
  let found = [];
  const sources = ONLY_PEXELS ? [['pexels', fromPexels]] : [['pixabay', fromPixabay], ['pexels', fromPexels]];
  for (const [name, fn] of sources) {
    try {
      const got = await fn(phrase);
      if (got.length) {
        found = got;
        console.log(`  ${key.padEnd(18)} ${String(got.length).padStart(3)} from ${name}`);
      }
    } catch (e) {
      console.log(`  ${key.padEnd(18)} ${name} failed: ${String(e.message).slice(0, 50)}`);
    }
    if (found.length >= PER) break;
    await page.waitForTimeout(900);
  }

  manifest[key] = [];
  for (const item of found.slice(0, PER)) {
    const file = path.join(STAGE, `${key}__${item.source}-${item.id}.jpg`);
    if (!fs.existsSync(file)) {
      try {
        const res = await page.request.get(item.src, { timeout: 30000 });
        if (!res.ok()) continue;
        const buf = await res.body();
        if (buf.length < 15000) continue;
        fs.writeFileSync(file, buf);
        newFiles++;
      } catch {
        continue;
      }
    }
    manifest[key].push({ ...item, file: path.basename(file) });
  }
  console.log(`  ${key.padEnd(18)} -> ${manifest[key].length} candidates saved`);
}

const mf = path.join(STAGE, MODE === 'topup' ? 'manifest-topup.json' : MODE === 'pexels' ? 'manifest-pexels.json' : 'manifest.json');
fs.writeFileSync(mf, JSON.stringify(manifest, null, 1));
await browser.close();
console.log(`\n${newFiles} new files. Manifest: ${mf}`);
console.log(
  'candidates per category: ' +
    Object.entries(manifest)
      .map(([k, v]) => `${k}=${v.length}`)
      .join(' ')
);
