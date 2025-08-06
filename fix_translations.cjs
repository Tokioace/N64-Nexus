const fs = require('fs');
const path = require('path');

const translationDir = 'src/translations';
const files = fs.readdirSync(translationDir).filter(f => f.endsWith('.ts') && f !== 'template.ts' && f !== 'index.ts');

files.forEach(file => {
  const filePath = path.join(translationDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove PWA section duplicates - keep only the first occurrence
  const lines = content.split('\n');
  const seenKeys = new Set();
  const filteredLines = [];
  let inPWASection = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if we're entering a PWA section
    if (line.includes('// PWA Installation Prompt')) {
      if (inPWASection) {
        // Skip this duplicate section
        while (i < lines.length && !lines[i].includes('// ') && !lines[i].includes('}')) {
          i++;
        }
        i--; // Back up one to not skip the next section
        continue;
      }
      inPWASection = true;
    }
    
    // Check for duplicate keys
    const keyMatch = line.match(/^\s*'([^']+)':/);
    if (keyMatch) {
      const key = keyMatch[1];
      if (seenKeys.has(key)) {
        // Skip duplicate key
        continue;
      }
      seenKeys.add(key);
    }
    
    filteredLines.push(line);
  }
  
  const newContent = filteredLines.join('\n');
  fs.writeFileSync(filePath, newContent);
  console.log(`Fixed duplicates in ${file}`);
});

console.log('All translation files fixed!');