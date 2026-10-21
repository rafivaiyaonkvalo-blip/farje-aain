const fs = require('fs');
const path = require('path');

console.log('=== COMPREHENSIVE VERIFICATION AUDIT ===\n');

// 1. Chapters in portal-data.json
const portalData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'portal-data.json'), 'utf-8'));
console.log('1. Chapters count:', portalData.chapters.length);
portalData.chapters.forEach(c => {
  console.log(`   - Chapter [${c.id}] ${c.name} | Badge: ${c.badge}`);
});
const l0 = portalData.lessons.find(l => l.id === 0);
console.log(`   Lesson 00: "${l0.title}" -> Chapter ID ${l0.chapterId} (${l0.chapterKey})\n`);

// 2. index.html checks
const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf-8');
const hasKitabul = indexHtml.includes('কিতাবুল ফারজে আইন');
const hasSarbik = indexHtml.includes('সার্বিক পরীক্ষা');
const hasHeroQuizCta = indexHtml.includes('hero-quiz-cta');
const hasMobileHideHeaderQuiz = indexHtml.includes('.nav-mega-quiz-btn') && indexHtml.includes('display: none !important');

console.log('2. index.html verification:');
console.log('   - Has "কিতাবুল ফারজে আইন":', hasKitabul, '(MUST BE FALSE)');
console.log('   - Has "সার্বিক পরীক্ষা":', hasSarbik, '(MUST BE FALSE)');
console.log('   - Has "hero-quiz-cta":', hasHeroQuizCta, '(MUST BE FALSE)');
console.log('   - Mobile header hides quiz button:', hasMobileHideHeaderQuiz, '(MUST BE TRUE)\n');

// 3. Slides mobile readiness
const slidesDir = path.join(__dirname, '..', 'slides');
const slideFiles = fs.readdirSync(slidesDir).filter(f => f.endsWith('.html'));
let missingVp = 0;
let missingResponsive = 0;

slideFiles.forEach(f => {
  const c = fs.readFileSync(path.join(slidesDir, f), 'utf-8');
  if (!c.toLowerCase().includes('name="viewport"')) missingVp++;
  if (!c.includes('UNIVERSAL MOBILE & TABLET RESPONSIVE ENGINE')) missingResponsive++;
});

console.log('3. Slides mobile readiness:');
console.log(`   - Total slide files: ${slideFiles.length}`);
console.log(`   - Missing viewport: ${missingVp} (MUST BE 0)`);
console.log(`   - Missing responsive engine: ${missingResponsive} (MUST BE 0)\n`);

console.log('ALL CHECKS COMPLETED!');
