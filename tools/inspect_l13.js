const fs = require('fs');

const content = fs.readFileSync('r:/presentation/farje-aain-web/slides/lesson-13.html', 'utf8');
console.log('lesson-13 size:', content.length);
console.log('first 500 chars:', content.slice(0, 500));
console.log('has slide-section?', content.includes('slide-section'));
console.log('has slide-frame?', content.includes('slide-frame'));
console.log('has slide?', content.includes('slide'));
