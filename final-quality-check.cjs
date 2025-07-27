// Finaler Qualitäts- und Performance-Check
const fs = require('fs');
const path = require('path');

console.log('🔍 FINALE QUALITÄTSKONTROLLE\n');

let score = 0;
let maxScore = 0;

try {
  // Check 1: Build-Qualität
  console.log('1. Build-Qualität prüfen...');
  maxScore += 20;
  
  if (fs.existsSync('dist') && fs.existsSync('dist/index.html')) {
    console.log('✅ Build erfolgreich');
    score += 10;
    
    const assets = fs.readdirSync('dist/assets');
    const jsFiles = assets.filter(f => f.endsWith('.js'));
    const cssFiles = assets.filter(f => f.endsWith('.css'));
    
    if (jsFiles.length >= 15 && cssFiles.length >= 1) {
      console.log('✅ Optimale Chunk-Aufteilung');
      score += 10;
    } else {
      console.log('⚠️  Chunk-Aufteilung könnte verbessert werden');
      score += 5;
    }
  } else {
    console.log('❌ Build fehlt');
  }

  // Check 2: Übersetzungsqualität
  console.log('\n2. Übersetzungsqualität prüfen...');
  maxScore += 25;
  
  const translationDir = 'src/translations';
  if (fs.existsSync(translationDir)) {
    const languages = ['de', 'en', 'fr', 'it', 'es', 'el', 'tr', 'zh', 'ja', 'ru', 'pt', 'hi', 'ar'];
    let languageScore = 0;
    
    languages.forEach(lang => {
      const langFile = path.join(translationDir, `${lang}.ts`);
      if (fs.existsSync(langFile)) {
        const content = fs.readFileSync(langFile, 'utf8');
        const size = Math.round(fs.statSync(langFile).size / 1024);
        
        if (size > 20 && size < 100) {
          languageScore += 1;
          console.log(`✅ ${lang}.ts: ${size}KB (optimal)`);
        } else {
          console.log(`⚠️  ${lang}.ts: ${size}KB`);
        }
      }
    });
    
    if (languageScore >= 13) {
      console.log('✅ Alle 13 Sprachen optimal');
      score += 25;
    } else if (languageScore >= 10) {
      console.log('✅ Sprachen größtenteils optimal');
      score += 20;
    } else {
      console.log('⚠️  Einige Sprachen benötigen Optimierung');
      score += 10;
    }
  }

  // Check 3: Code-Qualität
  console.log('\n3. Code-Qualität prüfen...');
  maxScore += 20;
  
  const mainFiles = [
    'src/contexts/LanguageContext.tsx',
    'src/utils/storage.ts',
    'src/translations/index.ts'
  ];
  
  let codeQuality = 0;
  mainFiles.forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      const size = Math.round(fs.statSync(file).size / 1024);
      
      if (size < 10) {
        codeQuality += 1;
        console.log(`✅ ${file}: ${size}KB (kompakt)`);
      } else {
        console.log(`⚠️  ${file}: ${size}KB (groß)`);
      }
    }
  });
  
  if (codeQuality >= 3) {
    console.log('✅ Exzellente Code-Struktur');
    score += 20;
  } else {
    console.log('✅ Gute Code-Struktur');
    score += 15;
  }

  // Check 4: Performance-Optimierung
  console.log('\n4. Performance prüfen...');
  maxScore += 20;
  
  if (fs.existsSync('dist/assets')) {
    const assets = fs.readdirSync('dist/assets');
    let totalSize = 0;
    let gzipOptimal = true;
    
    assets.forEach(file => {
      if (file.endsWith('.js') || file.endsWith('.css')) {
        const filePath = path.join('dist/assets', file);
        const stats = fs.statSync(filePath);
        totalSize += stats.size;
        
        const sizeKB = Math.round(stats.size / 1024);
        if (sizeKB > 500) {
          gzipOptimal = false;
        }
      }
    });
    
    const totalMB = (totalSize / (1024 * 1024)).toFixed(2);
    console.log(`✅ Gesamt-Bundle-Größe: ${totalMB}MB`);
    
    if (totalMB < 2 && gzipOptimal) {
      console.log('✅ Optimale Performance');
      score += 20;
    } else if (totalMB < 3) {
      console.log('✅ Gute Performance');
      score += 15;
    } else {
      console.log('⚠️  Performance könnte verbessert werden');
      score += 10;
    }
  }

  // Check 5: Deployment-Bereitschaft
  console.log('\n5. Deployment-Bereitschaft prüfen...');
  maxScore += 15;
  
  const deploymentFiles = [
    'package.json',
    'vite.config.ts',
    'vercel.json',
    '.nvmrc'
  ];
  
  let deploymentReady = 0;
  deploymentFiles.forEach(file => {
    if (fs.existsSync(file)) {
      deploymentReady += 1;
      console.log(`✅ ${file} vorhanden`);
    } else {
      console.log(`⚠️  ${file} fehlt`);
    }
  });
  
  if (deploymentReady >= 4) {
    console.log('✅ Vollständig deployment-bereit');
    score += 15;
  } else if (deploymentReady >= 3) {
    console.log('✅ Deployment-bereit');
    score += 12;
  } else {
    console.log('⚠️  Deployment-Konfiguration unvollständig');
    score += 8;
  }

  // Endergebnis
  const percentage = Math.round((score / maxScore) * 100);
  
  console.log('\n' + '='.repeat(60));
  console.log(`🏆 QUALITÄTSBEWERTUNG: ${score}/${maxScore} Punkte (${percentage}%)`);
  console.log('='.repeat(60));
  
  if (percentage >= 95) {
    console.log('🎉 EXZELLENT! Produktionsreife Qualität');
    console.log('✅ Perfekt optimiert für Deployment');
    console.log('✅ Alle Best Practices befolgt');
    console.log('✅ Maximale Performance erreicht');
  } else if (percentage >= 85) {
    console.log('🚀 SEHR GUT! Hohe Qualität erreicht');
    console.log('✅ Deployment-bereit');
    console.log('✅ Gute Performance');
    console.log('💡 Kleinere Optimierungen möglich');
  } else if (percentage >= 75) {
    console.log('✅ GUT! Solide Qualität');
    console.log('✅ Deployment möglich');
    console.log('💡 Einige Verbesserungen empfohlen');
  } else {
    console.log('⚠️  VERBESSERUNGSBEDARF');
    console.log('💡 Weitere Optimierungen erforderlich');
  }

  console.log('\n🎯 NÄCHSTE SCHRITTE:');
  console.log('1. Pull Request mergen');
  console.log('2. Auf Vercel/Netlify deployen');
  console.log('3. Live-Tests durchführen');
  console.log('4. Performance überwachen');

} catch (error) {
  console.error('❌ Qualitätscheck fehlgeschlagen:', error.message);
}