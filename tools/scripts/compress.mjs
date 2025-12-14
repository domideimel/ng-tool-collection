import { createReadStream, createWriteStream, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { pipeline } from 'node:stream';
import { promisify } from 'node:util';
import { createBrotliCompress, createGzip } from 'node:zlib';

const pipe = promisify(pipeline);
const distDir = 'dist/ng-tool-collection';

if (!existsSync(distDir)) {
  console.error(`Directory ${distDir} does not exist. Run build first.`);
  process.exit(1);
}

async function compressFile(filePath) {
  // Skip already compressed files
  if (filePath.endsWith('.gz') || filePath.endsWith('.br')) return;

  try {
    // Gzip
    const sourceGz = createReadStream(filePath);
    const gzip = createGzip({ level: 9 });
    const gzipDest = createWriteStream(`${filePath}.gz`);
    await pipe(sourceGz, gzip, gzipDest);

    // Brotli
    const sourceBr = createReadStream(filePath);
    const brotli = createBrotliCompress();
    const brotliDest = createWriteStream(`${filePath}.br`);
    await pipe(sourceBr, brotli, brotliDest);
  } catch (err) {
    console.error(`Error compressing ${filePath}:`, err);
  }
}

async function processDirectory(dir) {
  const files = readdirSync(dir);
  for (const file of files) {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    if (stat.isDirectory()) {
      await processDirectory(filePath);
    } else if (stat.isFile() && /\.(js|css|html|svg|json|txt|xml|webmanifest)$/.test(file)) {
      console.log(`Compressing ${filePath}...`);
      await compressFile(filePath);
    }
  }
}

(async () => {
  try {
    console.log(`Starting compression in ${distDir}...`);
    await processDirectory(distDir);
    console.log('Compression complete.');
  } catch (err) {
    console.error('Compression failed:', err);
    process.exit(1);
  }
})();
