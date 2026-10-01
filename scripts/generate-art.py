#!/usr/bin/env python3
"""
LUNA & LACE - product artwork generator.

Creates every product image as a small SVG file. One shared visual language:
warm ivory backdrop, soft ground shadow, softly shaded product shape with thin
outline and brass hardware. Colourway is the only thing that changes between a
product's two gallery images, so the hover swap on a product card feels real.

Run:  python3 scripts/generate-art.py
"""

import os

W, H = 1200, 1500           # 4:5 - matches the product card frame
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'public', 'img')

# ---------------------------------------------------------------- palette ---
BACKDROP = ('#faf8f5', '#efeae1')     # top -> bottom wash
HIGHLIGHT = '#ffffff'                 # soft glow behind the product
GOLD = ('#c9a227', '#a37f3f', '#e8d6a2')
LEATHER = {
    'black':    ('#3a3733', '#1e1c19'),
    'ink':      ('#2f2d33', '#17161a'),
    'tan':      ('#c39a6b', '#8f6b40'),
    'cognac':   ('#b8794a', '#8a5330'),
    'blush':    ('#d9b3a5', '#b98d7d'),
    'cream':    ('#ece4d5', '#cfc3ad'),
    'burgundy': ('#7c3339', '#521f24'),
    'forest':   ('#3d5145', '#26332b'),
    'midnight': ('#2b3348', '#171c2b'),
    'taupe':    ('#b3a795', '#8a7f6d'),
    'stone':    ('#a8a29a', '#7d776f'),
    'rosegold': ('#d7a893', '#b07e68'),
    'silver':   ('#c9ccd1', '#9aa0a8'),
    'gold':     ('#d8b45f', '#a37f3f'),
    'stone':    ('#b5aca0', '#8b8175'),
}


def hx(h):
    h = h.lstrip('#')
    if len(h) == 3:
        h = ''.join(c * 2 for c in h)
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def mix(a, b, t):
    """Blend two hex colours, t=0 -> a, t=1 -> b."""
    ra, ga, ba = hx(a)
    rb, gb, bb = hx(b)
    return '#%02x%02x%02x' % (round(ra + (rb - ra) * t),
                              round(ga + (gb - ga) * t),
                              round(ba + (bb - ba) * t))


# ----------------------------------------------------------------- shapes ---
def body_path(d, light, dark, gid, stroke='#3b372f', sw=5):
    """Wrap a path/fill in a soft gradient plus a thin outline."""
    return (f'<path d="{d}" fill="url(#{gid})" stroke="{stroke}" '
            f'stroke-width="{sw}" stroke-linejoin="round"/>')


def frame(shapes, defs='', kind=None):
    """Backdrop + a shadow sized to the product, which is centred in the frame.

    Every product is scaled and centred on the same box so a tall tote and a
    short pair of earrings read as equally important on the shelf.
    """
    if kind and kind in BOUNDS:
        lo, hi, top, bo = BOUNDS[kind]
        w, h = hi - lo, bo - top
        # keep real-world scale differences, only nudge them into a common box
        sc = min(880 / w, 960 / h)
        sc = max(0.78, min(1.16, sc))
        cx, cy = (lo + hi) / 2, (top + bo) / 2
        tx, ty = 600 - cx * sc, 700 - cy * sc
        shapes = f'<g transform="translate({tx:.1f},{ty:.1f}) scale({sc:.3f})">{shapes}</g>'
        sh_w = (w * sc) / 2
        shadow = (
            f'<ellipse cx="600" cy="{700 + sh_w * 0 + (h * sc) / 2 + 26:.0f}" rx="{sh_w * 0.86:.0f}" '
            f'ry="{max(14, sh_w * 0.1):.0f}" fill="#2d2b28" opacity="0.15"/>'
        )
    else:
        shadow = ('<ellipse cx="600" cy="1275" rx="330" ry="42" fill="#2d2b28" opacity="0.16"/>'
                  '<ellipse cx="600" cy="1272" rx="230" ry="26" fill="#2d2b28" opacity="0.14"/>')

    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="{BACKDROP[0]}"/>
      <stop offset="1" stop-color="{BACKDROP[1]}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.42" r="0.55">
      <stop offset="0" stop-color="{HIGHLIGHT}" stop-opacity="0.95"/>
      <stop offset="1" stop-color="{HIGHLIGHT}" stop-opacity="0"/>
    </radialGradient>
{GOLD_GRAD}
{defs}
  </defs>
  <rect width="{W}" height="{H}" fill="url(#bg)"/>
  <rect width="{W}" height="{H}" fill="url(#glow)"/>
  {shadow}
  {shapes}
