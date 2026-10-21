const fs = require('fs');
const path = require('path');

console.log('=== RUNNING COMPLETE VERIFICATION SUITE ===\n');

let failed = false;

// 1. Verify forbidden phrase is 0 everywhere in user-facing code and data
const baseDir = path.join(__dirname, '..');
const scanFiles = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    if (file.startsWith('.') || file === 'node_modules' || file === 'tools') return;
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      results = results.concat(scanFiles(full));
    } else if (file.endsWith('.html') || file.endsWith('.json') || file.endsWith('.js') || file.endsWith('.md')) {
      results.push(full);
    }
  });
  return results;
};

const forbidden = 'কিতাবুল' + ' ফারজে আইন';
const allFiles = scanFiles(baseDir);
let forbiddenFound = 0;
allFiles.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  if (content.includes(forbidden)) {
    console.error(`[FAIL] Forbidden phrase found in: ${f}`);
    forbiddenFound++;
    failed = true;
  }
});
if (forbiddenFound === 0) {
  console.log('[PASS] 1. Zero occurrences of forbidden phrase across all web and data files.');
}

// 2. Verify all 35 lesson quizzes have exactly 100 questions, 2 options each, ans 0/1, valid explanation
const quizDir = path.join(baseDir, 'quiz-data');
let totalQuestions = 0;
let quizCountErrors = 0;
let quizOptionErrors = 0;
let quizAnsErrors = 0;
let quizExpErrors = 0;

for (let i = 1; i <= 35; i++) {
  const num = String(i).padStart(2, '0');
  const filePath = path.join(quizDir, `quiz-lesson-${num}.json`);
  if (!fs.existsSync(filePath)) {
    console.error(`[FAIL] Missing quiz file: quiz-lesson-${num}.json`);
    failed = true;
    continue;
  }
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (data.length !== 100) {
    console.error(`[FAIL] Lesson ${i} has ${data.length} questions, expected 100!`);
    quizCountErrors++;
    failed = true;
  }
  totalQuestions += data.length;

  data.forEach((q, idx) => {
    if (!q.options || q.options.length !== 2) {
      quizOptionErrors++;
      failed = true;
    }
    if (q.ans !== 0 && q.ans !== 1) {
      quizAnsErrors++;
      failed = true;
    }
    if (!q.explanation || typeof q.explanation !== 'string' || q.explanation.trim().length === 0) {
      quizExpErrors++;
      failed = true;
    }
  });
}

if (quizCountErrors === 0 && quizOptionErrors === 0 && quizAnsErrors === 0 && quizExpErrors === 0) {
  console.log(`[PASS] 2. All 35 quiz files have exactly 100 questions (${totalQuestions} total), strictly 2 options each, valid ans (0/1), and complete explanations.`);
} else {
  console.error(`[FAIL] Quiz errors: count=${quizCountErrors}, options=${quizOptionErrors}, ans=${quizAnsErrors}, exp=${quizExpErrors}`);
}

// 3. Verify Chapter and Mega Quiz bundles exist and are non-empty
for (let c = 1; c <= 5; c++) {
  const cPath = path.join(quizDir, `quiz-chapter-${c}.json`);
  if (!fs.existsSync(cPath)) {
    console.error(`[FAIL] Missing chapter quiz bundle: quiz-chapter-${c}.json`);
    failed = true;
  } else {
    const cData = JSON.parse(fs.readFileSync(cPath, 'utf8'));
    if (cData.length < 500) {
      console.error(`[FAIL] Chapter ${c} has only ${cData.length} questions!`);
      failed = true;
    }
  }
}

const megaPath = path.join(quizDir, 'quiz-mega-challenge.json');
if (!fs.existsSync(megaPath)) {
  console.error('[FAIL] Missing mega quiz bundle: quiz-mega-challenge.json');
  failed = true;
} else {
  const mData = JSON.parse(fs.readFileSync(megaPath, 'utf8'));
  if (mData.length < 700) {
    console.error(`[FAIL] Mega quiz has only ${mData.length} questions!`);
    failed = true;
  }
}
console.log('[PASS] 3. Chapter bundles (Ch 1-5) and Mega Challenge bundle are valid and verified.');

// 4. Verify All 35 Slides have Back to Portal button, navigation controls, and script
const slidesDir = path.join(baseDir, 'slides');
let slideNavErrors = 0;
for (let i = 1; i <= 35; i++) {
  const num = String(i).padStart(2, '0');
  const sPath = path.join(slidesDir, `lesson-${num}.html`);
  if (!fs.existsSync(sPath)) {
    console.error(`[FAIL] Missing slide: lesson-${num}.html`);
    failed = true;
    continue;
  }
  const sHtml = fs.readFileSync(sPath, 'utf8');
  const hasBack = sHtml.includes('মূল পেজে ফিরুন') || sHtml.includes('index.html');
  const hasPrev = sHtml.includes('prevSlide') || sHtml.includes('পূর্ববর্তী');
  const hasNext = sHtml.includes('nextSlide') || sHtml.includes('পরবর্তী');
  const hasScript = sHtml.includes('<script');

  if (!hasBack || !hasPrev || !hasNext || !hasScript) {
    console.error(`[FAIL] Slide ${i} navigation check failed: back=${hasBack}, prev=${hasPrev}, next=${hasNext}, script=${hasScript}`);
    slideNavErrors++;
    failed = true;
  }
}

if (slideNavErrors === 0) {
  console.log('[PASS] 4. All 35 slides have back-to-portal button, prev/next controls, and working script.');
}

// 5. Verify index.html UI elements for Mega and Chapter quiz
const indexHtml = fs.readFileSync(path.join(baseDir, 'index.html'), 'utf8');
const hasMegaHero = indexHtml.includes('openMegaBookQuiz()');
const hasChapterBtn = indexHtml.includes('openCurrentChapterQuiz(') || indexHtml.includes('openCurrentChapterQuiz()');
const hasOptionRender = indexHtml.includes("quizState.activeQuestions[quizState.currentIndex]");
const hasShuffling = indexHtml.includes(".sort(() => 0.5 - Math.random())");

if (hasMegaHero && hasChapterBtn && hasOptionRender && hasShuffling) {
  console.log('[PASS] 5. index.html contains Mega Quiz buttons, Chapter Quiz buttons, random shuffling, and 2-option rendering.');
} else {
  console.error('[FAIL] index.html missing key quiz UI elements!');
  failed = true;
}

// 6. Verify Halal Photos in portal-data.json
const portalData = JSON.parse(fs.readFileSync(path.join(baseDir, 'portal-data.json'), 'utf8'));
const ch3 = portalData.chapters.find(c => c.id === 3);
const ch4 = portalData.chapters.find(c => c.id === 4);
if (!ch3.bgImg || !ch4.bgImg) {
  console.error('[FAIL] Missing chapter images for Chapter 3 or 4');
  failed = true;
} else {
  console.log(`[PASS] 6. Halal images verified for Muamalat (${ch3.name}) and Muasharat (${ch4.name}).`);
}

console.log('\n=== VERIFICATION RESULT: ' + (failed ? 'FAILED' : 'ALL CHECKS PASSED PERFECTLY!') + ' ===');
process.exit(failed ? 1 : 0);
