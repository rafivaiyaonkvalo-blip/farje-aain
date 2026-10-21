const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'slides', 'lesson-01.html');
const html = fs.readFileSync(filePath, 'utf8');
const slides = html.split(/<div class=["']slide/i).slice(1);

console.log('Total slides:', slides.length);
slides.forEach((s, idx) => {
  const titleMatch = s.match(/class=["']slide-title["'][^>]*>([^<]+)/i);
  const title = titleMatch ? titleMatch[1].trim() : ('Slide ' + (idx + 1));
  console.log((idx + 1) + ': ' + title);
});