</svg>'''


def grads(gid, c):
    """Gradient for a product colourway."""
    light, dark = LEATHER[c] if c in LEATHER else (c, mix(c, '#000000', 0.25))
    return f'''<linearGradient id="{gid}" x1="0.15" y1="0" x2="0.9" y2="1">
      <stop offset="0" stop-color="{light}"/>
      <stop offset="1" stop-color="{dark}"/>
    </linearGradient>''', light, dark


def gold_grad(gid='gold'):
    return f'''<linearGradient id="{gid}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="{GOLD[2]}"/>
      <stop offset="0.45" stop-color="{GOLD[0]}"/>
      <stop offset="1" stop-color="{GOLD[1]}"/>
    </linearGradient>'''


def sheen(x, y, w, h, rot=-18, op=0.5):
    return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{w//2}" fill="#ffffff" '
            f'opacity="{op}" transform="rotate({rot} {x+w/2} {y+h/2})"/>')


GOLD_GRAD = f'''<linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="{GOLD[2]}"/>
      <stop offset="0.45" stop-color="{GOLD[0]}"/>
      <stop offset="1" stop-color="{GOLD[1]}"/>
    </linearGradient>
    <radialGradient id="pearlsheen" cx="0.35" cy="0.3" r="0.75">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset="0.55" stop-color="#f3e7dc"/>
      <stop offset="1" stop-color="#d9c6b6"/>
    </radialGradient>'''

# ============================================================ product art ===
def art_shoulder_bag(c, variant=0):
    """Structured mini shoulder bag with a curved top handle."""
    g, light, dark = grads('p', c)
    flap = (f'<path d="M330 520 Q600 470 870 520 L880 640 Q600 596 320 640 Z" '
            f'fill="{mix(dark, "#000", 0.15)}" stroke="#3b372f" stroke-width="5" stroke-linejoin="round"/>')
    handle = (f'<path d="M455 520 Q455 330 600 322 Q745 330 745 520" fill="none" '
              f'stroke="{mix(dark, "#000", 0.1)}" stroke-width="30" stroke-linecap="round"/>'
              f'<path d="M455 512 Q455 336 600 328 Q745 336 745 512" fill="none" '
              f'stroke="{light}" stroke-width="9" stroke-linecap="round" opacity="0.55"/>')
    body = (f'<path d="M330 560 Q330 520 372 512 L828 512 Q870 520 870 560 L892 1160 '
            f'Q894 1225 830 1232 L370 1232 Q306 1225 308 1160 Z" fill="url(#p)" '
            f'stroke="#3b372f" stroke-width="5" stroke-linejoin="round"/>')
    clasp = (f'<rect x="558" y="596" width="84" height="52" rx="14" fill="url(#gold)" '
             f'stroke="{GOLD[1]}" stroke-width="3"/>'
             f'<rect x="576" y="612" width="48" height="20" rx="8" fill="{GOLD[1]}" opacity="0.55"/>')
    feet = ''.join(f'<rect x="{x}" y="1218" width="46" height="20" rx="8" fill="url(#gold)"/>'
                   for x in (352, 802))
    strap = ''
    if variant:
        strap = (f'<path d="M330 560 Q196 700 232 1120" fill="none" stroke="{dark}" '
                 f'stroke-width="20" stroke-linecap="round" opacity="0.92"/>'
                 f'<circle cx="232" cy="1128" r="20" fill="url(#gold)"/>')
    return (g, handle + strap + body + feet + flap + clasp +
            sheen(360, 620, 150, 520, -8, 0.16) +
            f'<path d="M370 1180 Q600 1215 830 1180" fill="none" stroke="{dark}" stroke-width="4" opacity="0.35"/>')


def art_tote(c, variant=0):
    """Tall structured tote, straight sides, twin handles."""
    g, light, dark = grads('p', c)
    body = (f'<path d="M336 480 L864 480 L846 1198 Q844 1240 800 1240 L400 1240 '
            f'Q356 1240 354 1198 Z" fill="url(#p)" stroke="#3b372f" stroke-width="5" '
            f'stroke-linejoin="round"/>')
    h1 = (f'<path d="M432 480 L432 356 Q432 300 488 300 Q544 300 544 356 L544 480" fill="none" '
          f'stroke="{mix(dark, "#000", 0.1)}" stroke-width="26" stroke-linecap="round"/>'
          f'<path d="M656 480 L656 356 Q656 300 712 300 Q768 300 768 356 L768 480" fill="none" '
          f'stroke="{mix(dark, "#000", 0.1)}" stroke-width="26" stroke-linecap="round"/>'
          f'<path d="M432 470 L432 360 Q432 306 488 306" fill="none" stroke="{light}" '
          f'stroke-width="7" stroke-linecap="round" opacity="0.5"/>')
    band = (f'<rect x="336" y="612" width="528" height="10" fill="{dark}" opacity="0.3"/>'
            f'<rect x="336" y="1010" width="528" height="8" fill="{dark}" opacity="0.22"/>')
    tag = (f'<rect x="700" y="640" width="72" height="94" rx="10" fill="url(#gold)" '
           f'stroke="{GOLD[1]}" stroke-width="3"/>')
    feet = ''.join(f'<rect x="{x}" y="1230" width="48" height="18" rx="8" fill="url(#gold)"/>'
                   for x in (392, 760))
    return (g, h1 + body + band + tag + feet +
            sheen(380, 520, 130, 660, -7, 0.15))


def art_crossbody(c, variant=0):
    """Soft rectangular crossbody worn on a long strap."""
    g, light, dark = grads('p', c)
    strap = (f'<path d="M390 640 Q600 236 810 640" fill="none" stroke="{mix(dark, "#000", 0.25)}" '
             f'stroke-width="22" stroke-linecap="round"/>'
             f'<path d="M390 630 Q600 250 810 630" fill="none" stroke="{light}" stroke-width="6" '
             f'stroke-linecap="round" opacity="0.45"/>')
    body = (f'<path d="M340 636 Q600 604 860 636 L872 1020 Q874 1080 812 1088 L388 1088 '
            f'Q326 1080 328 1020 Z" fill="url(#p)" stroke="#3b372f" stroke-width="5" '
            f'stroke-linejoin="round"/>')
    flap = (f'<path d="M340 660 Q600 632 860 660 L864 800 Q600 768 336 800 Z" '
            f'fill="{mix(dark, "#000", 0.12)}" stroke="#3b372f" stroke-width="4" stroke-linejoin="round"/>')
    turn = (f'<circle cx="600" cy="812" r="40" fill="url(#gold)" stroke="{GOLD[1]}" stroke-width="3"/>'
            f'<circle cx="600" cy="812" r="16" fill="{GOLD[1]}" opacity="0.6"/>')
    return (g, strap + body + flap + turn + sheen(372, 660, 120, 360, -8, 0.17))


def art_clutch(c, variant=0):
    """Flat evening clutch, envelope flap, chain strap."""
    g, light, dark = grads('p', c)
    body = (f'<path d="M296 640 L904 640 L872 1080 Q870 1116 832 1116 L368 1116 '
            f'Q330 1116 328 1080 Z" fill="url(#p)" stroke="#3b372f" stroke-width="5" '
            f'stroke-linejoin="round"/>')
    flap = (f'<path d="M296 640 L600 900 L904 640 Z" fill="{mix(dark, "#000", 0.1)}" '
            f'stroke="#3b372f" stroke-width="5" stroke-linejoin="round"/>')
    chain = (f'<path d="M330 640 Q470 420 600 430 Q730 420 870 640" fill="none" '
             f'stroke="url(#gold)" stroke-width="12" stroke-linecap="round" stroke-dasharray="4 16"/>'
             f'<path d="M330 640 Q470 420 600 430 Q730 420 870 640" fill="none" '
             f'stroke="{GOLD[1]}" stroke-width="4" opacity="0.5"/>')
    stud = f'<circle cx="600" cy="906" r="26" fill="url(#gold)" stroke="{GOLD[1]}" stroke-width="3"/>'
    return (g, body + chain + flap + stud + sheen(330, 670, 120, 380, -8, 0.18))


def art_wallet(c, variant=0):
    """Slim card holder, one open slot."""
    g, light, dark = grads('p', c)
    back = (f'<path d="M336 452 L872 452 L872 1052 Q872 1092 832 1092 L336 1092 Z" '
            f'fill="{mix(dark, "#000", 0.08)}" stroke="#3b372f" stroke-width="5" stroke-linejoin="round"/>')
    front = (f'<path d="M312 700 L864 700 Q890 700 890 726 L890 1104 Q890 1130 864 1130 '
             f'L312 1130 Z" fill="url(#p)" stroke="#3b372f" stroke-width="5" stroke-linejoin="round"/>')
    cards = (f'<path d="M368 596 L836 596 L836 742 L368 742 Z" fill="#ffffff" opacity="0.94" '
             f'stroke="#3b372f" stroke-width="3"/>'
             f'<path d="M398 634 L790 634" stroke="{dark}" stroke-width="7" opacity="0.35" '
             f'stroke-linecap="round"/>'
             f'<path d="M398 676 L700 676" stroke="{dark}" stroke-width="7" opacity="0.22" '
             f'stroke-linecap="round"/>')
    stitch = (f'<path d="M348 1160 L854 1160" stroke="{GOLD[0]}" stroke-width="4" '
              f'stroke-dasharray="10 12" opacity="0.75" stroke-linecap="round"/>')
    return (g, back + cards + front + stitch + sheen(330, 720, 110, 360, -7, 0.16))


def art_ring(c, variant=0):
    """Chunky signet ring standing upright, seen from the front."""
    g, light, dark = grads('p', c)
    band = (f'<circle cx="600" cy="880" r="240" fill="none" stroke="url(#p)" stroke-width="76"/>'
            f'<circle cx="600" cy="880" r="278" fill="none" stroke="#3b372f" stroke-width="3" opacity="0.5"/>'
            f'<circle cx="600" cy="880" r="202" fill="none" stroke="#3b372f" stroke-width="3" opacity="0.5"/>'
            f'<path d="M424 760 A240 240 0 0 1 566 652" fill="none" stroke="{light}" stroke-width="16" '
            f'stroke-linecap="round" opacity="0.6"/>')
    # signet face - an oval that sits on the band and reads as engraved metal
    face = (f'<ellipse cx="600" cy="648" rx="126" ry="96" fill="url(#gold)" stroke="{GOLD[1]}" stroke-width="4"/>'
            f'<ellipse cx="600" cy="632" rx="96" ry="66" fill="none" stroke="{GOLD[1]}" stroke-width="6" opacity="0.55"/>'
            f'<path d="M540 640 L660 640" stroke="{GOLD[2]}" stroke-width="9" opacity="0.6" stroke-linecap="round"/>'
            f'<path d="M556 690 L644 690" stroke="{GOLD[2]}" stroke-width="7" opacity="0.4" stroke-linecap="round"/>')
    return (g, band + face)


def art_watch(c, variant=0):
    """Minimal dial watch with a soft leather strap."""
    g, light, dark = grads('p', c)
    strap = (f'<path d="M520 250 L680 250 L680 640 L520 640 Z" fill="url(#p)" stroke="#3b372f" '
             f'stroke-width="5" stroke-linejoin="round"/>'
             f'<path d="M520 860 L680 860 L680 1250 Q680 1284 646 1284 L554 1284 '
             f'Q520 1284 520 1250 Z" fill="url(#p)" stroke="#3b372f" stroke-width="5" '
             f'stroke-linejoin="round"/>'
             f'<path d="M600 280 L600 620 M600 880 L600 1258" stroke="{dark}" stroke-width="5" '
             f'stroke-dasharray="12 12" opacity="0.5"/>')
    case_ = (f'<circle cx="600" cy="750" r="196" fill="url(#gold)" stroke="{GOLD[1]}" stroke-width="4"/>'
             f'<circle cx="600" cy="750" r="172" fill="url(#p)" stroke="#3b372f" stroke-width="4"/>')
    dial = (f'<circle cx="600" cy="750" r="150" fill="{mix(light, "#ffffff", 0.55)}"/>')
    ticks = ''.join(
        f'<line x1="{600 + 118*__import__("math").cos(i*3.14159/6 - 1.5708):.0f}" '
        f'y1="{750 + 118*__import__("math").sin(i*3.14159/6 - 1.5708):.0f}" '
        f'x2="{600 + 132*__import__("math").cos(i*3.14159/6 - 1.5708):.0f}" '
        f'y2="{750 + 132*__import__("math").sin(i*3.14159/6 - 1.5708):.0f}" '
        f'stroke="{dark}" stroke-width="9" stroke-linecap="round" opacity="0.75"/>'
        for i in range(12))
    hands = (f'<line x1="600" y1="750" x2="600" y2="668" stroke="{dark}" stroke-width="11" '
             f'stroke-linecap="round"/>'
             f'<line x1="600" y1="750" x2="672" y2="790" stroke="{dark}" stroke-width="9" '
             f'stroke-linecap="round"/>'
             f'<circle cx="600" cy="750" r="12" fill="url(#gold)"/>'
             f'<rect x="770" y="734" width="40" height="26" rx="10" fill="url(#gold)"/>')
    return (g, strap + case_ + dial + ticks + hands)


def art_earrings(c, variant=0):
    """Matching pearl drop earrings - hook, gold cap, pearl."""
    g, light, dark = grads('p', c)
    out = ''
    for cx in (372, 828):
        out += (
            # hook
            f'<path d="M{cx-26} 430 Q{cx} 372 {cx+26} 430" fill="none" stroke="url(#gold)" stroke-width="11" stroke-linecap="round"/>'
            f'<circle cx="{cx}" cy="432" r="15" fill="url(#gold)"/>'
            # link
            f'<path d="M{cx} 447 L{cx} 546" stroke="url(#gold)" stroke-width="10" stroke-linecap="round"/>'
            f'<circle cx="{cx}" cy="500" r="19" fill="url(#gold)" stroke="{GOLD[1]}" stroke-width="3"/>'
            # gold cap
            f'<path d="M{cx-58} 566 Q{cx} 528 {cx+58} 566 L{cx+50} 616 Q{cx} 634 {cx-50} 616 Z" '
            f'fill="url(#gold)" stroke="{GOLD[1]}" stroke-width="3" stroke-linejoin="round"/>'
            # pearl
            f'<circle cx="{cx}" cy="700" r="92" fill="#f8f3ec" stroke="{GOLD[1]}" stroke-width="4"/>'
            f'<circle cx="{cx}" cy="700" r="92" fill="url(#pearlsheen)" opacity="0.55"/>'
            f'<ellipse cx="{cx-30}" cy="666" rx="30" ry="22" fill="#ffffff" opacity="0.9" '
            f'transform="rotate(-28 {cx-30} 666)"/>')
    pearl = ''
    return (g, out)


def art_necklace(c, variant=0):
    """Layered chain necklace, drawn as it hangs."""
    g, light, dark = grads('p', c)
    hook = (f'<path d="M560 300 a40 40 0 1 1 80 0" fill="none" stroke="url(#gold)" stroke-width="15"/>'
            f'<path d="M600 340 L600 372" stroke="url(#gold)" stroke-width="13" stroke-linecap="round"/>')
    outer = (f'<path d="M330 372 Q600 1060 870 372" fill="none" stroke="url(#gold)" stroke-width="19" '
             f'stroke-linecap="round"/>'
             f'<path d="M346 386 Q600 1032 854 386" fill="none" stroke="{GOLD[1]}" stroke-width="6" '
             f'stroke-linecap="round" opacity="0.4"/>')
    inner = (f'<path d="M392 430 Q600 986 808 430" fill="none" stroke="url(#gold)" stroke-width="15" '
             f'stroke-linecap="round"/>')
    third = (f'<path d="M456 500 Q600 890 744 500" fill="none" stroke="url(#gold)" stroke-width="13" '
             f'stroke-linecap="round"/>')
    # beads sitting on the chains (chain lowest point is y=716)
    beads = ''.join(f'<circle cx="{x}" cy="{y}" r="17" fill="url(#gold)" stroke="{GOLD[1]}" stroke-width="2"/>'
                    for x, y in ((452, 452), (556, 556), (644, 556), (748, 452), (420, 560), (780, 560)))
    bail = f'<path d="M600 716 L600 752" stroke="url(#gold)" stroke-width="13" stroke-linecap="round"/>'
    pendant = (f'<circle cx="600" cy="820" r="64" fill="url(#gold)" stroke="{GOLD[1]}" stroke-width="4"/>'
               f'<circle cx="600" cy="820" r="36" fill="none" stroke="{GOLD[1]}" stroke-width="7" opacity="0.5"/>'
               f'<circle cx="600" cy="820" r="15" fill="{GOLD[1]}" opacity="0.6"/>')
    return (g, hook + outer + inner + third + beads + bail + pendant)


def art_hoops(c, variant=0):
    """Two thick hoop earrings with a hinge and clasp."""
    g, light, dark = grads('p', c)
    out = ''
    for cx, cy, r, w in ((388, 790, 190, 62), (812, 790, 190, 62)):
        out += (
            f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="url(#p)" stroke-width="{w}"/>'
            f'<circle cx="{cx}" cy="{cy}" r="{r + w//2}" fill="none" stroke="#3b372f" stroke-width="3" opacity="0.5"/>'
            f'<circle cx="{cx}" cy="{cy}" r="{r - w//2}" fill="none" stroke="#3b372f" stroke-width="3" opacity="0.5"/>'
            f'<path d="M{cx-r+20} {cy+70} A{r} {r} 0 0 1 {cx-40} {cy-r+16}" fill="none" stroke="{light}" '
            f'stroke-width="14" stroke-linecap="round" opacity="0.6"/>'
            # hinge barrel at the top
            f'<rect x="{cx-15}" y="{cy-r-w//2-14}" width="30" height="44" rx="10" fill="url(#gold)" stroke="{GOLD[1]}" stroke-width="3"/>'
            # clasp nub on the back
            f'<circle cx="{cx}" cy="{cy+r+w//2-6}" r="17" fill="url(#gold)" stroke="{GOLD[1]}" stroke-width="3"/>')
    return (g, out)


def art_bracelet(c, variant=0):
    """Open cuff bracelet - a wide, round open bangle."""
    g, light, dark = grads('p', c)
    cuff = (
        f'<path d="M392 654 L392 792 A208 246 0 0 0 808 792 L808 654 L742 654 L742 786 '
        f'A142 180 0 0 1 458 786 L458 654 Z" '
        f'fill="url(#p)" stroke="#3b372f" stroke-width="5" stroke-linejoin="round"/>'
        f'<path d="M424 720 L424 800 A176 214 0 0 0 776 800 L776 720" fill="none" stroke="{light}" '
        f'stroke-width="15" stroke-linecap="round" opacity="0.5"/>'
    )
    rims = ''.join(
        f'<rect x="{x-46}" y="638" width="92" height="36" rx="18" fill="url(#gold)" stroke="{GOLD[1]}" stroke-width="3"/>'
        for x in (392, 808))
    return (g, cuff + rims)


def art_bangles(c, variant=0):
    """A pair of bangles resting together."""
    g, light, dark = grads('p', c)
    def ring(cx, cy, r, w):
        return (
            f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="url(#gold)" stroke-width="{w}"/>'
            f'<circle cx="{cx}" cy="{cy}" r="{r + w//2}" fill="none" stroke="#3b372f" stroke-width="3" opacity="0.45"/>'
            f'<circle cx="{cx}" cy="{cy}" r="{r - w//2}" fill="none" stroke="#3b372f" stroke-width="3" opacity="0.45"/>'
            f'<path d="M{cx - r + 30} {cy + 60} A{r} {r} 0 0 1 {cx - 30} {cy - r + 26}" fill="none" '
            f'stroke="{GOLD[2]}" stroke-width="13" stroke-linecap="round" opacity="0.7"/>')
    return (g, ring(452, 880, 250, 74) + ring(748, 830, 210, 62))


def art_sunglasses(c, variant=0):
    """Front view sunglasses."""
    g, light, dark = grads('p', c)
    lens_l = (f'<path d="M212 620 L560 620 L548 760 Q536 852 400 852 Q268 852 252 764 Z" '
              f'fill="#2f3238" stroke="{GOLD[1]}" stroke-width="6" stroke-linejoin="round"/>')
    lens_r = (f'<path d="M988 620 L640 620 L652 760 Q664 852 800 852 Q932 852 948 764 Z" '
              f'fill="#2f3238" stroke="{GOLD[1]}" stroke-width="6" stroke-linejoin="round"/>')
    shine = (f'<path d="M262 660 L430 660 L404 726 L286 726 Z" fill="#ffffff" opacity="0.2"/>'
             f'<path d="M740 660 L908 660 L886 726 L768 726 Z" fill="#ffffff" opacity="0.2"/>')
    frame = (f'<path d="M212 620 L560 620 L548 764 Q536 852 400 852 Q268 852 252 764 Z" fill="none" '
             f'stroke="url(#p)" stroke-width="26" stroke-linejoin="round"/>'
             f'<path d="M988 620 L640 620 L652 764 Q664 852 800 852 Q932 852 948 764 Z" fill="none" '
             f'stroke="url(#p)" stroke-width="26" stroke-linejoin="round"/>'
             f'<path d="M556 672 Q600 640 644 672" fill="none" stroke="url(#p)" stroke-width="24"/>'
             f'<path d="M212 640 L104 616" stroke="url(#p)" stroke-width="24" stroke-linecap="round"/>'
             f'<path d="M988 640 L1096 616" stroke="url(#p)" stroke-width="24" stroke-linecap="round"/>')
    return (g, frame + lens_l + lens_r + shine)


def art_scarf(c, variant=0):
    """Folded scarf with a draped front and fringed edge."""
    g, light, dark = grads('p', c)
    body = (
        f'<path d="M296 512 Q600 470 904 512 Q932 700 924 900 Q918 1080 900 1184 '
        f'Q600 1214 300 1184 Q282 1080 276 900 Q268 700 296 512 Z" '
        f'fill="url(#p)" stroke="#3b372f" stroke-width="5" stroke-linejoin="round"/>'
    )
    fold = (
        f'<path d="M296 512 Q600 470 904 512 Q916 592 912 648 Q600 610 288 648 Q284 592 296 512 Z" '
        f'fill="{mix(dark, "#000000", 0.12)}" stroke="#3b372f" stroke-width="4" stroke-linejoin="round"/>'
    )
    curves = ''
    for i, x in enumerate((380, 500, 620, 740, 860)):
        op = 0.30 - i * 0.02
        curves += (f'<path d="M{x} 660 Q{x - 26} 900 {x} 1170" fill="none" stroke="{dark}" '
                   f'stroke-width="6" opacity="{op:.2f}" stroke-linecap="round"/>')
    hem = (f'<path d="M300 1178 Q600 1208 900 1178" fill="none" stroke="{dark}" stroke-width="7" opacity="0.4"/>')
    fringe = ''.join(
        f'<path d="M{312 + i * 29} 1186 Q{312 + i * 29} 1236 {306 + i * 29} 1262" fill="none" '
        f'stroke="{mix(dark, "#000000", 0.1)}" stroke-width="9" stroke-linecap="round" opacity="0.85"/>'
        for i in range(21))
    return (g, body + curves + hem + fold + fringe + sheen(316, 540, 96, 600, -7, 0.16))


def art_belt(c, variant=0):
    """Leather belt, coiled with a square buckle."""
    g, light, dark = grads('p', c)
    coil = (
        f'<path d="M300 470 Q600 396 900 470 Q918 620 906 800 Q896 980 878 1150 '
        f'Q600 1196 322 1150 Q304 980 294 800 Q282 620 300 470 Z" '
        f'fill="url(#p)" stroke="#3b372f" stroke-width="5" stroke-linejoin="round"/>'
    )
    stitch = (
        f'<path d="M338 500 Q600 434 862 500" fill="none" stroke="{GOLD[0]}" stroke-width="4" '
        f'stroke-dasharray="13 13" opacity="0.75" stroke-linecap="round"/>'
        f'<path d="M330 1120 Q600 1160 870 1120" fill="none" stroke="{GOLD[0]}" stroke-width="4" '
        f'stroke-dasharray="13 13" opacity="0.75" stroke-linecap="round"/>'
    )
    holes = ''.join(f'<circle cx="600" cy="{618 + i * 122}" r="17" fill="{dark}" opacity="0.8"/>'
                    for i in range(5))
    keeper = (f'<rect x="396" y="760" width="52" height="150" rx="16" fill="{mix(dark, "#000000", 0.12)}" '
              f'stroke="#3b372f" stroke-width="4"/>')
    buckle = (
        f'<rect x="486" y="326" width="228" height="184" rx="30" fill="url(#gold)" stroke="{GOLD[1]}" stroke-width="5"/>'
        f'<rect x="532" y="368" width="136" height="100" rx="16" fill="none" stroke="{GOLD[1]}" stroke-width="11"/>'
        f'<rect x="576" y="316" width="26" height="206" rx="11" fill="url(#gold)" stroke="{GOLD[1]}" stroke-width="3"/>'
        f'<path d="M506 350 L560 350" stroke="{GOLD[2]}" stroke-width="8" opacity="0.6" stroke-linecap="round"/>'
    )
    return (g, coil + stitch + holes + keeper + buckle + sheen(322, 500, 84, 620, -5, 0.14))


def art_scrunchie(c, variant=0):
    """Silk scrunchie, soft ring."""
    g, light, dark = grads('p', c)
    out = ''
    for i in range(22):
        a = i * (360 / 22)
        import math
        rad = math.radians(a)
        cx = 600 + 330 * math.cos(rad)
        cy = 800 + 330 * math.sin(rad) * 0.86
        out += f'<circle cx="{cx:.0f}" cy="{cy:.0f}" r="58" fill="url(#p)" stroke="#3b372f" stroke-width="4" opacity="0.97"/>'
    inner = f'<ellipse cx="600" cy="800" rx="150" ry="128" fill="{BACKDROP[1]}"/>'
    return (g, out + inner + f'<ellipse cx="600" cy="800" rx="150" ry="128" fill="none" stroke="#3b372f" stroke-width="4"/>')


def art_giftbox(c, variant=0):
    """Open gift box - rolled scarf inside, ribbon and card."""
    g, light, dark = grads('p', c)
    box = (
        f'<path d="M286 812 L914 812 L884 1244 L316 1244 Z" fill="url(#p)" stroke="#3b372f" '
        f'stroke-width="5" stroke-linejoin="round"/>'
        f'<path d="M286 812 L914 812 L906 884 L294 884 Z" fill="{mix(dark, "#000000", 0.16)}" '
        f'stroke="#3b372f" stroke-width="4"/>'
    )
    tissue = (
        f'<path d="M300 800 Q330 690 430 672 Q520 690 548 800 Z" fill="#fbf8f4" stroke="#3b372f" stroke-width="4" stroke-linejoin="round"/>'
        f'<path d="M700 800 Q726 676 830 664 Q906 690 900 800 Z" fill="#f4eee6" stroke="#3b372f" stroke-width="4" stroke-linejoin="round"/>'
    )
    roll = (
        f'<circle cx="452" cy="800" r="86" fill="{LEATHER["tan"][0]}" stroke="#3b372f" stroke-width="5"/>'
        f'<circle cx="452" cy="800" r="54" fill="none" stroke="{mix(LEATHER["tan"][1], "#000", 0.1)}" stroke-width="6"/>'
        f'<circle cx="452" cy="800" r="24" fill="none" stroke="{mix(LEATHER["tan"][1], "#000", 0.1)}" stroke-width="5"/>'
        f'<path d="M538 800 L562 800" stroke="{mix(LEATHER["tan"][1], "#000", 0.2)}" stroke-width="10" stroke-linecap="round"/>'
    )
    bracelet = (
        f'<circle cx="764" cy="792" r="72" fill="none" stroke="url(#gold)" stroke-width="34"/>'
        f'<path d="M712 748 A72 72 0 0 1 776 726" fill="none" stroke="{GOLD[2]}" stroke-width="9" opacity="0.6"/>'
    )
    ribbon = (
        f'<rect x="556" y="812" width="88" height="432" fill="url(#gold)" opacity="0.95"/>'
        f'<rect x="556" y="812" width="88" height="432" fill="none" stroke="{GOLD[1]}" stroke-width="3"/>'
    )
    card = (
        f'<rect x="596" y="1040" width="212" height="132" rx="12" fill="#fdfcfb" stroke="#3b372f" stroke-width="4"/>'
        f'<path d="M630 1082 L774 1082" stroke="{dark}" stroke-width="7" opacity="0.32" stroke-linecap="round"/>'
        f'<path d="M630 1120 L748 1120" stroke="{dark}" stroke-width="7" opacity="0.2" stroke-linecap="round"/>'
        f'<circle cx="762" cy="1132" r="16" fill="url(#gold)"/>'
    )
    bow = (
        f'<path d="M600 812 Q470 690 512 656 Q566 640 600 800 Z" fill="url(#gold)" stroke="{GOLD[1]}" stroke-width="4" stroke-linejoin="round"/>'
        f'<path d="M600 812 Q730 690 688 656 Q634 640 600 800 Z" fill="url(#gold)" stroke="{GOLD[1]}" stroke-width="4" stroke-linejoin="round"/>'
        f'<circle cx="600" cy="806" r="30" fill="url(#gold)" stroke="{GOLD[1]}" stroke-width="4"/>'
    )
    return (g, tissue + roll + bracelet + box + ribbon + card + bow)


# ------------------------------------------------------------ wide scenes ---
def place(kind, colour, x, y, sc, i):
    """Embed a product drawing at a position/scale, renaming its gradient id."""
    gdefs, shapes = ART[kind](colour, 0)
    gdefs = gdefs.replace('id="p"', f'id="pw{i}"')
    shapes = shapes.replace('url(#p)', f'url(#pw{i})')
    return gdefs, f'<g transform="translate({x},{y}) scale({sc})">{shapes}</g>'


def _shadow(cx, cy, rx):
    return (f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{int(rx*0.12)}" '
            f'fill="#2d2b28" opacity="0.13"/>')


# local drawing bounds per kind: (left, right, bottom)
BOUNDS = {
    # left, right, top, bottom - the real extent of each drawing
    'shoulder': (304, 894, 300, 1232), 'crossbody': (328, 872, 236, 1088),
    'tote': (336, 864, 290, 1248), 'clutch': (296, 904, 415, 1116),
    'wallet': (312, 890, 450, 1130), 'ring': (322, 878, 548, 1158),
    'watch': (516, 814, 250, 1284), 'earrings': (254, 946, 366, 792),
    'necklace': (330, 870, 255, 884), 'hoops': (167, 1033, 565, 1011),
    'bracelet': (326, 874, 632, 1038), 'bangles': (165, 989, 590, 1167),
    'sunglasses': (104, 1096, 600, 852), 'scarf': (276, 924, 465, 1262),
    'belt': (282, 918, 310, 1250), 'scrunchie': (230, 970, 452, 1142),
    'giftbox': (286, 914, 630, 1244),
}


def place_at(kind, colour, left, base, sc, rx, i):
    """Embed a product so its CONTENT sits at `left` and rests on the `base` line."""
    lo, hi, _top, bo = BOUNDS[kind]
    x = left - lo * sc
    y = base - bo * sc
    gdefs, shapes = ART[kind](colour, 0)
    gdefs = gdefs.replace('id="p"', f'id="pz{i}"')
    shapes = shapes.replace('url(#p)', f'url(#pz{i})')
    width = (hi - lo) * sc
    return gdefs, f'{_shadow(left + width / 2, base + 4, rx)}<g transform="translate({x:.0f},{y:.0f}) scale({sc})">{shapes}</g>'


def art_hero():
    """Wide editorial still-life for the hero. Every piece rests on one baseline."""
    Wd, Hd, BASE = 2400, 1350, 1200
    # The left of the frame is left open on purpose - the headline sits there.
    # kind, colour, content-left, scale, shadow radius
    layout = [
        ('crossbody',  'midnight',  420, 0.62, 185),
        ('sunglasses', 'black',     790, 0.54, 265),
        ('tote',       'cognac',   1290, 0.72, 195),
        ('watch',      'taupe',    1760, 0.58,  95),
        ('earrings',   'gold',     1950, 0.52, 130),
    ]
    defs, shapes = '', ''
    for i, (kind, col, left, sc, rx) in enumerate(layout, start=1):
        g, sh = place_at(kind, col, left, BASE, sc, rx, i)
        defs += g
        shapes += sh

    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {Wd} {Hd}" width="{Wd}" height="{Hd}" role="img">
  <defs>
    <linearGradient id="hbg" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0" stop-color="#f5f0e8"/>
      <stop offset="1" stop-color="#e3dbcf"/>
    </linearGradient>
    <radialGradient id="hglow" cx="0.68" cy="0.45" r="0.62">
      <stop offset="0" stop-color="#fffdfa" stop-opacity="0.9"/>
      <stop offset="1" stop-color="#fffdfa" stop-opacity="0"/>
    </radialGradient>
{GOLD_GRAD}
{defs}
  </defs>
  <rect width="{Wd}" height="{Hd}" fill="url(#hbg)"/>
  <rect width="{Wd}" height="{Hd}" fill="url(#hglow)"/>
  {shapes}
</svg>'''
    return svg


