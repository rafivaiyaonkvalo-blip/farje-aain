const fs = require('fs');

const portalData = JSON.parse(fs.readFileSync('r:/presentation/farje-aain-web/portal-data.json', 'utf8'));
const driveAudit = JSON.parse(fs.readFileSync('r:/presentation/drive_audit_actual.json', 'utf8'));

// Build mapping from lesson title / number to drive folder & pdf id
// Chapters in driveAudit:
// ০১_আকিদা, ০২_ইবাদাত, ০৩_মুআমালাত, ০৪_মুআশারাত_ও_আখলাকিয়াত, ০৫_হালাল_হারাম

const driveMap = {};

for (const [chName, lessons] of Object.entries(driveAudit)) {
  for (const [lKey, info] of Object.entries(lessons)) {
    // Extract lesson number from lKey (e.g. '০১_আকিদা_ঈমান_ও_ইসলাম' -> 1, '২০_পেশা...' -> 20)
    const numMatch = lKey.match(/^([০-৯0-9]+)_/);
    if (!numMatch) continue;
    
    // convert bengali num to int
    const bnToNum = { '০০': 0, '০১': 1, '০২': 2, '০৩': 3, '০৪': 4, '০৫': 5, '০৬': 6, '০৭': 7, '০৮': 8, '০৯': 9,
      '১০': 10, '১১': 11, '১২': 12, '১৩': 13, '১৪': 14, '১৫': 15, '১৬': 16, '১৭': 17, '১৮': 18, '১৯': 19,
      '২০': 20, '২১': 21, '২২': 22, '২৩': 23, '২৪': 24, '২৫': 25, '২৬': 26, '২৭': 27, '২৮': 28, '২৯': 29,
      '৩০': 30, '৩১': 31, '৩২': 32, '৩৩': 33, '৩৪': 34, '৩৫': 35
    };
    const id = bnToNum[numMatch[1]] !== undefined ? bnToNum[numMatch[1]] : parseInt(numMatch[1], 10);
    
    const pdf = (info.files || []).find(f => f.mime === 'application/pdf');
    const pres = (info.files || []).find(f => f.mime === 'application/vnd.google-apps.presentation');
    const pptx = (info.files || []).find(f => f.mime.includes('presentationml'));

    driveMap[id] = {
      folderId: info.folderId,
      pdfId: pdf ? pdf.id : null,
      presId: pres ? pres.id : null,
      pptxId: pptx ? pptx.id : null
    };
  }
}

let updatedCount = 0;
for (const lesson of portalData.lessons) {
  const dInfo = driveMap[lesson.id];
  if (!dInfo) continue;

  if (dInfo.folderId) {
    lesson.driveUrl = `https://drive.google.com/drive/folders/${dInfo.folderId}?usp=drive_link`;
  }
  if (dInfo.pdfId) {
    lesson.pdfId = dInfo.pdfId;
    lesson.downloadUrl = `https://drive.google.com/uc?export=download&id=${dInfo.pdfId}`;
  }
  if (dInfo.presId) {
    lesson.gslidesUrl = `https://docs.google.com/presentation/d/${dInfo.presId}/edit?usp=sharing`;
  }
  updatedCount++;
}

fs.writeFileSync('r:/presentation/farje-aain-web/portal-data.json', JSON.stringify(portalData, null, 2), 'utf8');
console.log(`Updated ${updatedCount} lessons in portal-data.json with real Drive URLs & PDF download IDs!`);
