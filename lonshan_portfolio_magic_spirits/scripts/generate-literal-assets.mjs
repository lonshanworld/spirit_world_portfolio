import { promises as fs } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const SOURCE_DIR = path.join(ROOT, 'public', 'design', 'source');
const SOURCE_CANDIDATES = [
  process.env.DESIGN_SOURCE,
  path.join(ROOT, '..', 'spirits_and_magic_seals.svg'),
  path.join(SOURCE_DIR, 'source-board.png'),
  path.join(SOURCE_DIR, 'source-board.jpg'),
  path.join(SOURCE_DIR, 'source-board.jpeg'),
  path.join(SOURCE_DIR, 'source-board.webp'),
  path.join(SOURCE_DIR, 'source-board.svg'),
  path.join(SOURCE_DIR, 'spirits_and_spell_designs.png'),
  path.join(SOURCE_DIR, 'spirits_and_spell_designs.jpg'),
  path.join(SOURCE_DIR, 'spirits_and_spell_designs.jpeg'),
  path.join(SOURCE_DIR, 'spirits_and_spell_designs.webp'),
  path.join(SOURCE_DIR, 'spirits_and_spell_designs.svg'),
  path.join(SOURCE_DIR, 'spirits_and_magic_seals.svg'),
].filter(Boolean);
const OUT_SPIRITS = path.join(ROOT, 'public', 'design', 'spirits');
const OUT_SEALS = path.join(ROOT, 'public', 'design', 'seals');

const ELEMENTS = [
  'fire', 'water', 'ice', 'wind',
  'soil', 'trees', 'lightning', 'light',
  'void', 'dark', 'healing', 'space',
  'time', 'robot',
];

const SPIRIT_CENTERS = [
  { x: 74, y: 174 }, { x: 210, y: 174 }, { x: 343, y: 174 }, { x: 476, y: 174 },
  { x: 74, y: 330 }, { x: 210, y: 330 }, { x: 343, y: 330 }, { x: 476, y: 330 },
  { x: 74, y: 486 }, { x: 210, y: 486 }, { x: 343, y: 486 }, { x: 476, y: 486 },
  { x: 74, y: 643 }, { x: 210, y: 643 },
];

const SEAL_CENTERS = [
  { x: 657, y: 174 }, { x: 790, y: 174 }, { x: 923, y: 174 }, { x: 1055, y: 174 },
  { x: 657, y: 330 }, { x: 790, y: 330 }, { x: 923, y: 330 }, { x: 1055, y: 330 },
  { x: 657, y: 486 }, { x: 790, y: 486 }, { x: 923, y: 486 }, { x: 1055, y: 486 },
  { x: 657, y: 643 }, { x: 790, y: 643 },
];

const SPIRIT_SIZE = 128;
const SEAL_SIZE = 132;
const BASE_BOARD_SIZE = { width: 1138, height: 758 };

function boxFromCenter(center, size) {
  const half = Math.floor(size / 2);
  return {
    left: Math.max(0, center.x - half),
    top: Math.max(0, center.y - half),
    width: size,
    height: size,
  };
}

function scaleCenter(center, scaleX, scaleY) {
  return {
    x: Math.round(center.x * scaleX),
    y: Math.round(center.y * scaleY),
  };
}

function scaleSize(size, scaleX, scaleY) {
  const scale = (scaleX + scaleY) / 2;
  return Math.max(16, Math.round(size * scale));
}

function toSvgWrapperPng(pngPublicPath) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">\n  <image href="${pngPublicPath}" x="0" y="0" width="128" height="128" preserveAspectRatio="xMidYMid meet"/>\n</svg>\n`;
}

async function loadSharpSource(sourceImage) {
  const image = sharp(sourceImage);
  const meta = await image.metadata();
  return { image, meta, sourceUsed: sourceImage };
}

