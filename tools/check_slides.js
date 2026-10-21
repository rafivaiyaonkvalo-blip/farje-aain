const fs = require('fs');

console.log('--- Checking all lessons 00 to 35 ---');
for (let i = 0; i <= 35; i++) {
  const num = String(i).padStart(2, '0');
  const file = `r:/presentation/farje-aain-web/slides/lesson-${num}.html`;
  if (!fs.existsSync(file)) {
    console.log(`lesson-${num}: MISSING`);
    continue;
  }
  const content = fs.readFileSync(file, 'utf8');
  let count = 0;
  if (content.includes('class="slide-section"')) {
    count = content.split('class="slide-section"').length - 1;
  } else if (content.includes('class="slide "') || content.includes('class="slide"')) {
    count = content.split(/class=["']slide[\s"']/).length - 1;
  } else if (content.includes('class="slide-frame"')) {
    count = content.split('class="slide-frame"').length - 1;
  } else if (content.includes('<section')) {
    count = content.split('<section').length - 1;
  }
  console.log(`lesson-${num}: ${count} slides, size: ${(content.length/1024).toFixed(1)} KB`);
}
