const fs = require('fs');

const languages = ['tr', 'zh', 'ja', 'ru', 'pt', 'hi', 'ar'];

// Read the English template
const enContent = fs.readFileSync('./src/translations/en.ts', 'utf8');

languages.forEach(lang => {
  // Replace 'const en' with 'const [lang]' and 'export default en' with 'export default [lang]'
  let content = enContent.replace(/const en = {/, `const ${lang} = {`);
  content = content.replace(/export default en/, `export default ${lang}`);
  
  fs.writeFileSync(`./src/translations/${lang}.ts`, content);
  console.log(`Created ${lang}.ts`);
});

console.log('All translation files created successfully!');