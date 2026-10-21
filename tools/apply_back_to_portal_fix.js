const fs = require('fs');
const path = require('path');

const helperScript = `
  <script>
    function returnToPortal(e) {
      if (e && e.preventDefault) e.preventDefault();
      var p = window.location.pathname;
      if (p.startsWith('/farj') || p.includes('/farj/')) {
        window.location.href = '/farj';
      } else if (p.startsWith('/farz') || p.includes('/farz/')) {
        window.location.href = '/farz';
      } else if (p.startsWith('/farje-aain') || p.includes('/farje-aain/')) {
        window.location.href = '/farje-aain';
      } else {
        window.location.href = '/';
      }
    }
    window.returnToPortal = returnToPortal;
  </script>
</head>`;

const slidesDir = 'r:/presentation/farje-aain-web/slides';
const files = fs.readdirSync(slidesDir);
let fixedCount = 0;

for (const f of files) {
  if (!f.endsWith('.html')) continue;
  const filePath = path.join(slidesDir, f);
  let content = fs.readFileSync(filePath, 'utf8');

  let modified = false;

  // 1. Replace href="../index.html" with href="../" onclick="returnToPortal(event)"
  if (content.includes('href="../index.html"')) {
    content = content.replace(/href=["']\.\.\/index\.html["']/g, 'href="../" onclick="returnToPortal(event)"');
    modified = true;
  }

  // 2. Inject helper script if not already present
  if (!content.includes('function returnToPortal(')) {
    if (content.includes('</head>')) {
      content = content.replace('</head>', helperScript);
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    fixedCount++;
    console.log(`Updated back button in: ${f}`);
  }
}

console.log(`Total slide files updated: ${fixedCount}`);
