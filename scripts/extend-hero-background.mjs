import sharp from "sharp";

// Outpaint only the empty backdrop; retain every original product pixel.
const width = 1672;
const height = 1882;
const overlap = 155;
const original = await sharp("references/hero-scene-supplied.png")
  .removeAlpha()
  .raw()
  .toBuffer();
const extension = await sharp("references/masters/hero-upper-outpaint.png")
  .resize(width, 941 + overlap)
  .removeAlpha()
  .raw()
  .toBuffer();
const canvas = Buffer.alloc(width * height * 3);
extension.copy(canvas);
for (let y = 0; y < 941; y++) {
  const t = Math.min(1, y / (overlap - 1));
  const weight = t * t * (3 - 2 * t);
  for (let x = 0; x < width * 3; x++) {
    const dest = (y + 941) * width * 3 + x;
    const src = y * width * 3 + x;
    canvas[dest] =
      y < overlap
        ? Math.round(canvas[dest] * (1 - weight) + original[src] * weight)
        : original[src];
  }
}
const image = sharp(canvas, { raw: { width, height, channels: 3 } });
await image.clone().png().toFile("references/masters/hero-scene-extended.png");
for (const size of [1672, 1100]) {
  const name = `public/assets/hero-scene-extended${size === 1672 ? "" : "-1100"}`;
  await image
    .clone()
    .resize({ width: size })
    .webp({ quality: 94 })
    .toFile(`${name}.webp`);
  await image
    .clone()
    .resize({ width: size })
    .avif({ quality: 84 })
    .toFile(`${name}.avif`);
}
await sharp("references/masters/continuous-velvet.png")
  .webp({ quality: 92 })
  .toFile("public/assets/continuous-velvet.webp");
await sharp("references/masters/continuous-velvet.png")
  .avif({ quality: 80 })
  .toFile("public/assets/continuous-velvet.avif");
