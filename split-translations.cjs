const fs = require('fs');
const path = require('path');

console.log('🔧 Splitting translations into separate files...\n');

// Read the current LanguageContext file
const content = fs.readFileSync('src/contexts/LanguageContext.tsx', 'utf8');

// Create translations directory
const translationsDir = 'src/translations';
if (!fs.existsSync(translationsDir)) {
  fs.mkdirSync(translationsDir, { recursive: true });
}

// Extract the translations object - it ends with double closing braces
const translationsStart = content.indexOf('const translations = {');
const translationsEnd = content.indexOf('\n}\n\nexport const LanguageProvider');

if (translationsStart === -1 || translationsEnd === -1) {
  console.error('Could not find translations object in LanguageContext.tsx');
  console.log('translationsStart:', translationsStart);
  console.log('translationsEnd:', translationsEnd);
  process.exit(1);
}

const translationsContent = content.substring(translationsStart + 'const translations = {'.length, translationsEnd);

// Languages to extract
const languages = ['de', 'en', 'fr', 'it', 'es', 'el', 'tr', 'zh', 'ja', 'ru', 'pt', 'hi', 'ar'];

languages.forEach((lang, index) => {
  console.log(`Extracting ${lang} translations...`);
  
  // Find the start of this language section
  const langPattern = new RegExp(`\\s+${lang}:\\s*{`, 'g');
  const langMatch = langPattern.exec(translationsContent);
  
  if (!langMatch) {
    console.warn(`Warning: Could not find ${lang} section`);
    return;
  }
  
  const langStart = langMatch.index + langMatch[0].length;
  
  // Find the end of this language section
  let langEnd = translationsContent.length;
  
  // Look for the next language or end of translations
  if (index < languages.length - 1) {
    const nextLang = languages[index + 1];
    const nextLangPattern = new RegExp(`\\s+${nextLang}:\\s*{`, 'g');
    const nextLangMatch = nextLangPattern.exec(translationsContent);
    
    if (nextLangMatch) {
      // Find the closing brace before the next language
      let pos = nextLangMatch.index - 1;
      while (pos > langStart && translationsContent[pos] !== '}') {
        pos--;
      }
      langEnd = pos;
    }
  } else {
    // This is the last language, find its closing brace
    let braceCount = 0;
    let pos = langStart;
    while (pos < translationsContent.length) {
      if (translationsContent[pos] === '{') braceCount++;
      if (translationsContent[pos] === '}') {
        if (braceCount === 0) {
          langEnd = pos;
          break;
        }
        braceCount--;
      }
      pos++;
    }
  }
  
  // Extract the language content
  const langContent = translationsContent.substring(langStart, langEnd).trim();
  
  // Create the language file
  const langFile = `export const ${lang} = {\n${langContent}\n} as const;\n`;
  
  fs.writeFileSync(path.join(translationsDir, `${lang}.ts`), langFile);
  console.log(`✅ Created ${lang}.ts (${langContent.length} characters)`);
});

console.log('\n🎉 Translation files created successfully!');
console.log('Next step: Update LanguageContext.tsx to use the new structure');