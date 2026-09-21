import fs from 'fs';
import path from 'path';
import https from 'https';

const assets = [
  // Font
  {
    url: 'https://cdn.prod.website-files.com/68b5ac4fa3e43fe1c5563719/68d28f73672cec42265963e8_FormulaCondensed-Black.woff',
    file: 'FormulaCondensed-Black.woff'
  },
  // Video Header
  {
    url: 'https://the-grind.b-cdn.net/720_header.mp4',
    file: '720_header.mp4'
  },
  // Photos
  {
    url: 'https://cdn.prod.website-files.com/68b5ac4fa3e43fe1c5563719/68b875abc510ddae74654690_861dc30fbe853debadf2d9661c293b2f_4J9A2840.webp',
    file: 'photo_1.webp'
  },
  {
    url: 'https://cdn.prod.website-files.com/68b5ac4fa3e43fe1c5563719/68b875ab101e6b01f0710290_e1e62e9f0af6866673e42ef150d1b26e_IMG_1213.webp',
    file: 'photo_2.webp'
  },
  {
    url: 'https://cdn.prod.website-files.com/68b5ac4fa3e43fe1c5563719/68b875abb7f58ed24561cbce_c057646a15724b34e17fd1ca3e0888ea_4J9A1524.webp',
    file: 'video_poster.webp'
  },
  {
    url: 'https://cdn.prod.website-files.com/68b5ac4fa3e43fe1c5563719/68b5f24028a0f9cf0efa567f_Exclusion%205.svg',
    file: 'grind_logo.svg'
  },
  {
    url: 'https://cdn.prod.website-files.com/68b5ac4fa3e43fe1c5563719/68bb5115edfe445b904f6dda_04f1b8bc7dceac5cf0fd2d799c4b745f_cartboard_overlay.webp',
    file: 'cartboard_overlay.webp'
  },
  // Member Avatars
  {
    url: 'https://cdn.prod.website-files.com/68b5ac4fa3e43fe1c5563719/68c07205e7a1db67e19e31bb_203893586f8e982a8dc33ca93e6fcd8b_pexels-cristian-rojas-10042883-p-500.webp',
    file: 'avatar_1.webp'
  },
  {
    url: 'https://cdn.prod.website-files.com/68b5ac4fa3e43fe1c5563719/68c07205e81f2c4fd4fcb4fe_42a65dc7ff769d8575b24156a5984c73_pexels-cristian-rojas-8809594-p-500.webp',
    file: 'avatar_2.webp'
  },
  {
    url: 'https://cdn.prod.website-files.com/68b5ac4fa3e43fe1c5563719/68c072052f5636d5e19592fb_4b8f2653f5d41b1a19b4199184ff520a_pexels-artempodrez-6253345-p-500.webp',
    file: 'avatar_3.webp'
  },
  {
    url: 'https://cdn.prod.website-files.com/68b5ac4fa3e43fe1c5563719/68c0720563496071a5412121_623746bf060582c3023152723c6f1af7_pexels-mastercowley-1153370-p-500.webp',
    file: 'avatar_4.webp'
  },
  {
    url: 'https://cdn.prod.website-files.com/68b5ac4fa3e43fe1c5563719/68cdcaaf866f068b4588218e_Video.avif',
    file: 'video_opener.avif'
  }
];

const destDir = path.resolve('public/thegrind');
fs.mkdirSync(destDir, { recursive: true });

function download(item) {
  return new Promise((resolve, reject) => {
    const destPath = path.join(destDir, item.file);
    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 100) {
      console.log(`[Skip] Sudah ada: ${item.file}`);
      return resolve();
    }
    const file = fs.createWriteStream(destPath);
    console.log(`[Download] ${item.file} dari ${item.url} ...`);
    https.get(item.url, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        https.get(res.headers.location, res2 => {
          res2.pipe(file);
          file.on('finish', () => file.close(resolve));
        }).on('error', reject);
      } else {
        res.pipe(file);
        file.on('finish', () => file.close(resolve));
      }
    }).on('error', err => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

async function run() {
  for (const item of assets) {
    try {
      await download(item);
    } catch (e) {
      console.error(`Gagal download ${item.file}:`, e.message);
    }
  }
  console.log('[Selesai] Semua aset The Grind berhasil diunduh ke public/thegrind/');
}

run();
