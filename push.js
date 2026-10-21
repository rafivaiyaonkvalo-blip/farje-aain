const { execSync } = require('child_process');
const cwd = __dirname;

function run(cmd) {
  console.log('Running:', cmd);
  const out = execSync(cmd, { cwd, encoding: 'utf8', stdio: 'inherit' });
}

try {
  run('git init');
  run('git branch -M main');
  try {
    run('git remote add origin https://github.com/rafivaiyaonkvalo-blip/farje-aain.git');
  } catch (e) {
    run('git remote set-url origin https://github.com/rafivaiyaonkvalo-blip/farje-aain.git');
  }
  run('git add .');
  run('git commit -m "feat: launch Kitabul Farje Ain 35-lesson web portal"');
  run('git push -u origin main --force');
  console.log('SUCCESS: Pushed to GitHub!');
} catch (err) {
  console.error('Git error:', err);
  process.exit(1);
}
