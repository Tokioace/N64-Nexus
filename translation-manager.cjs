#!/usr/bin/env node

/**
 * Translation Manager for Battle64
 * 
 * This script helps you manage your 13 language translations efficiently.
 * It prevents the issues you were having with languages interfering with each other.
 * 
 * Usage:
 *   node translation-manager.js check           - Check for missing translations
 *   node translation-manager.js add-key <key>   - Add a new translation key to all languages
 *   node translation-manager.js validate        - Validate all translation files
 *   node translation-manager.js stats           - Show translation statistics
 */

const fs = require('fs');
const path = require('path');

const TRANSLATIONS_DIR = './src/translations';
const LANGUAGES = ['de', 'en', 'fr', 'it', 'es', 'el', 'tr', 'zh', 'ja', 'ru', 'pt', 'hi', 'ar'];

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function loadTranslation(lang) {
  try {
    const filePath = path.join(TRANSLATIONS_DIR, `${lang}.ts`);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Extract translation keys from the file
    const keys = {};
    const lines = content.split('\n');
    
    for (const line of lines) {
      const match = line.match(/^\s*'([^']+)':\s*'([^']*)',?\s*$/);
      if (match) {
        keys[match[1]] = match[2];
      }
    }
    
    return keys;
  } catch (error) {
    log('red', `Error loading ${lang}.ts: ${error.message}`);
    return {};
  }
}

function saveTranslation(lang, keys) {
  const filePath = path.join(TRANSLATIONS_DIR, `${lang}.ts`);
  
  let content = `const ${lang} = {\n`;
  
  // Group keys by category (based on prefix)
  const categories = {};
  for (const [key, value] of Object.entries(keys)) {
    const category = key.split('.')[0];
    if (!categories[category]) categories[category] = [];
    categories[category].push([key, value]);
  }
  
  // Sort categories
  const sortedCategories = Object.keys(categories).sort();
  
  for (let i = 0; i < sortedCategories.length; i++) {
    const category = sortedCategories[i];
    content += `\n  // ${category.charAt(0).toUpperCase() + category.slice(1)}\n`;
    
    for (const [key, value] of categories[category]) {
      content += `  '${key}': '${value}',\n`;
    }
  }
  
  content += '}\n\nexport default ' + lang;
  
  fs.writeFileSync(filePath, content);
  log('green', `Updated ${lang}.ts`);
}

function checkMissingTranslations() {
  log('blue', '🔍 Checking for missing translations...\n');
  
  // Use English as the reference
  const englishKeys = loadTranslation('en');
  const englishKeySet = new Set(Object.keys(englishKeys));
  
  let totalMissing = 0;
  
  for (const lang of LANGUAGES) {
    if (lang === 'en') continue;
    
    const langKeys = loadTranslation(lang);
    const langKeySet = new Set(Object.keys(langKeys));
    
    const missing = [...englishKeySet].filter(key => !langKeySet.has(key));
    const extra = [...langKeySet].filter(key => !englishKeySet.has(key));
    
    if (missing.length > 0 || extra.length > 0) {
      log('yellow', `\n📋 ${lang.toUpperCase()} (${Object.keys(langKeys).length}/${Object.keys(englishKeys).length} keys)`);
      
      if (missing.length > 0) {
        log('red', `  ❌ Missing ${missing.length} keys:`);
        missing.slice(0, 5).forEach(key => console.log(`    - ${key}`));
        if (missing.length > 5) {
          console.log(`    ... and ${missing.length - 5} more`);
        }
        totalMissing += missing.length;
      }
      
      if (extra.length > 0) {
        log('magenta', `  ➕ Extra ${extra.length} keys:`);
        extra.slice(0, 3).forEach(key => console.log(`    + ${key}`));
        if (extra.length > 3) {
          console.log(`    ... and ${extra.length - 3} more`);
        }
      }
    } else {
      log('green', `✅ ${lang.toUpperCase()} - Complete (${Object.keys(langKeys).length} keys)`);
    }
  }
  
  if (totalMissing === 0) {
    log('green', '\n🎉 All translations are complete!');
  } else {
    log('yellow', `\n⚠️  Total missing translations: ${totalMissing}`);
  }
}

