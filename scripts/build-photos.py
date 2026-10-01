#!/usr/bin/env python3
"""Crop and optimise the chosen stock photos into the images the site uses.

Every pick below was reviewed by eye on a contact sheet first. Free stock
searches return plenty of irrelevant frames, so the choice is made by looking,
not by trusting the search ranking.

Output: public/img/photos/<slug>-1.jpg  (1200x1500 progressive JPEG)
        public/img/photos/hero.jpg      (2400x1350)
        public/img/photos/banner.jpg    (2400x820)
        public/img/photos/cat-<name>.jpg
        public/img/photos/gallery-<n>.jpg
        public/img/photos/map.json
"""

import json
import os
from PIL import Image, ImageOps

STAGE = '/home/salman/WebApps/luna-and-lace/.photo-stage'
OUT = '/home/salman/WebApps/luna-and-lace/public/img/photos'
PW, PH = 1000, 1250

# picks are (manifest file, category, index) so nothing depends on transcribing
# ids off a contact sheet by eye
PICKS = {
    'luna-mini-shoulder-bag':       [('manifest.json', 'shoulder-bag', 2), ('manifest.json', 'shoulder-bag', 3)],
    'velvet-crossbody-dark':        [('manifest.json', 'crossbody', 10), ('manifest.json', 'lifestyle', 4)],
    'structured-tote-canvas':       [('manifest.json', 'tote', 4), ('manifest.json', 'lifestyle', 4)],
    'evening-clutch-rose-gold':     [('manifest.json', 'clutch', 3), ('manifest.json', 'clutch', 4)],
    'slim-card-holder-tan':         [('manifest.json', 'wallet', 3), ('manifest.json', 'wallet', 13)],
    'gold-pearl-drop-earrings':     [('manifest.json', 'pearl-earrings', 2), ('manifest.json', 'pearl-earrings', 3)],
    'layered-chain-necklace':       [('manifest.json', 'chain-necklace', 2), ('manifest.json', 'chain-necklace', 14)],
    'rose-gold-cuff-bracelet':      [('manifest.json', 'cuff-bracelet', 3), ('manifest.json', 'gold-bangles', 4)],
    'vintage-signet-ring':          [('manifest-topup.json', 'tu-gold-ring', 1), ('manifest-topup.json', 'tu-gold-ring', 7)],
    'minimal-dial-watch-taupe':     [('manifest.json', 'minimal-watch', 1), ('manifest.json', 'minimal-watch', 6)],
    'gold-mesh-watch-small':        [('manifest.json', 'gold-watch', 4), ('manifest.json', 'gold-watch', 14)],
    'cat-eye-sunglasses-black':     [('manifest.json', 'cat-eye', 0), ('manifest.json', 'cat-eye', 1)],
    'oversized-aviator-sunglasses': [('manifest.json', 'aviator', 4), ('manifest.json', 'aviator', 10)],
    'silk-print-scarf-taupe':       [('manifest.json', 'silk-scarf', 9), ('manifest.json', 'silk-scarf', 7)],
    'cashmere-scarf-cream':         [('manifest-pexels.json', 'px-scarf', 7), ('manifest-pexels.json', 'px-scarf', 8)],
    'slim-leather-belt-black':      [('manifest.json', 'leather-belt', 5), ('manifest.json', 'leather-belt', 12)],
    'luxury-accessory-gift-set':    [('manifest.json', 'gift-set', 11), ('manifest.json', 'gift-set', 12)],
    'silver-hoop-earrings':         [('manifest-topup.json', 'tu-earrings-silver', 7), ('manifest-topup.json', 'tu-earrings-silver', 3)],
    'pearl-choker-necklace':        [('manifest.json', 'pearl-necklace', 10), ('manifest.json', 'pearl-necklace', 2)],
    'gold-bangle-set':              [('manifest.json', 'gold-bangles', 4), ('manifest.json', 'gold-bangles', 5)],
}

# no usable stock photo exists for this one, so it keeps the drawn illustration
KEEP_ILLUSTRATION = {'silk-scrunchie-set'}

HERO = [('manifest.json', 'lifestyle', 0), ('manifest.json', 'lifestyle', 6)]
BANNER = [('manifest.json', 'banner', 1), ('manifest.json', 'banner', 5)]

