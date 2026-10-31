// Redimensionne et compresse les images de public/img (npm run optimize:images)
// Les noms de fichiers sont conservés : aucune référence à modifier dans le code.
import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import sharp from 'sharp';

const DIR = 'public/img';
const MAX_WIDTH = 1920;

let before = 0;
let after = 0;

for (const name of await readdir(DIR)) {
  const ext = extname(name).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue;

  const file = join(DIR, name);
  const input = await readFile(file);
  const pipeline = sharp(input)
    .rotate() // applique l'orientation EXIF avant de la supprimer
    .resize({ width: MAX_WIDTH, withoutEnlargement: true });

  const output =
    ext === '.png'
      ? await pipeline.png({ compressionLevel: 9, palette: true, quality: 85 }).toBuffer()
      : await pipeline.jpeg({ quality: 80, mozjpeg: true }).toBuffer();

  before += input.length;
  if (output.length < input.length) {
    await writeFile(file, output);
    after += output.length;
  } else {
    after += input.length;
  }
}

const mo = (n) => (n / 1024 / 1024).toFixed(1) + ' Mo';
console.log(`Images : ${mo(before)} -> ${mo(after)}`);
