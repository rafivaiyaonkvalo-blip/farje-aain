const fs = require('fs');
const html = fs.readFileSync('r:/presentation/farje-aain-web/slides/lesson-00.html', 'utf8');
const matches = html.match(/id=['"]slide-(\d+)['"]/gi);
console.log('Slide IDs found in lesson-00:', matches);
