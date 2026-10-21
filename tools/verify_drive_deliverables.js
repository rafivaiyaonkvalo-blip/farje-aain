const fs = require('fs');

const data = JSON.parse(fs.readFileSync('r:/presentation/drive_audit_actual.json', 'utf8'));

let missingPdfs = 0;
let totalLessons = 0;

for (const [ch, lessons] of Object.entries(data)) {
  for (const [lName, info] of Object.entries(lessons)) {
    totalLessons++;
    const pdf = (info.files || []).find(f => f.mime === 'application/pdf');
    const pres = (info.files || []).find(f => f.mime === 'application/vnd.google-apps.presentation');
    const pptx = (info.files || []).find(f => f.mime.includes('presentationml'));
    const html = (info.files || []).find(f => f.mime === 'text/html');

    if (!pdf) {
      console.log(`Missing PDF: ${ch} -> ${lName}`);
      missingPdfs++;
    }
  }
}

console.log(`Total lessons checked: ${totalLessons}, Missing PDFs: ${missingPdfs}`);
