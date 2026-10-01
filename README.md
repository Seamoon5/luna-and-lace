# Luna &amp; Lace

A complete, responsive women's accessories e-commerce storefront built with React,
TypeScript and Vite. It runs entirely on local mock data, so it works offline and is
ready to be connected to a real backend, database and payment gateway later.

---

## Quick start

```bash
npm install
npm run dev      # starts the site (Vite dev server)
```

Open the URL Vite prints, usually <http://localhost:5173>.

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Type-check and build for production into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run Oxlint |

---

## What is in the store

**19 routes** — Home, Shop, 15 category pages, Product detail, Search, Cart,
Checkout, Order confirmation, Wishlist, Account, About, Contact, FAQ, Shipping,
Returns, Privacy, Terms and a 404 page.

**21 demo products** across 12 categories: handbags, shoulder bags, crossbody bags,
wallets, jewelry, earrings, necklaces, bracelets, rings, watches, sunglasses, hair
accessories, scarves, belts and gift sets. Each product has variants, stock, reviews,
ratings and discount data.

### How shopping works

Home → category → product → pick colour / quantity → cart → checkout → confirmation.
Cart and wishlist are saved in the browser (`localStorage`), so a refresh does not
lose them.

---

## Product artwork

Every product image is a **generated SVG** in `public/img/` — 44 files totalling
about **215 KB**. There are no external image links, so nothing can break, nothing is
downloaded from a third party at runtime, and the images stay crisp on any screen.

The artwork is produced by a script, so it can be regenerated or restyled:

```bash
python3 scripts/generate-art.py
```

It draws each product from a small library of vector shapes, applies one of two
colourways per product (that pair is what the card hover-swap uses), and centres
every piece into the same visual box on a shared warm backdrop.

### Replacing the artwork with real photos

The catalogue only stores paths, so swapping in real photography is a data change,
not a code change. Set `images` in `src/data/products.ts` to your own URLs or to files
you drop into `public/`:

```ts
images: ["/img/my-photo-1.jpg", "/img/my-photo-2.jpg"],
```

Recommended sizes: **1200 x 1500 px (4:5)** for product images, **2400 x 1350 px** for
the wide hero.

---

## Project layout

```
public/img/          generated product artwork (SVG)
scripts/
  generate-art.py    draws all product artwork
  audit.mjs          crawls every route, reports broken images / console errors
  shots.mjs          screenshots pages at desktop and mobile widths
  sheet.mjs          contact sheet of all artwork, for reviewing it by eye
src/
  components/        header, footer, product card, grid, toast, layout
  pages/             one file per route
  data/products.ts   the whole catalogue - the file you edit to change products
  config/store.ts    brand name, currency, contact details, shipping rules
  hooks/             cart and wishlist state
```

---

## Where to change things

| To change | Edit |
|---|---|
| Brand name, currency, phone, address, social links | `src/config/store.ts` |
| Products, prices, categories, images | `src/data/products.ts` |
| Colours, fonts, shadows | the `@theme` block at the top of `src/index.css` |
| Announcement bar text | `announcementText` in `src/config/store.ts` |

---

## Status and honest limitations

- This is a **front-end storefront**. Cart, wishlist and orders are simulated in the
  browser. There is no server, database, login or payment processing yet.
- Prices are in PKR with `Rs.` formatting, set in `src/config/store.ts`.
- The product artwork is original vector illustration, not photography — chosen
  because it is licence-clean, tiny and never breaks.
- Checkout is Cash on Delivery only. Adding a gateway means replacing the submit
  handler in `src/pages/Checkout.tsx`.
- Copy and product names are original demo content, not copied from any real brand.

## Version history

| Version | What changed |
|---|---|
| 1.0.0 | Full 19-page storefront, local mock data, generated SVG product artwork, lint and type-check clean. |