async function ensureDirs() {
  await fs.mkdir(OUT_SPIRITS, { recursive: true });
  await fs.mkdir(OUT_SEALS, { recursive: true });
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function resolveSourceImage() {
  const skipped = [];

  for (const candidate of SOURCE_CANDIDATES) {
    if (!(await exists(candidate))) {
      continue;
    }

    try {
      const image = sharp(candidate);
      await image.metadata();
      return { sourceImage: candidate, skipped };
    } catch (error) {
      skipped.push(`${candidate} (${error.message})`);
    }
  }

  const entries = await fs.readdir(SOURCE_DIR, { withFileTypes: true }).catch(() => []);
  const fallback = entries.find((entry) => {
    if (!entry.isFile()) {
      return false;
    }

    return /\.(png|jpg|jpeg|webp|svg)$/i.test(entry.name);
  });

  if (fallback) {
    const fallbackPath = path.join(SOURCE_DIR, fallback.name);

    try {
      const image = sharp(fallbackPath);
      await image.metadata();
      return { sourceImage: fallbackPath, skipped };
    } catch (error) {
      skipped.push(`${fallbackPath} (${error.message})`);
    }
  }

  return { sourceImage: null, skipped };
}

async function cropSet(image, centers, outDir, size, kind) {
  for (let i = 0; i < ELEMENTS.length; i += 1) {
    const element = ELEMENTS[i];
    const center = centers[i];
    const box = boxFromCenter(center, size);

    const pngName = `${element}.png`;
    const svgName = `${element}.svg`;
    const pngPath = path.join(outDir, pngName);
    const svgPath = path.join(outDir, svgName);

    await image
      .clone()
      .extract(box)
      .resize(128, 128, { fit: 'contain' })
      .png()
      .toFile(pngPath);

    const publicPath = `/design/${kind}/${pngName}`;
    await fs.writeFile(svgPath, toSvgWrapperPng(publicPath), 'utf8');
  }
}

async function main() {
  const resolved = await resolveSourceImage();
  const sourceImage = resolved.sourceImage;
  if (!sourceImage) {
    console.error(`Missing source image in: ${SOURCE_DIR}`);
    console.error('Accepted names: source-board.*, spirits_and_spell_designs.*, or spirits_and_magic_seals.svg');
    console.error('Auto-fallback: any .png/.jpg/.jpeg/.webp/.svg in source folder');
    console.error('Also checked root attachment name: ../spirits_and_magic_seals.svg');
    if (resolved.skipped.length > 0) {
      console.error('Skipped invalid candidates:');
      for (const entry of resolved.skipped) {
        console.error(`- ${entry}`);
      }
    }
    console.error('Optional override: DESIGN_SOURCE=<absolute-path-to-image> npm run design:extract');
    console.error('Place your source-of-truth board image there, then run npm run design:extract');
    process.exitCode = 1;
    return;
  }

  await ensureDirs();

  const loaded = await loadSharpSource(sourceImage);
  const image = loaded.image;
  const meta = loaded.meta;
  const width = meta.width ?? BASE_BOARD_SIZE.width;
  const height = meta.height ?? BASE_BOARD_SIZE.height;
  const scaleX = width / BASE_BOARD_SIZE.width;
  const scaleY = height / BASE_BOARD_SIZE.height;

  const scaledSpiritCenters = SPIRIT_CENTERS.map((center) => scaleCenter(center, scaleX, scaleY));
  const scaledSealCenters = SEAL_CENTERS.map((center) => scaleCenter(center, scaleX, scaleY));
  const spiritSize = scaleSize(SPIRIT_SIZE, scaleX, scaleY);
  const sealSize = scaleSize(SEAL_SIZE, scaleX, scaleY);

  await cropSet(image, scaledSpiritCenters, OUT_SPIRITS, spiritSize, 'spirits');
  await cropSet(image, scaledSealCenters, OUT_SEALS, sealSize, 'seals');

  console.log('Literal assets extracted successfully:');
  console.log(`- source: ${loaded.sourceUsed}`);
  if (resolved.skipped.length > 0) {
    console.log('- skipped invalid candidates:');
    for (const entry of resolved.skipped) {
      console.log(`  - ${entry}`);
    }
  }
  console.log('- public/design/spirits/*.png + *.svg');
  console.log('- public/design/seals/*.png + *.svg');
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
