const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

async function syncToGit(exports, repoPath) {
  // Ensure the content directory exists
  const contentDir = path.join(repoPath, 'content');
  await fs.mkdir(contentDir, { recursive: true });

  // Write each exported page to a markdown file
  for (const exp of exports) {
    const fileName = `${exp.title.toLowerCase().replace(/\s+/g, '-')}.md`;
    const filePath = path.join(contentDir, fileName);
    await fs.writeFile(filePath, exp.content);
  }

  // Git operations
  try {
    process.chdir(repoPath);
    execSync('git add .');
    execSync('git commit -m "Update wiki content"');
    execSync('git push');
  } catch (error) {
    console.error('Git sync failed:', error);
    throw error;
  }
}

module.exports = { syncToGit };