function addTranslationKey(key) {
  if (!key) {
    log('red', 'Please provide a translation key');
    return;
  }
  
  log('blue', `➕ Adding key "${key}" to all languages...\n`);
  
  for (const lang of LANGUAGES) {
    const keys = loadTranslation(lang);
    
    if (keys[key]) {
      log('yellow', `${lang}: Key already exists`);
      continue;
    }
    
    // Add the key with a placeholder value
    const placeholder = lang === 'en' ? 'TRANSLATE_ME' : `TRANSLATE_ME_${lang.toUpperCase()}`;
    keys[key] = placeholder;
    
    saveTranslation(lang, keys);
  }
  
  log('green', '\n✅ Key added to all languages. Please update the translations manually.');
}

function validateTranslations() {
  log('blue', '🔧 Validating translation files...\n');
  
  let hasErrors = false;
  
  for (const lang of LANGUAGES) {
    const filePath = path.join(TRANSLATIONS_DIR, `${lang}.ts`);
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check for syntax errors
      if (!content.includes(`const ${lang} = {`)) {
        log('red', `${lang}: Missing proper const declaration`);
        hasErrors = true;
      }
      
      if (!content.includes(`export default ${lang}`)) {
        log('red', `${lang}: Missing export statement`);
        hasErrors = true;
      }
      
      // Check for common issues
      const lines = content.split('\n');
      let inObject = false;
      let lineNum = 0;
      
      for (const line of lines) {
        lineNum++;
        
        if (line.includes(`const ${lang} = {`)) {
          inObject = true;
          continue;
        }
        
        if (inObject && line.trim() === '}') {
          inObject = false;
          continue;
        }
        
        if (inObject && line.trim() && !line.trim().startsWith('//')) {
          // Check for proper key-value format
          if (!line.match(/^\s*'[^']+'\s*:\s*'[^']*',?\s*$/)) {
            log('red', `${lang}:${lineNum}: Invalid format: ${line.trim()}`);
            hasErrors = true;
          }
        }
      }
      
      if (!hasErrors) {
        log('green', `✅ ${lang}: Valid`);
      }
      
    } catch (error) {
      log('red', `${lang}: Error reading file - ${error.message}`);
      hasErrors = true;
    }
  }
  
  if (!hasErrors) {
    log('green', '\n🎉 All translation files are valid!');
  }
}

function showStats() {
  log('blue', '📊 Translation Statistics\n');
  
  const englishKeys = loadTranslation('en');
  const totalKeys = Object.keys(englishKeys).length;
  
  console.log(`📝 Total translation keys: ${totalKeys}\n`);
  
  // Categories breakdown
  const categories = {};
  for (const key of Object.keys(englishKeys)) {
    const category = key.split('.')[0];
    categories[category] = (categories[category] || 0) + 1;
  }
  
  log('cyan', '📋 Keys by category:');
  Object.entries(categories)
    .sort(([,a], [,b]) => b - a)
    .forEach(([category, count]) => {
      console.log(`  ${category}: ${count} keys`);
    });
  
  console.log();
  
  // Language completion
  log('cyan', '🌍 Language completion:');
  for (const lang of LANGUAGES) {
    const langKeys = loadTranslation(lang);
    const completion = Math.round((Object.keys(langKeys).length / totalKeys) * 100);
    const bar = '█'.repeat(Math.floor(completion / 5)) + '░'.repeat(20 - Math.floor(completion / 5));
    
    console.log(`  ${lang.toUpperCase().padEnd(3)}: [${bar}] ${completion}% (${Object.keys(langKeys).length}/${totalKeys})`);
  }
}

// Main execution
const command = process.argv[2];
const arg = process.argv[3];

switch (command) {
  case 'check':
    checkMissingTranslations();
    break;
  case 'add-key':
    addTranslationKey(arg);
    break;
  case 'validate':
    validateTranslations();
    break;
  case 'stats':
    showStats();
    break;
  default:
    log('blue', '🌍 Battle64 Translation Manager\n');
    console.log('Usage:');
    console.log('  node translation-manager.js check           - Check for missing translations');
    console.log('  node translation-manager.js add-key <key>   - Add a new translation key');
    console.log('  node translation-manager.js validate        - Validate all translation files');
    console.log('  node translation-manager.js stats           - Show translation statistics');
    console.log('\nThis tool helps prevent the language conflicts you were experiencing!');
}