def art_banner():
    """Wide, quiet band of pieces for the promotional banner."""
    Wd, Hd, BASE = 2400, 820, 662
    layout = [
        ('ring',      'gold',       60, 0.36,  85),
        ('necklace',  'gold',      300, 0.40,  95),
        ('wallet',    'tan',       560, 0.44, 120),
        ('bangles',   'gold',      860, 0.38, 135),
        ('scarf',     'blush',    1210, 0.42, 140),
        ('crossbody', 'midnight', 1520, 0.42, 110),
        ('hoops',     'gold',     1780, 0.46, 150),
    ]
    defs, shapes = '', ''
    for i, (kind, col, left, sc, rx) in enumerate(layout, start=1):
        g, sh = place_at(kind, col, left, BASE, sc, rx, 20 + i)
        defs += g
        shapes += sh

    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {Wd} {Hd}" width="{Wd}" height="{Hd}" role="img">
  <defs>
    <linearGradient id="bbg" x1="0" y1="0" x2="0.3" y2="1">
      <stop offset="0" stop-color="#f0e9df"/>
      <stop offset="1" stop-color="#dcd2c5"/>
    </linearGradient>
{GOLD_GRAD}
{defs}
  </defs>
  <rect width="{Wd}" height="{Hd}" fill="url(#bbg)"/>
  {shapes}
