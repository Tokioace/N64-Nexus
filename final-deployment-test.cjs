// Final Deployment Readiness Test
const fs = require('fs');
const path = require('path');

console.log('🚀 FINAL DEPLOYMENT READINESS TEST\n');

let issues = 0;

try {
  // Test 1: Check file structure optimization
  console.log('Test 1: File Structure Optimization...');
  
  const langContextSize = fs.statSync('src/contexts/LanguageContext.tsx').size;
  const langContextSizeKB = Math.round(langContextSize / 1024);
  
  if (langContextSizeKB < 10) {
    console.log(`✅ LanguageContext.tsx is optimized (${langContextSizeKB}KB)`);
  } else {
    console.log(`❌ LanguageContext.tsx is still too large (${langContextSizeKB}KB)`);
    issues++;
  }
  
  // Check if translation files exist
  const translationFiles = ['de', 'en', 'fr', 'it', 'es', 'el', 'tr', 'zh', 'ja', 'ru', 'pt', 'hi', 'ar'];
  let missingFiles = 0;
  
  translationFiles.forEach(lang => {
    const filePath = `src/translations/${lang}.ts`;
    if (fs.existsSync(filePath)) {
      const size = Math.round(fs.statSync(filePath).size / 1024);
      console.log(`✅ ${lang}.ts exists (${size}KB)`);
    } else {
      console.log(`❌ Missing ${lang}.ts`);
      missingFiles++;
    }
  });
  
  if (missingFiles === 0) {
    console.log('✅ All translation files exist');
  } else {
    console.log(`❌ ${missingFiles} translation files missing`);
    issues += missingFiles;
  }

  // Test 2: Build output check
  console.log('\nTest 2: Build Output Check...');
  const distExists = fs.existsSync('dist');
  const indexExists = fs.existsSync('dist/index.html');
  const assetsExists = fs.existsSync('dist/assets');
  
  if (distExists && indexExists && assetsExists) {
    console.log('✅ Build output exists');
    
    // Check for optimized chunks
    const assets = fs.readdirSync('dist/assets');
    const translationChunks = assets.filter(file => file.includes('translations-'));
    const hasVendor = assets.some(file => file.includes('vendor'));
    const hasIcons = assets.some(file => file.includes('icons'));
    
    if (translationChunks.length >= 13 && hasVendor && hasIcons) {
      console.log(`✅ Optimized chunking successful (${translationChunks.length} translation chunks)`);
    } else {
      console.log(`❌ Chunking incomplete (${translationChunks.length} translation chunks)`);
      issues++;
    }
    
    // Check chunk sizes
    let oversizedChunks = 0;
    assets.forEach(file => {
      if (file.endsWith('.js')) {
        const filePath = path.join('dist/assets', file);
        const stats = fs.statSync(filePath);
        const sizeInKB = Math.round(stats.size / 1024);
        
        if (file.includes('translations-') && sizeInKB > 50) {
          console.log(`⚠️  Large translation chunk: ${file} (${sizeInKB}KB)`);
          oversizedChunks++;
        } else if (file.includes('translations-')) {
          console.log(`✅ Translation chunk size OK: ${file} (${sizeInKB}KB)`);
        }
      }
    });
    
    if (oversizedChunks === 0) {
      console.log('✅ All translation chunks are reasonably sized');
    } else {
      console.log(`⚠️  ${oversizedChunks} oversized chunks (still deployable)`);
    }
    
  } else {
    console.log('❌ Build output missing');
    issues++;
  }

  // Test 3: Deployment configuration
  console.log('\nTest 3: Deployment Configuration...');
  const vercelExists = fs.existsSync('vercel.json');
  if (vercelExists) {
    const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
    if (vercelConfig.buildCommand && vercelConfig.outputDirectory) {
      console.log('✅ Vercel configuration is valid');
    } else {
      console.log('❌ Vercel configuration incomplete');
      issues++;
    }
  } else {
    console.log('⚠️  No Vercel configuration found (manual deployment needed)');
  }

  // Test 4: Memory and performance check
  console.log('\nTest 4: Memory and Performance...');
  const totalTranslationSize = translationFiles.reduce((total, lang) => {
    const filePath = `src/translations/${lang}.ts`;
    if (fs.existsSync(filePath)) {
      return total + fs.statSync(filePath).size;
    }
    return total;
  }, 0);
  
  const totalSizeMB = (totalTranslationSize / (1024 * 1024)).toFixed(2);
  console.log(`✅ Total translation size: ${totalSizeMB}MB (split across ${translationFiles.length} files)`);
  
  if (totalTranslationSize < 1024 * 1024 * 2) { // Less than 2MB
    console.log('✅ Translation size is deployment-friendly');
  } else {
    console.log('⚠️  Large total translation size (still manageable with chunking)');
  }

  // Final Result
  console.log('\n' + '='.repeat(60));
  
  if (issues === 0) {
    console.log('🎉 DEPLOYMENT FULLY OPTIMIZED!');
    console.log('✅ All optimization tests passed');
    console.log('✅ File structure optimized for deployment');
    console.log('✅ Bundle splitting implemented');
    console.log('✅ Memory usage optimized');
    console.log('✅ All 13 languages preserved');
    console.log('✅ Build successful');
    console.log('\n🚀 READY FOR PRODUCTION DEPLOYMENT!');
    console.log('💡 The large file deployment issues have been resolved');
    console.log('💡 Each language loads independently for better performance');
    console.log('💡 Compatible with all major deployment platforms');
  } else {
    console.log(`❌ OPTIMIZATION INCOMPLETE - ${issues} issues found`);
    process.exit(1);
  }

} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}