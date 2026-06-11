import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT_DIR = process.cwd();
const SOURCE_DIR = path.join(ROOT_DIR, 'src', 'assets', 'seo-images', 'source');
const OUTPUT_DIR = path.join(ROOT_DIR, 'public', 'images', 'optimized');
const MANIFEST_PATH = path.join(ROOT_DIR, 'src', 'content', 'imageManifest.ts');
const TARGET_WIDTHS = [480, 768, 1200, 1600, 1920];
const DEFAULT_WIDTH = 1200;
const OG_ASPECT_RATIO = 1200 / 630;
const FORCE_REBUILD = process.argv.includes('--force');
const HERO_ASSET_KEYS = new Set(['homeHero', 'dordogneHero', 'girondeHero', 'lotEtGaronneHero']);

const IMAGE_ASSETS = [
  { key: 'homeHero', fileName: 'AdobeStock_70255363.jpeg', outputName: 'home-hero' },
  { key: 'homeProcedure', fileName: 'home-procedure.jpg' },
  { key: 'pourquoiReferencement', fileName: 'pourquoi-referencement.jpg' },
  { key: 'recrutementInspection', fileName: 'AdobeStock_31855482.jpeg' },
  {
    key: 'simulateurClassement',
    fileName: 'gunnar-ridderstrom-4I26owL4-yk-unsplash.jpg',
    outputName: 'simulateur-classement-og',
    ogComposition: {
      title: 'Simulateur de classement',
      subtitle: 'Meublé de tourisme',
    },
  },
  {
    key: 'simulateurTaxeSejour',
    fileName: 'pexels-arnaud-32767039.jpg',
    outputName: 'simulateur-taxe-sejour-og',
    ogComposition: {
      title: 'Simulateur taxe de séjour',
      subtitle: 'Classé vs non classé',
    },
  },
  {
    key: 'simulateurFiscalClassement',
    fileName: 'kelly-sikkema-0oZpRxG5Hkk-unsplash.jpg',
    outputName: 'simulateur-fiscal-classement-og',
    ogComposition: {
      title: 'Simulateur fiscal 2026',
      subtitle: 'Classé vs non classé',
    },
  },
  { key: 'articleMeubles20252026', fileName: 'article-meubles-2025-2026.jpg' },
  { key: 'articleMicroBic2026', fileName: 'article-micro-bic-2026.jpg' },
  { key: 'articleResidence90Jours', fileName: 'article-residence-90-jours.jpg' },
  { key: 'articleCoproprieteReglement', fileName: 'article-copropriete-reglement.jpg' },
  { key: 'articleTaxeDeSejour2026', fileName: 'article-taxe-sejour-2026.jpg' },
  { key: 'articleMeubleClasseNonClasse', fileName: 'pexels-rachel-claire-5490384.jpg' },
  { key: 'articleFacturationElectronique2026', fileName: 'sumup-ru18KXzFA4E-unsplash.jpg' },
  { key: 'articleDpeMeublesTourisme', fileName: 'pexels-rachel-claire-4846106.jpg' },
  { key: 'articleApiMeubles', fileName: 'pexels-orneiseppi-32486469.jpg' },
  { key: 'dordogneHero', fileName: 'pexels-slimmars-13-197677686-14298615.jpg' },
  { key: 'dordogneInterior', fileName: 'jametlene-reskp-0MF_yWx470o-unsplash.jpg' },
  { key: 'dordogneLandscape', fileName: 'le-sixieme-reve-2gjxjF6BjWs-unsplash.jpg' },
  { key: 'girondeHero', fileName: 'axel-delansorne-fSpupJ0C95E-unsplash.jpg' },
  { key: 'girondeTerritory', fileName: 'arpad-czapp-J181eozqAd8-unsplash.jpg' },
  { key: 'girondeCoast', fileName: 'benjamin-esteves-A_JaVydOsRk-unsplash.jpg' },
  { key: 'lotEtGaronneHero', fileName: 'AdobeStock_1364523535.jpeg' },
  { key: 'lotEtGaronneTerritory', fileName: 'pexels-d-goth-37724280.jpg' },
  { key: 'lotEtGaronneCanal', fileName: 'AdobeStock_919223785.jpeg' },
];

