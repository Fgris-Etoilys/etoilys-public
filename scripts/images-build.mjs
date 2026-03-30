import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT_DIR = process.cwd();
const SOURCE_DIR = path.join(ROOT_DIR, 'src', 'assets', 'seo-images', 'source');
const OUTPUT_DIR = path.join(ROOT_DIR, 'public', 'images', 'optimized');
const MANIFEST_PATH = path.join(ROOT_DIR, 'src', 'content', 'imageManifest.ts');
const TARGET_WIDTHS = [480, 768, 1200, 1600, 1920];
const DEFAULT_WIDTH = 1200;

const IMAGE_ASSETS = [
  { key: 'homeHero', fileName: 'home-hero.jpg' },
  { key: 'homeProcedure', fileName: 'home-procedure.jpg' },
  { key: 'pourquoiReferencement', fileName: 'pourquoi-referencement.jpg' },
  { key: 'articleMeubles20252026', fileName: 'article-meubles-2025-2026.jpg' },
  { key: 'articleMicroBic2026', fileName: 'article-micro-bic-2026.jpg' },
  { key: 'articleResidence90Jours', fileName: 'article-residence-90-jours.jpg' },
  { key: 'articleCoproprieteReglement', fileName: 'article-copropriete-reglement.jpg' },
];

function formatSrcSet(baseName, widths, format) {
  return widths.map((width) => `/images/optimized/${baseName}-${width}.${format} ${width}w`).join(', ');
}

async function ensureDirs() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
}

async function buildAsset(asset) {
  const sourcePath = path.join(SOURCE_DIR, asset.fileName);
  const baseName = asset.fileName.replace(/\.[a-zA-Z0-9]+$/, '');
  const sourceBuffer = await fs.readFile(sourcePath);
  const metadata = await sharp(sourceBuffer).metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error(`Unable to read dimensions for ${asset.fileName}`);
  }

  const validWidths = TARGET_WIDTHS.filter((width) => width <= metadata.width);
  const widths = validWidths.length > 0 ? validWidths : [metadata.width];
  const defaultWidth = widths.includes(DEFAULT_WIDTH) ? DEFAULT_WIDTH : widths[widths.length - 1];

  for (const width of widths) {
    const resized = sharp(sourceBuffer).resize({ width, withoutEnlargement: true });

    await resized
      .clone()
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(path.join(OUTPUT_DIR, `${baseName}-${width}.jpg`));

    await resized
      .clone()
      .webp({ quality: 82 })
      .toFile(path.join(OUTPUT_DIR, `${baseName}-${width}.webp`));

    await resized
      .clone()
      .avif({ quality: 65 })
      .toFile(path.join(OUTPUT_DIR, `${baseName}-${width}.avif`));
  }

  return {
    key: asset.key,
    width: metadata.width,
    height: metadata.height,
    src: `/images/optimized/${baseName}-${defaultWidth}.jpg`,
    srcSetWebp: formatSrcSet(baseName, widths, 'webp'),
    srcSetAvif: formatSrcSet(baseName, widths, 'avif'),
  };
}

function buildManifest(entries) {
  const keyUnion = entries.map((entry) => `'${entry.key}'`).join(' | ');
  const recordEntries = entries
    .map(
      (entry) => `  ${entry.key}: {
    width: ${entry.width},
    height: ${entry.height},
    src: '${entry.src}',
    srcSetWebp: '${entry.srcSetWebp}',
    srcSetAvif: '${entry.srcSetAvif}',
  },`
    )
    .join('\n');

  return `export type ImageAssetKey = ${keyUnion};

export interface ImageManifestEntry {
  width: number;
  height: number;
  src: string;
  srcSetWebp: string;
  srcSetAvif: string;
}

export const IMAGE_MANIFEST: Record<ImageAssetKey, ImageManifestEntry> = {
${recordEntries}
};
`;
}

async function main() {
  await ensureDirs();
  const entries = [];

  for (const asset of IMAGE_ASSETS) {
    const entry = await buildAsset(asset);
    entries.push(entry);
  }

  const manifest = buildManifest(entries);
  await fs.writeFile(MANIFEST_PATH, manifest, 'utf8');

  console.log(`Built ${entries.length} SEO image assets.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
