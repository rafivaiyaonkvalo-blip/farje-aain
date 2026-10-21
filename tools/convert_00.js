const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, '..', '..', '০০_শুরুর_আগে.html');
const destPath = path.join(__dirname, '..', 'slides', 'lesson-00.html');

console.log('Reading from:', srcPath);
const srcHtml = fs.readFileSync(srcPath, 'utf8');

// Extract all slide sections
const slideRegex = /<div class="slide-section" id="slide-(\d+)">([\s\S]*?)<\/div>(?=\s*(?:<div class="slide-section"|<\/body>))/g;
let match;
let slides = [];
while ((match = slideRegex.exec(srcHtml)) !== null) {
  slides.push({ id: match[1], content: match[2].trim() });
}

console.log('Found slides:', slides.length);

const navBarHtml = `
  <!-- TOP BACK TO PORTAL BAR -->
  <div class="portal-nav-bar" style="width: 100%; max-width: 1120px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; padding: 0 6px; box-sizing: border-box; z-index: 1000;">
    <a href="../index.html" class="portal-back-btn" style="text-decoration: none; color: #38BDF8; background: rgba(56, 189, 248, 0.15); border: 1px solid rgba(56, 189, 248, 0.45); font-weight: 700; padding: 7px 16px; border-radius: 8px; display: inline-flex; align-items: center; gap: 8px; font-size: 14px; font-family: 'Kalpurush', 'Noto Serif Bengali', sans-serif; transition: all 0.2s ease;">
      ← মূল পেজে ফিরুন
    </a>
    <span style="color: #94A3B8; font-size: 13.5px; font-family: 'Kalpurush', 'Noto Serif Bengali', sans-serif;">
      মারকাযুল ঈমান মাদরাসা • দাওয়াহ বিভাগ
    </span>
  </div>
`;

const universalControlsHtml = `
  <!-- SLIDE CONTROLS BAR -->
  <div class="slide-nav-controls" style="display: flex; align-items: center; justify-content: space-between; width: 100%; max-width: 1120px; margin-top: 14px; gap: 14px; box-sizing: border-box;">
    <button class="slide-nav-btn" id="prevSlideBtn" onclick="prevSlide()" style="background: #0B6E5F; color: #FFFFFF; border: 1px solid rgba(255,255,255,0.2); padding: 9px 20px; border-radius: 8px; font-size: 14.5px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 6px; font-family: inherit;">
      ← পূর্ববর্তী
    </button>
    <div style="flex: 1; height: 6px; background: rgba(255,255,255,0.12); border-radius: 3px; overflow: hidden; max-width: 380px;">
      <div id="slideProgressBar" style="height: 100%; background: linear-gradient(90deg, #38BDF8, #10B981); width: 0%; transition: width 0.25s;"></div>
    </div>
    <div id="slideCounterText" style="font-size: 15px; font-weight: 700; color: #D4A843; min-width: 75px; text-align: center;">১ / ${slides.length}</div>
    <button class="slide-nav-btn" id="nextSlideBtn" onclick="nextSlide()" style="background: #0B6E5F; color: #FFFFFF; border: 1px solid rgba(255,255,255,0.2); padding: 9px 20px; border-radius: 8px; font-size: 14.5px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 6px; font-family: inherit;">
      পরবর্তী →
    </button>
  </div>
`;

const universalScript = `
  <script>
    (function() {
      const slides = Array.from(document.querySelectorAll('.slide'));
      if (slides.length === 0) return;

      let currentSlideIdx = 0;
      const prevBtn = document.getElementById('prevSlideBtn');
      const nextBtn = document.getElementById('nextSlideBtn');
      const counter = document.getElementById('slideCounterText');
      const progress = document.getElementById('slideProgressBar');

      const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
      function toBn(n) {
        return String(n).split('').map(d => bnDigits[d] || d).join('');
      }

      window.showSlide = function(index) {
        if (index < 0) index = 0;
        if (index >= slides.length) index = slides.length - 1;
        currentSlideIdx = index;

        slides.forEach((s, idx) => {
          if (idx === index) {
            s.classList.add('active');
            s.style.display = 'flex';
            s.style.opacity = '1';
          } else {
            s.classList.remove('active');
            s.style.display = 'none';
            s.style.opacity = '0';
          }
        });

        if (prevBtn) prevBtn.disabled = (index === 0);
        if (nextBtn) nextBtn.disabled = (index === slides.length - 1);
        if (counter) counter.innerText = \`\${toBn(index + 1)} / \${toBn(slides.length)}\`;
        if (progress) progress.style.width = \`\${((index + 1) / slides.length) * 100}%\`;
      };

      window.nextSlide = function() {
        if (currentSlideIdx < slides.length - 1) {
          window.showSlide(currentSlideIdx + 1);
        }
      };

      window.prevSlide = function() {
        if (currentSlideIdx > 0) {
          window.showSlide(currentSlideIdx - 1);
        }
      };

      document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
          window.nextSlide();
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
          window.prevSlide();
        } else if (e.key === 'Home') {
          window.showSlide(0);
        } else if (e.key === 'End') {
          window.showSlide(slides.length - 1);
        }
      });

      // Show first slide
      window.showSlide(0);
    })();
  </script>
`;

