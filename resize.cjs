const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const base = 'D:/client final project/final degin arena/public/images';
const names = ['hero-atelier','maison-atelier','hero-perfume','ingredients-roses','boutique'];
for (const n of names) {
  const src = path.join(base, n + '.webp');
  for (const w of [720,1920]) {
    const out = path.join(base, n + '-' + w + '.webp');
    sharp(src).resize({width:w}).webp({quality:80}).toFile(out).then(i=>console.log('ok',n,w,i.size)).catch(e=>console.error(n,w,e));
  }
}
