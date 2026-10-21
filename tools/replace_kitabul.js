const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..');

function walk(dir) {
  let files = [];
  const list = fs.readdirSync(dir);
  for (const item of list) {
    if (item === 'node_modules' || item === '.git') continue;
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      files = files.concat(walk(full));
    } else if (/\.(html|json|js|md)$/i.test(item)) {
      files.push(full);
    }
  }
  return files;
}

const allFiles = walk(baseDir);
let changedCount = 0;

for (const file of allFiles) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('ফারজে আইন')) {
    content = content.replace(/ফারজে আইন/g, 'ফারজে আইন');
    fs.writeFileSync(file, content, 'utf8');
    changedCount++;
    console.log('Replaced in:', path.relative(baseDir, file));
  }
}

console.log(`Replaced 'ফারজে আইন' in ${changedCount} files.`);
