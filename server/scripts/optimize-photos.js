/**
 * One-off utility: optimizes all property photos in client/public/photos
 *
 * Problem: photos often uploaded at full camera/stock resolution
 * but are never displayed larger than ~1200px -> users download far more
 * image data than ever actually renders on screen
 * -> Only downscale if image larger than 1200px on
 * -> Re-encode as WebP at quality 80 (= 80% of original = good balance for photo content
 * -> Overwrite file in place and print before/after report
 *
 * Usage: cd server -> npm i sharp -> node scripts/optimize-photos.js
 */
import { readdir, stat, readFile, writeFile } from "fs/promises";
import path from "path";
import sharp from "sharp";

const PHOTOS_DIR = path.resolve(
  import.meta.dirname,
  "../../client/public/photos",
);
const MAX_EDGE = 1200;
const WEBP_QUALITY = 80;

const formatKB = (bytes) => `${(bytes / 1024).toFixed(0)} KB`;

async function optimizePhoto(filePath) {
  const before = (await stat(filePath)).size;
  const input = await readFile(filePath);

  const image = sharp(input);
  const metadata = await image.metadata();
  const needsResize =
    Math.max(metadata.width ?? 0, metadata.height ?? 0) > MAX_EDGE;

  const buffer = await image
    .resize({
      width: MAX_EDGE,
      height: MAX_EDGE,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();

  await writeFile(filePath, buffer);

  const after = buffer.length;
  const label = needsResize ? "resized + recompressed" : "recompressed";
  console.log(
    `${path.basename(filePath).padEnd(22)} ${formatKB(before).padStart(9)} -> ${formatKB(after).padStart(9)}  (${label})`,
  );

  return { before, after };
}

async function main() {
  const files = (await readdir(PHOTOS_DIR)).filter((f) =>
    f.toLowerCase().endsWith(".webp"),
  );

  if (files.length === 0) {
    console.log(`No .webp files found in ${PHOTOS_DIR}`);
    return;
  }

  console.log(`Optimizing ${files.length} photos in ${PHOTOS_DIR}\n`);

  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of files) {
    const { before, after } = await optimizePhoto(path.join(PHOTOS_DIR, file));
    totalBefore += before;
    totalAfter += after;
  }

  const savedPct = 100 * (1 - totalAfter / totalBefore);
  console.log(
    `\nTotal: ${(totalBefore / 1024 / 1024).toFixed(2)} MB -> ${(
      totalAfter /
      1024 /
      1024
    ).toFixed(2)} MB  (${savedPct.toFixed(0)}% smaller)`,
  );
}

main().catch((err) => {
  console.error("Failed to optimize photos:", err);
  process.exit(1);
});
