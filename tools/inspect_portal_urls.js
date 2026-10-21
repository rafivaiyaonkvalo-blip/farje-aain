const fs = require('fs');

const data = JSON.parse(fs.readFileSync('r:/presentation/farje-aain-web/portal-data.json', 'utf8'));
data.lessons.forEach(l => {
  console.log(`L${l.id} (Ch${l.chapterId}): slideUrl=${l.slideUrl}, driveUrl=${l.driveUrl ? l.driveUrl.slice(0, 45) : 'NONE'}, downloadUrl=${l.downloadUrl ? l.downloadUrl.slice(0, 45) : 'NONE'}`);
});
