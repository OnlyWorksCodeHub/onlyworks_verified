const fs = require('fs');
const path = require('path');

const IGNORE_DIRS = ['node_modules', '.git', '.next', 'dist', 'build', '.vercel'];
const IGNORE_FILES = ['.DS_Store', 'dump-all.js', 'output.txt'];
const BINARY_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.mp4', '.webp'];

function getAllFiles(dirPath, arrayOfFiles = [], relativePath = '') {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    const relPath = path.join(relativePath, file);
    
    if (IGNORE_FILES.includes(file)) return;
    
    if (fs.statSync(fullPath).isDirectory()) {
      if (!IGNORE_DIRS.includes(file)) {
        arrayOfFiles = getAllFiles(fullPath, arrayOfFiles, relPath);
      }
    } else {
      arrayOfFiles.push(relPath);
    }
  });

  return arrayOfFiles;
}

console.log('=== COMPLETE PROJECT DUMP ===\n');

// Get all files
const allFiles = getAllFiles('.');

// Sort files for better organization
allFiles.sort();

// Print each file's content
allFiles.forEach(file => {
  const ext = path.extname(file);
  
  // Skip binary files
  if (BINARY_EXTENSIONS.includes(ext)) {
    console.log(`\n===== ${file} =====`);
    console.log('[BINARY FILE - SKIPPED]');
    return;
  }
  
  console.log(`\n===== ${file} =====`);
  
  try {
    let content = fs.readFileSync(file, 'utf8');
    
    // Hide sensitive data
    if (file.includes('.env')) {
      content = content.replace(/sk-[^\s]+/g, 'sk-***HIDDEN***');
      content = content.replace(/(?<=_KEY=)[^\s]+/g, '***HIDDEN***');
      content = content.replace(/(?<=_SECRET=)[^\s]+/g, '***HIDDEN***');
    }
    
    console.log(content);
  } catch (err) {
    console.log(`ERROR READING FILE: ${err.message}`);
  }
});

console.log('\n=== END OF DUMP ===');