import sharp from "sharp";
import pngToIco from "png-to-ico";
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const svgPath = join(root, "public", "favicon.svg");
const svg = readFileSync(svgPath);

async function png(size, outName) {
  const dest = join(root, "public", outName);
  await sharp(svg).resize(size, size).png().toFile(dest);
  console.log(`✓ ${outName} (${size}x${size})`);
  return dest;
}

// Generate all PNGs
const p16  = await png(16,  "favicon-16.png");
const p32  = await png(32,  "favicon-32.png");
const p48  = await png(48,  "favicon-48.png");
await png(180, "apple-touch-icon.png");
await png(192, "icon-192.png");
await png(512, "icon-512.png");

// Generate favicon.ico (multi-size: 16, 32, 48)
const icoBuffer = await pngToIco([p16, p32, p48]);
writeFileSync(join(root, "public", "favicon.ico"), icoBuffer);
console.log("✓ favicon.ico (16x16, 32x32, 48x48)");

// Clean up temp PNGs used only for ico
import { unlinkSync } from "fs";
unlinkSync(p16);
unlinkSync(p32);
unlinkSync(p48);
console.log("✓ Done");
