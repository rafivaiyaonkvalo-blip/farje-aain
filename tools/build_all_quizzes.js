/**
 * Build All Quizzes: Compiles high-quality 4-option question banks
 * for Lessons 00 to 35, Chapter Bundles, and the Full Book Quiz.
 */

const fs = require('fs');
const path = require('path');

const ch1 = require('./questions_ch1');
const ch2 = require('./questions_ch2');
const ch3 = require('./questions_ch3');
const ch4 = require('./questions_ch4');
const ch5 = require('./questions_ch5');

const allLessonsMap = {
  ...ch1,
  ...ch2,
  ...ch3,
  ...ch4,
  ...ch5
};

const quizDir = path.join(__dirname, '..', 'quiz-data');
if (!fs.existsSync(quizDir)) {
  fs.mkdirSync(quizDir, { recursive: true });
}

const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
function toBn(n) {
  return String(n).split('').map(d => bnDigits[parseInt(d, 10)] || d).join('');
}

// Function to shuffle options so correct answer is randomly placed among 0, 1, 2, 3
function formatQuestion(qObj, idx) {
  const origOptions = [...qObj.options];
  const correctText = origOptions[qObj.ans];
  
  // Deterministic or pseudorandom shuffle based on question index
  // to ensure variety across options (A, B, C, D)
  const targetIndex = (idx * 3 + 1) % 4; // distribute across 0, 1, 2, 3
  
  const distractors = origOptions.filter((_, i) => i !== qObj.ans);
  const newOptions = [];
  let dIdx = 0;
  for (let i = 0; i < 4; i++) {
    if (i === targetIndex) {
      newOptions.push(correctText);
    } else {
      newOptions.push(distractors[dIdx++]);
    }
  }

  return {
    id: idx + 1,
    q: `${toBn(idx + 1)}. ${qObj.q.replace(/^\d+\.\s*/, '')}`,
    options: newOptions,
    ans: targetIndex,
    explanation: qObj.explanation.replace(/কিতাবুল ফারজে আইন/g, 'ফারজে আইন')
  };
}

console.log('Building individual lesson quiz JSON files...');

const summary = [];
const allCompiledQuestions = [];

for (let lessonId = 0; lessonId <= 35; lessonId++) {
  const numStr = String(lessonId).padStart(2, '0');
  const entry = allLessonsMap[lessonId];
  if (!entry) {
    console.error(`WARNING: Lesson ${numStr} not found in modules!`);
    continue;
  }

  const formattedQuestions = entry.questions.map((q, idx) => formatQuestion(q, idx));
  const outFile = path.join(quizDir, `quiz-lesson-${numStr}.json`);
  fs.writeFileSync(outFile, JSON.stringify(formattedQuestions, null, 2), 'utf8');

  allCompiledQuestions.push(...formattedQuestions);

  summary.push({
    id: lessonId,
    title: entry.title,
    questionCount: formattedQuestions.length,
    optionsCount: 4,
    url: `quiz-data/quiz-lesson-${numStr}.json`
  });

  console.log(`✓ Lesson ${numStr}: ${formattedQuestions.length} 4-option MCQs -> ${path.basename(outFile)}`);
}

// Build Chapter Bundles
console.log('\nBuilding Chapter Bundles...');
const chapterLessonMap = {
  1: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  2: [11, 12, 13, 14, 15, 16, 17, 18, 19],
  3: [20, 21, 22, 23, 24],
  4: [25, 26, 27, 28, 29],
  5: [30, 31, 32, 33, 34, 35]
};

Object.keys(chapterLessonMap).forEach(chId => {
  const lessonIds = chapterLessonMap[chId];
  let chapterQuestions = [];
  lessonIds.forEach(lid => {
    const numStr = String(lid).padStart(2, '0');
    const lessonFile = path.join(quizDir, `quiz-lesson-${numStr}.json`);
    if (fs.existsSync(lessonFile)) {
      const qs = JSON.parse(fs.readFileSync(lessonFile, 'utf8'));
      chapterQuestions = chapterQuestions.concat(qs);
    }
  });

  const chapOutFile = path.join(quizDir, `quiz-chapter-${chId}.json`);
  fs.writeFileSync(chapOutFile, JSON.stringify(chapterQuestions, null, 2), 'utf8');
  console.log(`✓ Chapter ${chId}: ${chapterQuestions.length} MCQs -> ${path.basename(chapOutFile)}`);
});

// Build Mega Quiz Bundle (Full Book Quiz: all 360 questions)
console.log('\nBuilding Full Book Quiz Bundle...');
const megaOutFile = path.join(quizDir, 'quiz-mega-challenge.json');
fs.writeFileSync(megaOutFile, JSON.stringify(allCompiledQuestions, null, 2), 'utf8');
console.log(`✓ Full Book Quiz: ${allCompiledQuestions.length} MCQs -> ${path.basename(megaOutFile)}`);

// Write quiz-summary.json
const summaryFile = path.join(quizDir, 'quiz-summary.json');
fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2), 'utf8');
console.log(`✓ Quiz Summary written -> ${path.basename(summaryFile)}`);

console.log('\nALL QUIZZES SUCCESSFULLY COMPILED!');
