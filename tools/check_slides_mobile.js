const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'slides');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const noVp = [];
const fixedW = [];

files.forEach(f => {
  const c = fs.readFileSync(path.join(dir, f), 'utf-8');
  if (!c.toLowerCase().includes('name="viewport"') && !c.toLowerCase().includes("name='viewport'")) {
    noVp.push(f);
  }
  const match = c.match(/(width|max-width|min-width):\s*(\d{3,4}px)/g);
  if (match) {
    fixedW.push({ file: f, matches: [...new Set(match)] });
  }
});

console.log('Files WITHOUT viewport meta tag (' + noVp.length + '):');
console.log(noVp.join(', '));
console.log('\nFiles with fixed pixel widths:');
fixedW.forEach(item => console.log(item.file, ':', item.matches.join(', ')));
