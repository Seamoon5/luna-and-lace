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

## Product images

Product photography comes from **Pixabay** and **Pexels**, downloaded into
`public/img/photos/` and cropped to a consistent 1000 x 1250 (4:5) frame so every
card lines up. Both licences allow free commercial use with no attribution needed,
so these are safe for a real shop. Every file and its source photo id is listed in
[`public/img/photos/CREDITS.md`](public/img/photos/CREDITS.md).

The wide hero and banner images are cropped to 2000 x 1125 and 2000 x 700.

One product, the **Silk Scrunchie Set**, has no usable stock photo anywhere
(free libraries return spiders and hair close-ups), so it keeps a drawn
illustration. Everything else is a real photograph.

### How the photos were chosen

```bash
node scripts/fetch-photos.mjs      # download candidates into .photo-stage
node scripts/contact.mjs all       # build a contact sheet to review them
python3 scripts/build-photos.py    # crop + optimise the chosen ones
```

Free stock searches return a lot of irrelevant frames - branded boxes, clip art,
animals, watermarked images. So candidates are downloaded first, laid out on a
contact sheet, and picked **by eye** before anything reaches the site.

### Replacing the images with your own photography

The catalogue only stores paths, so swapping in real photography is a data change,
not a code change. Drop your files into `public/img/photos/` and point
`images` in `src/data/products.ts` at them:

```ts
images: ["/img/photos/my-bag-1.jpg", "/img/photos/my-bag-2.jpg"],
```

Recommended sizes: **1000 x 1250 px (4:5)** for product images, **2000 x 1125 px**
for the hero.

---

## Project layout

```
public/img/photos/    real product photography + CREDITS.md
public/img/          drawn fallback illustrations (SVG)
scripts/
  fetch-photos.mjs  downloads candidate photos from free stock libraries
  contact.mjs       contact sheet of candidates, for reviewing them by eye
  build-photos.py   crops and optimises the chosen photos into public/img/photos
  generate-art.py   draws the fallback illustrations
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
| 1.1.0 | Replaced drawn artwork with real Pixabay/Pexels photography for 20 of 21 products, plus wide hero and banner photos. Reviewed every candidate by eye. |
| 1.0.0 | Full 19-page storefront, local mock data, generated SVG artwork, lint and type-check clean. |
