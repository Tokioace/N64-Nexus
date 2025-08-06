const fs = require('fs');
const path = require('path');

const translationDir = 'src/translations';

// Fix apostrophe issues in translation files
const filesToFix = ['fr.ts', 'it.ts'];

filesToFix.forEach(file => {
  const filePath = path.join(translationDir, file);
  
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix French apostrophes
    if (file === 'fr.ts') {
      content = content.replace(/Obtenez l'expérience/g, "Obtenez l\\'expérience");
      content = content.replace(/Installer l'App/g, "Installer l\\'App");
      content = content.replace(/Ajouter à l'écran d'accueil/g, "Ajouter à l\\'écran d\\'accueil");
      content = content.replace(/Aujourd'hui/g, "Aujourd\\'hui");
      content = content.replace(/L'événement/g, "L\\'événement");
    }
    
    // Fix Italian apostrophes
    if (file === 'it.ts') {
      content = content.replace(/Ottieni l'esperienza/g, "Ottieni l\\'esperienza");
      content = content.replace(/dell'app/g, "dell\\'app");
      content = content.replace(/L'evento/g, "L\\'evento");
    }
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed apostrophes in ${file}`);
  } else {
    console.log(`Warning: File ${filePath} does not exist`);
  }
});

console.log('\n🎉 All apostrophe issues have been fixed!');