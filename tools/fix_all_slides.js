const fs = require('fs');
const path = require('path');

const slidesDir = path.join(__dirname, '..', 'slides');

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
    <div id="slideCounterText" style="font-size: 15px; font-weight: 700; color: #D4A843; min-width: 75px; text-align: center;">১ / ১</div>
    <button class="slide-nav-btn" id="nextSlideBtn" onclick="nextSlide()" style="background: #0B6E5F; color: #FFFFFF; border: 1px solid rgba(255,255,255,0.2); padding: 9px 20px; border-radius: 8px; font-size: 14.5px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 6px; font-family: inherit;">
      পরবর্তী →
    </button>
  </div>
`;

const universalScript = `
  <script>
    (function() {
      // Find all slide elements (supports various class formats)
      let slides = Array.from(document.querySelectorAll('.slide'));
      if (slides.length === 0) {
        slides = Array.from(document.querySelectorAll('[class*="slide"]')).filter(el => {
          return !el.classList.contains('slide-nav-controls') && !el.classList.contains('slide-nav-btn');
        });
      }
      if (slides.length === 0) return;

      let currentSlideIdx = 0;
      const prevBtn = document.getElementById('prevSlideBtn') || document.getElementById('prevBtn');
      const nextBtn = document.getElementById('nextSlideBtn') || document.getElementById('nextBtn');
      const counter = document.getElementById('slideCounterText') || document.getElementById('slideCounter');
      const progress = document.getElementById('slideProgressBar') || document.getElementById('progressBar');

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

      document.addEventListener('keydown', (e) => {
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

      // Initialize slide 0
      window.showSlide(0);
    })();
  </script>
`;

console.log('Fixing navigation & adding Portal Back buttons to all 35 slides...');

for (let i = 1; i <= 35; i++) {
  const numStr = String(i).padStart(2, '0');
  const filePath = path.join(slidesDir, `lesson-${numStr}.html`);
  if (!fs.existsSync(filePath)) continue;

  let html = fs.readFileSync(filePath, 'utf8');

  // 1. Ensure Back to Portal button exists
  if (!html.includes('মূল পেজে ফিরুন') && !html.includes('portal-back-btn')) {
    // Insert right after <body>
    html = html.replace(/(<body[^>]*>)/i, `$1\n${navBarHtml}`);
  }

  // 2. Check if slide navigation controls or script missing
  const hasControls = html.includes('prevSlide') || html.includes('slide-nav-controls');
  const hasScript = html.includes('function prevSlide') || html.includes('window.prevSlide');

  if (!hasControls || !hasScript) {
    // Insert controls before </body>
    if (!html.includes('slide-nav-controls')) {
      html = html.replace(/<\/body>/i, `${universalControlsHtml}\n${universalScript}\n</body>`);
    } else if (!hasScript) {
      html = html.replace(/<\/body>/i, `${universalScript}\n</body>`);
    }
  }

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`✓ Lesson ${numStr}: Verified portal return & navigation controls`);
}

console.log('🎉 All 35 slides successfully updated with complete navigation and portal return!');