let slidesHtml = slides.map((s, idx) => {
  const isDark = idx === 0 || idx === slides.length - 1;
  const activeClass = idx === 0 ? ' active' : '';
  const darkClass = isDark ? ' slide-dark' : '';
  const displayStyle = idx === 0 ? 'display: flex; opacity: 1;' : 'display: none; opacity: 0;';
  
  return `
    <div class="slide${activeClass}${darkClass}" id="slide-${s.id}" style="${displayStyle}">
      ${s.content}
    </div>
  `;
}).join('\n');

const fullHtml = `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ফারজে আইন • ভূমিকা: শুরুর আগে</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@700&family=Kalpurush&family=Noto+Serif+Bengali:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --teal-deep: #0B6E5F;
      --teal-mid:  #0E8C7A;
      --navy:      #1B3A5C;
      --gold:      #D4A843;
      --ivory:     #F7F5F0;
      --charcoal:  #2B2D32;
      --white:     #FFFFFF;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #060D1A;
      font-family: 'Kalpurush', 'Noto Serif Bengali', serif;
      color: var(--charcoal);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 16px;
      overflow-x: hidden;
    }

    .presentation-container {
      width: 100%;
      max-width: 1120px;
      aspect-ratio: 16 / 9;
      background: var(--ivory);
      box-shadow: 0 25px 65px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      position: relative;
      overflow: hidden;
    }

    .slide {
      position: absolute !important;
      inset: 0 !important;
      width: 100% !important;
      height: 100% !important;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background: var(--ivory);
      transition: opacity 0.2s ease-in-out;
    }

    .slide.slide-dark {
      background: #0B6E5F;
      justify-content: center;
      align-items: center;
    }

    .full-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
    }

    .slide-inner {
      padding: 24px 45px 18px 45px;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .header-box .category {
      font-size: 14px;
      font-weight: 700;
      color: #1B3A5C;
      margin-bottom: 4px;
    }
    .header-box .title {
      font-size: 24px;
      font-weight: 800;
      color: #0B6E5F;
      margin-bottom: 8px;
    }
    .header-box .divider {
      height: 3px;
      background: #D4A843;
    }

    .content-body {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 10px;
    }

    .card {
      background: #FFFFFF;
      border-radius: 6px;
      overflow: hidden;
      border: 1px solid #CBD5E1;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }
    .card.box2 {
      border: 1px solid #D4A843;
    }
    .card-header {
      padding: 5px 16px;
      font-size: 15px;
      font-weight: 700;
      color: #FFFFFF;
    }
    .card-header.primary {
      background: #0B6E5F;
    }
    .card-header.secondary {
      background: #1B3A5C;
    }
    .card-text {
      padding: 10px 18px;
      color: #111827;
      line-height: 1.5;
      font-size: 14.5px;
    }

    .hadith-card {
      background: #FFFFFF;
      border: 2px solid #D4A843;
      border-radius: 6px;
      text-align: center;
      margin-top: 6px;
    }
    .hadith-badge {
      background: #0B6E5F;
      color: #FFFFFF;
      padding: 6px 20px;
      font-size: 15px;
      font-weight: 700;
    }
    .hadith-arabic {
      font-size: 28px;
      font-weight: 700;
      color: #0B6E5F;
      padding: 16px 20px 12px 20px;
      line-height: 1.4;
      font-family: 'Amiri', serif;
    }
    .hadith-sep {
      width: 240px;
      height: 2px;
      background: #D4A843;
      margin: 0 auto;
    }
    .hadith-bengali {
      font-size: 19px;
      font-weight: 700;
      color: #111827;
      padding: 12px 20px 10px 20px;
    }
    .hadith-ref {
      font-size: 14px;
      font-weight: 600;
      color: #A67C1E;
      padding-bottom: 14px;
    }

    .footer-box {
      text-align: right;
      font-size: 13px;
      color: #4B5563;
    }
  </style>
</head>
<body>
${navBarHtml}

  <div class="presentation-container" id="presentationContainer">
${slidesHtml}
  </div>

${universalControlsHtml}

${universalScript}
</body>
</html>
`;

fs.writeFileSync(destPath, fullHtml, 'utf8');
console.log('Successfully written lesson-00.html to:', destPath);
