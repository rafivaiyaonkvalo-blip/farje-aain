const fs = require('fs');

const lessonsToFix = ['lesson-29.html', 'lesson-30.html', 'lesson-31.html', 'lesson-32.html', 'lesson-33.html', 'lesson-34.html', 'lesson-35.html'];

for (const fileName of lessonsToFix) {
  const filePath = `r:/presentation/farje-aain-web/slides/${fileName}`;
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf8');

  // Replace selector
  const oldSelector = /let slides = Array\.from\(document\.querySelectorAll\('\.slide'\)\);\s*if \(slides\.length === 0\) \{\s*slides = Array\.from\(document\.querySelectorAll\('\[class\*="slide"\]'\)\)\.filter\(el => \{\s*return !el\.classList\.contains\('slide-nav-controls'\) && !el\.classList\.contains\('slide-nav-btn'\);\s*\}\);\s*\}/;

  const newSelector = `let slides = Array.from(document.querySelectorAll('.slide-section'));\n      if (slides.length === 0) {\n        slides = Array.from(document.querySelectorAll('.slide'));\n      }`;

  if (oldSelector.test(content)) {
    content = content.replace(oldSelector, newSelector);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Successfully fixed selector in: ${fileName}`);
  } else {
    console.log(`Pattern not matched in: ${fileName}`);
  }
}
