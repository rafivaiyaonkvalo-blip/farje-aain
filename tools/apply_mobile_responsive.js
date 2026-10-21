const fs = require('fs');
const path = require('path');

const slidesDir = path.join(__dirname, '..', 'slides');
const files = fs.readdirSync(slidesDir).filter(f => f.endsWith('.html'));

const responsiveCss = `
    /* =========================================================
       UNIVERSAL MOBILE & TABLET RESPONSIVE ENGINE
       ========================================================= */
    @media screen and (max-width: 1024px) {
      html, body {
        width: 100% !important;
        max-width: 100vw !important;
        overflow-x: hidden !important;
      }
      body {
        padding: 8px 4px !important;
        margin: 0 !important;
        min-height: 100vh !important;
        height: auto !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: flex-start !important;
        gap: 10px !important;
      }
      .portal-nav-bar {
        width: 100% !important;
        max-width: 100% !important;
        padding: 4px 6px !important;
        margin-bottom: 6px !important;
        flex-wrap: wrap !important;
        gap: 8px !important;
        box-sizing: border-box !important;
      }
      .portal-back-btn, .portal-quiz-btn {
        font-size: 13px !important;
        padding: 6px 12px !important;
      }
      .presentation-container,
      .deck-container,
      .slide-container {
        width: 100% !important;
        max-width: 100% !important;
        height: auto !important;
        min-height: 480px !important;
        aspect-ratio: auto !important;
        overflow: hidden !important;
        border-radius: 8px !important;
        position: relative !important;
        margin: 0 auto !important;
      }
      .slide-section,
      .slide {
        width: 100% !important;
        max-width: 100% !important;
        height: auto !important;
        min-height: 480px !important;
        box-sizing: border-box !important;
        overflow: hidden !important;
        border-radius: 8px !important;
        position: relative !important;
        inset: auto !important;
      }
      .slide.active,
      .slide-section.active {
        display: flex !important;
        flex-direction: column !important;
      }
      .slide:not(.active),
      .slide-section:not(.active) {
        display: none !important;
      }
      .slide-inner {
        width: 100% !important;
        height: auto !important;
        min-height: 460px !important;
        padding: 18px 14px 14px 14px !important;
        box-sizing: border-box !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: space-between !important;
        gap: 12px !important;
      }
      .header-box .category,
      .slide-category {
        font-size: 13px !important;
        line-height: 1.3 !important;
      }
      .header-box .title,
      .slide-title {
        font-size: 19px !important;
        line-height: 1.35 !important;
        margin-bottom: 6px !important;
      }
      .content-body,
      .slide-content {
        display: flex !important;
        flex-direction: column !important;
        gap: 10px !important;
        margin-top: 8px !important;
        flex: 1 !important;
      }
      .card {
        border-radius: 6px !important;
        margin-bottom: 0 !important;
      }
      .card-header {
        font-size: 14px !important;
        padding: 6px 12px !important;
        line-height: 1.3 !important;
      }
      .card-text {
        font-size: 13px !important;
        padding: 8px 12px !important;
        line-height: 1.5 !important;
      }
      .footnote-box {
        font-size: 11px !important;
        padding: 6px 10px !important;
        line-height: 1.4 !important;
      }
      .footer-box,
      .slide-footer {
        font-size: 11px !important;
        margin-top: 6px !important;
        line-height: 1.4 !important;
      }
      .full-img,
      .full-image-slide,
      .cover-img {
        width: 100% !important;
        height: auto !important;
        max-height: 75vh !important;
        object-fit: contain !important;
        display: block !important;
        margin: 0 auto !important;
      }
      .slide-nav-controls {
        width: 100% !important;
        max-width: 100% !important;
        padding: 8px 10px !important;
        margin-top: 8px !important;
        gap: 8px !important;
        box-sizing: border-box !important;
      }
      .slide-nav-btn {
        padding: 8px 14px !important;
        font-size: 13px !important;
      }
      .slide-counter {
        font-size: 13px !important;
      }
    }
`;

const viewportMeta = '  <meta name="viewport" content="width=device-width, initial-scale=1.0">';

let updatedCount = 0;

files.forEach(f => {
  const filePath = path.join(slidesDir, f);
  let html = fs.readFileSync(filePath, 'utf-8');
  let changed = false;

  // 1. Add viewport if missing
  if (!html.toLowerCase().includes('name="viewport"') && !html.toLowerCase().includes("name='viewport'")) {
    if (html.includes('<meta charset=')) {
      html = html.replace(/(<meta charset=[^>]+>)/i, `$1\n${viewportMeta}`);
      changed = true;
    } else if (html.includes('<head>')) {
      html = html.replace('<head>', `<head>\n${viewportMeta}`);
      changed = true;
    }
  }

  // 2. Add responsive CSS if not already present
  if (!html.includes('UNIVERSAL MOBILE & TABLET RESPONSIVE ENGINE')) {
    if (html.includes('</style>')) {
      html = html.replace('</style>', `${responsiveCss}\n  </style>`);
      changed = true;
    } else if (html.includes('</head>')) {
      html = html.replace('</head>', `  <style>${responsiveCss}\n  </style>\n</head>`);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, html, 'utf-8');
    updatedCount++;
    console.log('Updated:', f);
  }
});

console.log(`Finished! Updated ${updatedCount} out of ${files.length} slide files.`);
