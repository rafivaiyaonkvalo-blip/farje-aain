const fs = require('fs');
const path = require('path');

const quizDir = path.join(__dirname, '..', 'quiz-data');
const portalData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'portal-data.json'), 'utf8'));

console.log('Generating Chapter and Mega Quiz Bundles...');

const chapterLessons = {};
portalData.lessons.forEach(l => {
  if (!chapterLessons[l.chapterId]) chapterLessons[l.chapterId] = [];
  chapterLessons[l.chapterId].push(l.id);
});

const allLessonQuestions = {};
for (let i = 1; i <= 35; i++) {
  const num = String(i).padStart(2, '0');
  const file = path.join(quizDir, `quiz-lesson-${num}.json`);
  allLessonQuestions[i] = JSON.parse(fs.readFileSync(file, 'utf8'));
}

// 1. Generate Chapter Bundles
Object.keys(chapterLessons).forEach(chId => {
  const lessonIds = chapterLessons[chId];
  let chapterQuestions = [];
  lessonIds.forEach(lid => {
    chapterQuestions = chapterQuestions.concat(allLessonQuestions[lid]);
  });
  
  const outFile = path.join(quizDir, `quiz-chapter-${chId}.json`);
  fs.writeFileSync(outFile, JSON.stringify(chapterQuestions, null, 2), 'utf8');
  console.log(`Chapter ${chId}: ${chapterQuestions.length} questions -> ${outFile}`);
});

// 2. Generate Mega Quiz Bundle (take 20 questions from each lesson = 700 questions)
let megaQuestions = [];
for (let i = 1; i <= 35; i++) {
  const qs = allLessonQuestions[i];
  // Take 20 distributed questions from each lesson
  const sample = qs.slice(0, 20);
  megaQuestions = megaQuestions.concat(sample);
}

const megaFile = path.join(quizDir, 'quiz-mega-challenge.json');
fs.writeFileSync(megaFile, JSON.stringify(megaQuestions, null, 2), 'utf8');
console.log(`Mega Challenge: ${megaQuestions.length} questions -> ${megaFile}`);

console.log('Done compiling quiz bundles!');
