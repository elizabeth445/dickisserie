import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { readFile, writeFile, mkdir } from "node:fs/promises";
const root = new URL("../", import.meta.url);
const path = (p) => fileURLToPath(new URL(p, root));
await mkdir(path("references/masters"), { recursive: true });
// The user's replacement is the single authoritative hero source. No enlargement.
const hero = await readFile(path("references/waffle-trio-supplied.png"));
await sharp(hero).png().toFile(path("references/masters/waffle-trio.png"));
await sharp(hero)
  .resize({ width: 1000, withoutEnlargement: true })
  .webp({ quality: 94, alphaQuality: 100 })
  .toFile(path("public/assets/waffle-trio.webp"));
await sharp(hero)
  .resize({ width: 480, withoutEnlargement: true })
  .webp({ quality: 91 })
  .toFile(path("public/assets/waffle-trio-480.webp"));
await sharp(hero)
  .resize({ width: 1000, withoutEnlargement: true })
  .avif({ quality: 82, effort: 7 })
  .toFile(path("public/assets/waffle-trio.avif"));
await sharp(hero)
  .resize(120)
  .webp({ quality: 86 })
  .toFile(path("public/assets/waffle-trio-thumb.webp"));
// Photo-only crops from supplied materials: no photographed menu labels in web assets.
const crops = {
  "pussy-box": {
    input: "pussy-box.png",
    left: 70,
    top: 45,
    width: 866,
    height: 695,
  },
  "mixed-box": {
    input: "mixed-box.png",
    left: 253,
    top: 35,
    width: 708,
    height: 675,
  },
  "single-pack": {
    input: "single-pack.png",
    left: 145,
    top: 169,
    width: 902,
    height: 751,
  },
};
for (const [name, crop] of Object.entries(crops)) {
  const { input, ...extract } = crop;
  const master = await sharp(path("references/" + input))
    .extract(extract)
    .png()
    .toBuffer();
  await writeFile(path(`references/masters/${name}.png`), master);
  await sharp(master)
    .resize({ width: 880, withoutEnlargement: true })
    .webp({ quality: 92 })
    .toFile(path(`public/assets/${name}.webp`));
  await sharp(master)
    .resize({ width: 420, withoutEnlargement: true })
    .webp({ quality: 87 })
    .toFile(path(`public/assets/${name}-420.webp`));
  await sharp(master)
    .resize({ width: 120, withoutEnlargement: true })
    .webp({ quality: 83 })
    .toFile(path(`public/assets/${name}-thumb.webp`));
}
// Minis come from the original mixed product photo, not the old website screenshot.
const minis = await sharp(path("references/mixed-box.png"))
  .extract({ left: 548, top: 144, width: 164, height: 475 })
  .png()
  .toBuffer();
await writeFile(path("references/masters/mini-waffles.png"), minis);
await sharp(minis)
  .webp({ quality: 93 })
  .toFile(path("public/assets/mini-waffles.webp"));
await sharp(minis)
  .resize({ height: 110, withoutEnlargement: true })
  .webp({ quality: 86 })
  .toFile(path("public/assets/mini-waffles-thumb.webp"));

console.log(
  "Original-scale masters and web assets saved. No upscaling applied.",
);

await sharp(hero)
  .resize(480)
  .avif({ quality: 78, effort: 6 })
  .toFile(path("public/assets/waffle-trio-480.avif"));
await sharp(path("references/masters/mini-waffles.png"))
  .extract({ left: 8, top: 0, width: 125, height: 190 })
  .resize({ width: 100, height: 110, fit: "cover", position: "top" })
  .webp({ quality: 90 })
  .toFile(path("public/assets/mini-waffles-thumb.webp"));
