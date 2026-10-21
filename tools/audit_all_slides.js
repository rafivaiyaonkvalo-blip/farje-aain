const fs = require('fs');
const path = require('path');

const slidesDir = path.join(__dirname, '..', 'slides');
const report = [];

for (let i = 1; i <= 35; i++) {
  const num = String(i).padStart(2, '0');
  const file = path.join(slidesDir, `lesson-${num}.html`);
  if (!fs.existsSync(file)) {
    report.push({ id: i, error: 'File not found' });
    continue;
  }
  const html = fs.readFileSync(file, 'utf8');
  const hasBackToPortal = html.includes('মূল পেজে ফিরুন') || html.includes('index.html');
  const hasControls = html.includes('controls') || html.includes('control-bar');
  const hasPrev = html.includes('prevSlide') || html.includes('পূর্ববর্তী');
  const hasNext = html.includes('nextSlide') || html.includes('পরবর্তী');
  const hasScript = html.includes('<script');
  const slideCount = (html.match(/class=["'][^"']*slide[^"']*["']/gi) || []).length;
  
  report.push({
    id: i,
    hasBackToPortal,
    hasControls,
    hasPrev,
    hasNext,
    hasScript,
    slideCount
  });
}

console.log(JSON.stringify(report, null, 2));