</svg>'''
    return svg


ART = {
    'shoulder': art_shoulder_bag, 'tote': art_tote, 'crossbody': art_crossbody,
    'clutch': art_clutch, 'wallet': art_wallet, 'ring': art_ring, 'watch': art_watch,
    'earrings': art_earrings, 'necklace': art_necklace, 'hoops': art_hoops,
    'bracelet': art_bracelet, 'bangles': art_bangles, 'sunglasses': art_sunglasses,
    'scarf': art_scarf, 'belt': art_belt, 'scrunchie': art_scrunchie, 'giftbox': art_giftbox,
}

# slug, art type, colourway A, colourway B
PRODUCTS = [
    ('luna-mini-shoulder-bag', 'shoulder', 'black', 'blush'),
    ('velvet-crossbody-dark', 'crossbody', 'midnight', 'burgundy'),
    ('structured-tote-canvas', 'tote', 'cognac', 'stone'),
    ('evening-clutch-rose-gold', 'clutch', 'rosegold', 'black'),
    ('slim-card-holder-tan', 'wallet', 'tan', 'black'),
    ('vintage-signet-ring', 'ring', 'gold', 'silver'),
    ('minimal-dial-watch-taupe', 'watch', 'taupe', 'black'),
    ('gold-mesh-watch-small', 'watch', 'cognac', 'rosegold'),
    ('cat-eye-sunglasses-black', 'sunglasses', 'black', 'burgundy'),
    ('oversized-aviator-sunglasses', 'sunglasses', 'gold', 'cream'),
    ('silk-scrunchie-set', 'scrunchie', 'blush', 'forest'),
    ('silk-print-scarf-taupe', 'scarf', 'taupe', 'burgundy'),
    ('cashmere-scarf-cream', 'scarf', 'cream', 'stone'),
    ('slim-leather-belt-black', 'belt', 'black', 'cognac'),
    ('luxury-accessory-gift-set', 'giftbox', 'forest', 'burgundy'),
    ('silver-hoop-earrings', 'hoops', 'silver', 'gold'),
    ('pearl-choker-necklace', 'necklace', 'cream', 'blush'),
    ('gold-bangle-set', 'bangles', 'gold', 'rosegold'),
    ('gold-pearl-drop-earrings', 'earrings', 'gold', 'silver'),
    ('layered-chain-necklace', 'necklace', 'gold', 'black'),
    ('rose-gold-cuff-bracelet', 'bracelet', 'rosegold', 'cream'),
]


def write(name, svg):
    p = os.path.join(OUT, name)
    with open(p, 'w', encoding='utf-8') as f:
        f.write(svg)
    return p


def main():
    os.makedirs(OUT, exist_ok=True)
    n = 0
    for slug, kind, ca, cb in PRODUCTS:
        fn = ART[kind]
        for i, col in enumerate((ca, cb)):
            g, inner = fn(col, i)
            svg = frame(inner, g, kind)
            write(f'{slug}-{i+1}.svg', svg)
            n += 1
        print(f'  {slug:32s} {kind:10s} {ca} / {cb}')
    write('hero-editorial.svg', art_hero())
    write('banner-editorial.svg', art_banner())
    print(f'\n{n + 2} images written to {OUT}')


if __name__ == '__main__':
    main()