CATEGORY_PICKS = {
    'handbags': ('manifest.json', 'crossbody', 10),
    'jewelry': ('manifest.json', 'gold-bangles', 4),
    'watches': ('manifest.json', 'gold-watch', 4),
    'sunglasses': ('manifest.json', 'aviator', 10),
    'scarves': ('manifest-pexels.json', 'px-scarf', 7),
    'gift-sets': ('manifest.json', 'gift-set', 11),
}

GALLERY_PICKS = [
    ('manifest.json', 'lifestyle', 6),
    ('manifest.json', 'pearl-necklace', 2),
    ('manifest.json', 'leather-belt', 12),
    ('manifest.json', 'gold-bangles', 4),
]


MANIFESTS = {}


def load(mf):
    if mf not in MANIFESTS:
        MANIFESTS[mf] = json.load(open(os.path.join(STAGE, mf)))
    return MANIFESTS[mf]


def find(spec):
    """spec is either a filename stem or a (manifest, category, index) tuple."""
    if isinstance(spec, tuple):
        mf, cat, idx = spec
        arr = load(mf).get(cat, [])
        if idx >= len(arr):
            return None
        return os.path.join(STAGE, arr[idx]['file'])
    for ext in ('.jpg', '.jpeg', '.png'):
        p = os.path.join(STAGE, spec + ext)
        if os.path.exists(p):
            return p
    return None


def save_fit(src, dst, w, h, quality=78, cy=0.45):
    im = Image.open(src)
    if im.mode != 'RGB':
        im = im.convert('RGB')
    # bias crops slightly above centre - product shots sit high in the frame
    out = ImageOps.fit(im, (w, h), Image.LANCZOS, centering=(0.5, cy))
    out.save(dst, 'JPEG', quality=quality, optimize=True, progressive=True)
    return out.size, os.path.getsize(dst)


def main():
    os.makedirs(OUT, exist_ok=True)
    mapping = {}
    credits = []
    missing = []

    for slug, stems in PICKS.items():
        if slug in KEEP_ILLUSTRATION:
            continue
        got = []
        for i, stem in enumerate(stems, start=1):
            src = find(stem)
            if not src:
                missing.append(stem)
                continue
            name = f'{slug}-{i}.jpg'
            size, nbytes = save_fit(src, os.path.join(OUT, name), PW, PH)
            got.append('/img/photos/' + name)
            credits.append({'file': name, 'from': src.split('/')[-1], 'size': size,
                            'kb': round(nbytes / 1024)})
        if got:
            mapping[slug] = got

    for name, stems, w, h in (('hero', HERO, 2400, 1350), ('banner', BANNER, 2400, 820)):
        got = []
        for i, stem in enumerate(stems, start=1):
            src = find(stem)
            if not src:
                missing.append(stem)
                continue
            suffix = '' if i == 1 else f'-alt{i}'
            fname = f'{name}{suffix}.jpg'
            size, nbytes = save_fit(src, os.path.join(OUT, fname), w, h, 74, cy=0.5)
            got.append('/img/photos/' + fname)
            credits.append({'file': fname, 'from': src.split('/')[-1], 'size': size,
                            'kb': round(nbytes / 1024)})
        mapping[name] = got

    mapping['categories'] = {}
    for cat, stem in CATEGORY_PICKS.items():
        src = find(stem)
        if not src:
            missing.append(stem)
            continue
        fname = f'cat-{cat}.jpg'
        save_fit(src, os.path.join(OUT, fname), PW, PH, 76)
        mapping['categories'][cat] = '/img/photos/' + fname
        credits.append({'file': fname, 'from': src.split('/')[-1], 'size': [PW, PH]})

    mapping['gallery'] = []
    for i, stem in enumerate(GALLERY_PICKS, start=1):
        src = find(stem)
        if not src:
            missing.append(stem)
            continue
        fname = f'gallery-{i}.jpg'
        save_fit(src, os.path.join(OUT, fname), PW, PH, 76)
        mapping['gallery'].append('/img/photos/' + fname)
        credits.append({'file': fname, 'from': src.split('/')[-1], 'size': [PW, PH]})

    with open(os.path.join(OUT, 'map.json'), 'w') as f:
        json.dump(mapping, f, indent=1)

    total = sum(c['kb'] for c in credits if 'kb' in c)
    print(f'products mapped : {len([k for k in mapping if k not in ("categories","gallery","hero","banner")])}')
    print(f'images written  : {len(os.listdir(OUT)) - 1}')
    print(f'total size      : {round(total/1024, 1)} MB (products + hero/banner)')
    if missing:
        print('MISSING sources:', missing)
    else:
        print('all sources found')


if __name__ == '__main__':
    main()
