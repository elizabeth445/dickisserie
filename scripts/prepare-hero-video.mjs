import { execFile as execFileCallback } from "node:child_process";
import { promisify } from "node:util";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = fileURLToPath(new URL("../", import.meta.url));
const ffmpeg = process.env.FFMPEG_BIN || "ffmpeg";
const execFile = promisify(execFileCallback);
const run = (args) =>
  execFile(ffmpeg, ["-hide_banner", "-loglevel", "error", "-y", ...args], {
    cwd: root,
  });
const source = [
  "-i",
  "references/hero-motion-upscaled-3x.mp4",
  "-t",
  "7.9",
  "-map",
  "0:v:0",
  "-an",
];
const web = ["-movflags", "+faststart", "-map_metadata", "-1"];

// Preserve the supplied 4K bitstream; derive smaller versions from this master.
await run([
  ...source,
  "-c:v",
  "copy",
  ...web,
  "public/assets/hero-motion-4k.mp4",
]);
await run([
  ...source,
  "-vf",
  "scale=1920:1080:flags=lanczos",
  "-c:v",
  "libx264",
  "-preset",
  "slow",
  "-crf",
  "16",
  "-pix_fmt",
  "yuv420p",
  ...web,
  "public/assets/hero-motion-1080.mp4",
]);
await run([
  ...source,
  "-vf",
  "scale=1280:720:flags=lanczos",
  "-c:v",
  "libx264",
  "-preset",
  "slow",
  "-crf",
  "17",
  "-pix_fmt",
  "yuv420p",
  ...web,
  "public/assets/hero-motion-720.mp4",
]);
const temporary = await mkdtemp(join(tmpdir(), "dickisserie-poster-"));
try {
  const frame = join(temporary, "first.png");
  await run([
    "-i",
    "references/hero-motion-upscaled-3x.mp4",
    "-frames:v",
    "1",
    frame,
  ]);
  await sharp(frame)
    .resize({ width: 1920, withoutEnlargement: true })
    .webp({ quality: 95 })
    .toFile(join(root, "public/assets/hero-motion-first.webp"));
} finally {
  await rm(temporary, { recursive: true, force: true });
}