function formatSrcSet(baseName, widths, format) {
  return widths
    .map((width) => `/images/optimized/${baseName}-${width}.${format} ${width}w`)
    .join(', ');
}

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildOgCompositionOverlay(width, height, composition) {
  const scale = width / DEFAULT_WIDTH;
  const safeMargin = Math.round(80 * scale);
  const titleY = Math.round(355 * scale);
  const subtitleY = Math.round(438 * scale);
  const titleSize = Math.round(64 * scale);
  const subtitleSize = Math.round(40 * scale);
  const logoSize = Math.round(28 * scale);
  const logoY = Math.round(95 * scale);
  const accentSize = Math.round(16 * scale);

  return Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="nightOverlay" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#07152f" stop-opacity="0.66"/>
      <stop offset="52%" stop-color="#07152f" stop-opacity="0.58"/>
      <stop offset="100%" stop-color="#07152f" stop-opacity="0.50"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#nightOverlay)"/>
  <g opacity="0.9">
    <rect x="${safeMargin}" y="${logoY - accentSize}" width="${accentSize}" height="${accentSize}" rx="${Math.round(4 * scale)}" fill="#316bff"/>
    <text x="${safeMargin + Math.round(28 * scale)}" y="${logoY}" font-family="Inter, Arial, sans-serif" font-size="${logoSize}" font-weight="700" fill="#ffffff">Etoilys</text>
  </g>
  <text x="${safeMargin}" y="${titleY}" font-family="Inter, Arial, sans-serif" font-size="${titleSize}" font-weight="760" fill="#ffffff">${escapeXml(composition.title)}</text>
  <text x="${safeMargin}" y="${subtitleY}" font-family="Inter, Arial, sans-serif" font-size="${subtitleSize}" font-weight="500" fill="#ffffff">${escapeXml(composition.subtitle)}</text>
</svg>`);
}

function getJpegQuality(asset, width) {
  if (!HERO_ASSET_KEYS.has(asset.key)) {
    return 82;
  }
  return width <= 768 ? 78 : 80;
}

function getWebpQuality(asset, width) {
  if (!HERO_ASSET_KEYS.has(asset.key)) {
    return 82;
  }
  return width <= 768 ? 74 : 78;
}

function getAvifQuality(asset, width) {
  if (!HERO_ASSET_KEYS.has(asset.key)) {
    return 65;
  }
  if (width <= 768) {
    return 48;
  }
  return width <= 1200 ? 52 : 56;
}

async function ensureDirs() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
}

function getOutputPaths(baseName, widths) {
  return widths.flatMap((width) =>
    ['jpg', 'webp', 'avif'].map((format) => path.join(OUTPUT_DIR, `${baseName}-${width}.${format}`))
  );
}

async function shouldBuildAsset(outputPaths, sourceMtimeMs) {
  if (FORCE_REBUILD) {
    return true;
  }

  for (const outputPath of outputPaths) {
    try {
      const outputStats = await fs.stat(outputPath);
      if (outputStats.mtimeMs < sourceMtimeMs) {
        return true;
      }
    } catch (error) {
      if (error?.code === 'ENOENT') {
        return true;
      }
      throw error;
    }
  }

  return false;
}

async function createAssetPlan(asset) {
  const sourcePath = path.join(SOURCE_DIR, asset.fileName);
  const baseName = asset.outputName ?? asset.fileName.replace(/\.[a-zA-Z0-9]+$/, '');
  const sourceStats = await fs.stat(sourcePath);
  const metadata = await sharp(sourcePath).metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error(`Unable to read dimensions for ${asset.fileName}`);
  }

  const validWidths = TARGET_WIDTHS.filter((width) => width <= metadata.width);
  const widths = validWidths.length > 0 ? validWidths : [metadata.width];
  const defaultWidth = widths.includes(DEFAULT_WIDTH) ? DEFAULT_WIDTH : widths[widths.length - 1];
  const outputHeight = asset.ogComposition
    ? Math.round(defaultWidth / OG_ASPECT_RATIO)
    : metadata.height;
  const outputPaths = getOutputPaths(baseName, widths);
  const shouldBuild = await shouldBuildAsset(outputPaths, sourceStats.mtimeMs);

  return {
    asset,
    baseName,
    defaultWidth,
    metadata,
    outputHeight,
    shouldBuild,
    sourcePath,
    widths,
  };
}

async function buildAsset(plan) {
  const { asset, baseName, metadata, sourcePath, widths } = plan;
  const sourceBuffer = await fs.readFile(sourcePath);

  for (const width of widths) {
    const resizedHeight = asset.ogComposition
      ? Math.round(width / OG_ASPECT_RATIO)
      : Math.round((metadata.height * width) / metadata.width);

    const buildPipeline = () => {
      const resizeOptions = asset.ogComposition
        ? {
            width,
            height: resizedHeight,
            fit: 'cover',
            position: 'center',
            withoutEnlargement: true,
          }
        : { width, withoutEnlargement: true };
      const pipeline = sharp(sourceBuffer).resize(resizeOptions);
      if (!asset.ogComposition) {
        return pipeline;
      }

      return pipeline.composite([
        {
          input: buildOgCompositionOverlay(width, resizedHeight, asset.ogComposition),
          top: 0,
          left: 0,
        },
      ]);
    };

    await buildPipeline()
      .jpeg({ quality: getJpegQuality(asset, width), mozjpeg: true })
      .toFile(path.join(OUTPUT_DIR, `${baseName}-${width}.jpg`));

    await buildPipeline()
      .webp({ quality: getWebpQuality(asset, width) })
      .toFile(path.join(OUTPUT_DIR, `${baseName}-${width}.webp`));

    await buildPipeline()
      .avif({ quality: getAvifQuality(asset, width) })
      .toFile(path.join(OUTPUT_DIR, `${baseName}-${width}.avif`));
  }
}

function buildManifestEntry(plan) {
  const { asset, baseName, defaultWidth, metadata, outputHeight, widths } = plan;

  return {
    key: asset.key,
    width: asset.ogComposition ? defaultWidth : metadata.width,
    height: outputHeight,
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
  let builtCount = 0;
  let skippedCount = 0;

  for (const asset of IMAGE_ASSETS) {
    const plan = await createAssetPlan(asset);
    if (plan.shouldBuild) {
      await buildAsset(plan);
      builtCount += 1;
    } else {
      skippedCount += 1;
    }
    entries.push(buildManifestEntry(plan));
  }

  const manifest = buildManifest(entries);
  await fs.writeFile(MANIFEST_PATH, manifest, 'utf8');

  console.log(
    `Built ${builtCount} SEO image assets. Skipped ${skippedCount} unchanged assets.`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
