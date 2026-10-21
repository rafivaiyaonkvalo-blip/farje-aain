const fs = require('fs');

const report = [];

for (let i = 0; i <= 35; i++) {
  const num = String(i).padStart(2, '0');
  const path = `r:/presentation/farje-aain-web/slides/lesson-${num}.html`;
  if (!fs.existsSync(path)) {
    report.push({ lesson: num, status: 'MISSING FILE' });
    continue;
  }
  const html = fs.readFileSync(path, 'utf8');

  // Check structure
  const hasSlideClass = (html.match(/class=["'][^"']*\bslide\b[^"']*["']/g) || []).length;
  const hasSlideSection = (html.match(/class=["'][^"']*\bslide-section\b[^"']*["']/g) || []).length;
  const hasSlideInner = (html.match(/class=["'][^"']*\bslide-inner\b[^"']*["']/g) || []).length;

  // Check script selector
  const scriptMatch = html.match(/<script[\s\S]*?<\/script>/gi);
  const scriptText = scriptMatch ? scriptMatch.join('\n') : '';

  let selectorType = 'UNKNOWN';
  if (scriptText.includes("querySelectorAll('.slide-section')")) selectorType = '.slide-section';
  else if (scriptText.includes("querySelectorAll('.slide')")) {
    if (scriptText.includes("querySelectorAll('[class*=\"slide\"]')")) selectorType = '.slide fallback [class*=slide]';
    else selectorType = '.slide';
  } else if (scriptText.includes('querySelectorAll(')) {
    selectorType = (scriptText.match(/querySelectorAll\(([^)]*)\)/) || [])[1];
  }

  // Critical check: if selector is [class*="slide"] and page has .slide-inner, inner elements will be hidden!
  let issue = null;
  if (selectorType.includes('[class*=slide]') && hasSlideInner > 0) {
    issue = 'CRITICAL BUG: querySelectorAll([class*="slide"]) selects .slide-inner and hides slide contents!';
  } else if (hasSlideClass === 0 && selectorType === '.slide') {
    issue = 'CRITICAL BUG: script looks for .slide but DOM has NO .slide elements!';
  } else if (hasSlideClass === 0 && hasSlideSection === 0) {
    issue = 'CRITICAL BUG: No slide or slide-section elements found!';
  }

  report.push({
    lesson: num,
    size: html.length,
    hasSlideClass,
    hasSlideSection,
    hasSlideInner,
    selectorType,
    issue: issue || 'OK'
  });
}

console.log(JSON.stringify(report, null, 2));
