const fs = require('fs');
const path = require('path');

const slidesDir = path.join(__dirname, '..', 'slides');

for (let i = 0; i <= 35; i++) {
  const num = String(i).padStart(2, '0');
  const file = path.join(slidesDir, `lesson-${num}.html`);
  if (!fs.existsSync(file)) {
    console.log(`Lesson ${num}: NOT FOUND`);
    continue;
  }
  const content = fs.readFileSync(file, 'utf8');
  
  // Extract slide titles
  const titles = [];
  const slideRegex = /<div class="slide[\s\S]*?<\/div>\s*(?=<!-- SLIDE|<div class="slide|<div class="controls|<\/body)/g;
  
  // Quick regex to find titles
  const titleMatches = content.match(/<(?:h[1-4]|div)[^>]*class="[^"]*(?:slide-title|title)[^"]*"[^>]*>([\s\S]*?)<\/(?:h[1-4]|div)>/g) || [];
  const extracted = titleMatches.map(m => m.replace(/<[^>]+>/g, '').trim()).filter(Boolean);
  
  console.log(`Lesson ${num} (length ${content.length}): ${extracted.length} titles found`);
  if (extracted.length > 0) {
    console.log('   Sample:', extracted.slice(0, 5).join(' | '));
  } else {
    // Check what headings or classes exist
    const anyH = content.match(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/g) || [];
    console.log('   Heading sample:', anyH.slice(0, 3).map(h => h.replace(/<[^>]+>/g, '').trim()).join(' | '));
  }
}
