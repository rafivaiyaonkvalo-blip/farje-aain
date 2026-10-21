const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'slides');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(f => {
  const c = fs.readFileSync(path.join(dir, f), 'utf-8');
  const hasShow = c.includes('showSlide');
  const hasClassActive = c.includes("classList.add('active')") || c.includes('classList.add("active")');
  const setsDisplay = c.includes('.style.display =');
  console.log(f, 'hasShowSlide:', hasShow, 'hasClassActive:', hasClassActive, 'setsDisplay:', setsDisplay);
});
