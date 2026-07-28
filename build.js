const fs = require('fs');
const path = require('path');

const sections = [
  'navbar', 'hero', 'about', 'numbers', 'errors',
  'practice-areas', 'team', 'testimonials', 'cta', 'footer'
];

let template = fs.readFileSync('src/template.html', 'utf-8');

sections.forEach(name => {
  const filePath = path.join('src', 'sections', name + '.html');
  const content = fs.readFileSync(filePath, 'utf-8');
  template = template.replace('{{section:' + name + '}}', content);
});

const css = fs.readFileSync('src/css/style.css', 'utf-8');
const js = fs.readFileSync('src/js/main.js', 'utf-8');
template = template.replace('{{css}}', css);
template = template.replace('{{js}}', js);

// Image resolver
const images = {
  'hero':          { folder: 'hero', file: 'hero',          fallback: 'https://picsum.photos/seed/fmr-hero/1920/1080' },
  'about':         { folder: 'about', file: 'about',        fallback: 'https://picsum.photos/seed/fmr-escritorio/700/850' },
  'team-fernanda': { folder: 'team', file: 'fernanda',     fallback: 'https://picsum.photos/seed/fmr-fernanda/600/700' },
  'team-flavia':   { folder: 'team', file: 'flavia',       fallback: 'https://picsum.photos/seed/fmr-flavia/600/700' },
};

Object.entries(images).forEach(([key, img]) => {
  const imgDir = path.join('images', img.folder);
  let src = img.fallback;

  if (fs.existsSync(imgDir)) {
    const files = fs.readdirSync(imgDir);
    const exts = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    const match = files.find(f => {
      const ext = path.extname(f).toLowerCase();
      const name = path.basename(f, ext).toLowerCase();
      return name === img.file.toLowerCase() && exts.includes(ext);
    });
    if (match) {
      src = path.join('images', img.folder, match).replace(/\\/g, '/');
      console.log('  [img] ' + key + ' -> ' + src);
    } else {
      console.log('  [img] ' + key + ' (local nao encontrado) -> fallback picsum');
    }
  } else {
    console.log('  [img] ' + key + ' (pasta nao existe) -> fallback picsum');
  }

  template = template.replace(new RegExp('\\{\\{img:' + key + '\\}\\}', 'g'), src);
});

// Logo resolver
const logoFallback = '<div class="w-10 h-10 bg-[#152A3B] rounded-full flex items-center justify-center text-white text-xl font-bold" style="font-family:\'Playfair Display\',serif;">F</div><span class="text-2xl font-bold text-[#152A3B]" style="font-family:\'Playfair Display\',serif;">FMR Advocacia</span>';
let logoSrc = logoFallback;
const logoDir = 'images/logo';
if (fs.existsSync(logoDir)) {
  const files = fs.readdirSync(logoDir);
  const logoExts = ['.svg', '.png', '.jpg', '.jpeg', '.webp'];
  const match = files.find(f => {
    const ext = path.extname(f).toLowerCase();
    return logoExts.includes(ext);
  });
  if (match) {
    logoSrc = '<img src="' + path.join('images/logo', match).replace(/\\/g, '/') + '" alt="FMR Advocacia" class="h-10">';
    console.log('  [logo] -> ' + match);
  } else {
    console.log('  [logo] (nao encontrado) -> fallback texto');
  }
} else {
  console.log('  [logo] (pasta nao existe) -> fallback texto');
}
template = template.replace(new RegExp('\\{\\{logo\\}\\}', 'g'), logoSrc);

fs.writeFileSync('index.html', template);
console.log('Build concluido -> index.html');
