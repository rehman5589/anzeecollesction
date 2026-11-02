const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const base = 'D:/client final project/final degin arena/public/images';
const files = fs.readdirSync(base).filter(f=>/^parfum-.*\.webp$/.test(f));
for (const f of files) {
  const src = path.join(base,f);
  const name = f.replace('.webp','');
  // compress original
  sharp(src).webp({quality:75}).toFile(src+'.tmp').then(()=>{ fs.renameSync(src+'.tmp',src); console.log('compressed',f); }).catch(e=>console.error(f,e));
  // responsive
  for (const w of [400,800]) {
    const out = path.join(base, name + '-' + w + '.webp');
    sharp(src).resize({width:w}).webp({quality:75}).toFile(out).then(i=>console.log('ok',name,w,i.size)).catch(e=>console.error(name,w,e));
  }
}
