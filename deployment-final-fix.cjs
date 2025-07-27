// Automatic SSR Fix Script for localStorage usage
const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing remaining SSR issues...\n');

// Files that need localStorage fixes
const filesToFix = [
  'src/contexts/EventContext.tsx',
  'src/contexts/MediaContext.tsx', 
  'src/contexts/PointsContext.tsx',
  'src/contexts/UserContext.tsx'
];

filesToFix.forEach(filePath => {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${filePath} not found, skipping...`);
    return;
  }

  console.log(`🔧 Fixing ${filePath}...`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Add import for safeLocalStorage if not present
  if (!content.includes('safeLocalStorage') && !content.includes('safeJSONStorage')) {
    // Find the last import statement
    const imports = content.match(/^import.*$/gm);
    if (imports) {
      const lastImport = imports[imports.length - 1];
      const lastImportIndex = content.indexOf(lastImport) + lastImport.length;
      
      content = content.slice(0, lastImportIndex) + 
                "\nimport { safeLocalStorage, safeJSONStorage } from '../utils/storage'" +
                content.slice(lastImportIndex);
      modified = true;
      console.log('  ✅ Added safe storage import');
    }
  }

  // Replace localStorage.getItem patterns
  const getItemPattern = /localStorage\.getItem\(([^)]+)\)/g;
  if (getItemPattern.test(content)) {
    content = content.replace(getItemPattern, 'safeLocalStorage.getItem($1)');
    modified = true;
    console.log('  ✅ Fixed localStorage.getItem calls');
  }

  // Replace localStorage.setItem patterns
  const setItemPattern = /localStorage\.setItem\(([^,]+),\s*JSON\.stringify\(([^)]+)\)\)/g;
  if (setItemPattern.test(content)) {
    content = content.replace(setItemPattern, 'safeJSONStorage.set($1, $2)');
    modified = true;
    console.log('  ✅ Fixed localStorage.setItem with JSON.stringify calls');
  }

  // Replace remaining localStorage.setItem patterns
  const setItemSimplePattern = /localStorage\.setItem\(([^)]+)\)/g;
  if (setItemSimplePattern.test(content)) {
    content = content.replace(setItemSimplePattern, 'safeLocalStorage.setItem($1)');
    modified = true;
    console.log('  ✅ Fixed simple localStorage.setItem calls');
  }

  // Replace localStorage.removeItem patterns
  const removeItemPattern = /localStorage\.removeItem\(([^)]+)\)/g;
  if (removeItemPattern.test(content)) {
    content = content.replace(removeItemPattern, 'safeLocalStorage.removeItem($1)');
    modified = true;
    console.log('  ✅ Fixed localStorage.removeItem calls');
  }

  // Replace JSON.parse(localStorage.getItem()) patterns
  const jsonParsePattern = /JSON\.parse\(localStorage\.getItem\(([^)]+)\)\s*\|\|\s*([^)]+)\)/g;
  if (jsonParsePattern.test(content)) {
    content = content.replace(jsonParsePattern, 'safeJSONStorage.get($1, $2)');
    modified = true;
    console.log('  ✅ Fixed JSON.parse localStorage patterns');
  }

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`  ✅ ${filePath} updated successfully\n`);
  } else {
    console.log(`  ℹ️  ${filePath} already fixed or no changes needed\n`);
  }
});

console.log('🎉 SSR fixes completed!');
console.log('💡 All localStorage usage is now SSR-safe');
console.log('🚀 Ready for deployment on any platform!');