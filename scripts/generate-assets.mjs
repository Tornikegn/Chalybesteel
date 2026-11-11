/**
 * Generates PNG favicons, touch icons and the 1200×630 OpenGraph image
 * from the supplied brand SVGs. Run with `npm run assets` after changing
 * the logo files in public/brand/. Outputs are committed to public/.
 */
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const pub = (p) => path.join(root, "public", p);

const INK = "#121417";
const PAPER = "#F3F2EF";

const favicon = await readFile(pub("favicon.svg"));
const markDark = await readFile(pub("brand/chalybe-pipe-mark-dark.svg"));
const logoDark = await readFile(pub("brand/chalybe-pipe-logo-dark.svg"));

// Browser favicon: the light mark on transparent background
await sharp(favicon, { density: 384 }).resize(32, 32).png().toFile(pub("favicon-32.png"));

// Touch / app icons: mark centred on paper with padding (iOS ignores transparency)
async function paddedIcon(svg, size, bg, file, pad = 0.18) {
  const inner = Math.round(size * (1 - pad * 2));
  const mark = await sharp(svg, { density: 1024 }).resize(inner, inner).png().toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: bg } })
    .composite([{ input: mark, gravity: "centre" }])
    .png()
    .toFile(pub(file));
}
await paddedIcon(favicon, 180, PAPER, "apple-touch-icon.png");
await paddedIcon(favicon, 192, PAPER, "icon-192.png");
await paddedIcon(favicon, 512, PAPER, "icon-512.png");
await paddedIcon(markDark, 512, INK, "icon-maskable-512.png", 0.26);

// OpenGraph image: dark logo on near-black with thin technical rings
const W = 1200;
const H = 630;
const logoW = 640;
const logoH = Math.round((logoW * 100) / 374.4);
const logo = await sharp(logoDark, { density: 600 }).resize(logoW, logoH).png().toBuffer();
const deco = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <pattern id="g" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0V48" fill="none" stroke="#9AA3AD" stroke-opacity="0.07"/>
    </pattern>
  </defs>
  <rect width="${W}" height="${H}" fill="${INK}"/>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <g fill="none" transform="translate(1080 120)">
    <circle r="260" stroke="#6B7480" stroke-opacity="0.45"/>
    <circle r="200" stroke="#6B7480" stroke-opacity="0.45"/>
    <circle r="80" stroke="#D9622B" stroke-opacity="0.7" stroke-width="2"/>
  </g>
  <path d="M0 ${H - 6}H${W}" stroke="#D9622B" stroke-width="12"/>
</svg>`);
await sharp(deco)
  .composite([
    { input: logo, left: Math.round((W - logoW) / 2) - 60, top: Math.round((H - logoH) / 2) },
  ])
  .png()
  .toFile(pub("og-image.png"));

await writeFile(
  pub("site.webmanifest"),
  JSON.stringify(
    {
      name: "Chalybe Steel",
      short_name: "Chalybe Steel",
      description: "API 5CT seamless casing and tubing (OCTG).",
      start_url: "/",
      display: "browser",
      background_color: PAPER,
      theme_color: INK,
      icons: [
        { src: "/favicon.svg", type: "image/svg+xml", sizes: "any" },
        { src: "/icon-192.png", type: "image/png", sizes: "192x192" },
        { src: "/icon-512.png", type: "image/png", sizes: "512x512" },
        { src: "/icon-maskable-512.png", type: "image/png", sizes: "512x512", purpose: "maskable" },
      ],
    },
    null,
    2,
  ) + "\n",
);

console.log("Generated favicons, touch icons, OG image and web manifest.");
