const fs = require('fs');
const path = require('path');
const portal = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'portal-data.json'), 'utf8'));
portal.lessons.forEach(l => {
  console.log(l.id + ': ' + l.bengaliNum + ' - ' + l.title + ' (Chapter ' + l.chapterId + ')');
});
