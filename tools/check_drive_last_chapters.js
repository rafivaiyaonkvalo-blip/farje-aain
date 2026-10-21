const fs = require('fs');
const { execSync } = require('child_process');

const tree = JSON.parse(fs.readFileSync('r:/presentation/drive_tree_ids.json', 'utf8'));

console.log('--- Inspecting Drive folders for last chapters ---');
const chapters = ['০৩_মুআমালাত', '০৪_মুআশারাত_ও_আখলাকিয়াত', '০৫_হালাল_হারাম'];

for (const ch of chapters) {
  const chData = tree[ch];
  if (!chData) continue;
  console.log(`\n=== ${ch} ===`);
  for (const [lKey, folderId] of Object.entries(chData.lessons || {})) {
    try {
      const out = execSync(`gdrive readonly ls ${folderId} --json`, { encoding: 'utf8', timeout: 15000 });
      const parsed = JSON.parse(out);
      const files = parsed.files || [];
      const types = files.map(f => `${f.name} (${f.mimeType})`);
      console.log(`  ${lKey} (${folderId}): ${files.length} files -> ${types.join(', ')}`);
    } catch (e) {
      console.log(`  ${lKey} (${folderId}): ERROR: ${e.message.slice(0, 100)}`);
    }
  }
}
