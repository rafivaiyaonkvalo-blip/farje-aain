const fs = require('fs');

const content = fs.readFileSync('r:/presentation/farje-aain-web/slides/lesson-20.html', 'utf8');
const scriptMatches = content.match(/<script(?![^>]*src=)>([\s\S]*?)<\/script>/gi);
console.log('Script matches count in lesson-20:', scriptMatches ? scriptMatches.length : 0);
if (scriptMatches) {
  scriptMatches.forEach((s, idx) => {
    console.log(`--- SCRIPT ${idx+1} ---`);
    console.log(s.slice(0, 500));
  });
}
