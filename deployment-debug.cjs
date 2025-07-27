// Comprehensive Deployment Debug Script
const fs = require('fs');
const path = require('path');

console.log('🔍 DEPLOYMENT DEBUGGING ANALYSIS\n');

let issues = [];
let warnings = [];

try {
  // Check 1: File extensions and imports
  console.log('1. Checking import/export issues...');
  
  function checkImports(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        checkImports(filePath);
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Check for explicit .tsx/.ts imports
        const explicitImports = content.match(/import.*from.*['"].*\.(tsx?|jsx?)['"]$/gm);
        if (explicitImports) {
          explicitImports.forEach(imp => {
            warnings.push(`${filePath}: ${imp}`);
          });
        }
        
        // Check for missing exports
        if (file.endsWith('.tsx') && !content.includes('export')) {
          warnings.push(`${filePath}: No exports found`);
        }
      }
    });
  }
  
  checkImports('src');
  
  if (warnings.length === 0) {
    console.log('✅ No import/export issues found');
  } else {
    console.log(`⚠️  Found ${warnings.length} import warnings`);
    warnings.slice(0, 5).forEach(w => console.log(`   ${w}`));
  }

  // Check 2: Memory usage and file sizes
  console.log('\n2. Checking memory and file size issues...');
  
  function checkFileSize(dir, prefix = '') {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        checkFileSize(filePath, prefix + file + '/');
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        const sizeKB = Math.round(stat.size / 1024);
        if (sizeKB > 100) {
          warnings.push(`Large file: ${prefix}${file} (${sizeKB}KB)`);
        }
      }
    });
  }
  
  checkFileSize('src');
  
  // Check 3: Build output analysis
  console.log('\n3. Analyzing build output...');
  
  if (fs.existsSync('dist')) {
    const assets = fs.readdirSync('dist/assets');
    let totalSize = 0;
    let largeChunks = 0;
    
    assets.forEach(file => {
      if (file.endsWith('.js')) {
        const filePath = path.join('dist/assets', file);
        const stats = fs.statSync(filePath);
        const sizeKB = Math.round(stats.size / 1024);
        totalSize += sizeKB;
        
        if (sizeKB > 500) {
          issues.push(`Very large chunk: ${file} (${sizeKB}KB)`);
          largeChunks++;
        } else if (sizeKB > 200) {
          warnings.push(`Large chunk: ${file} (${sizeKB}KB)`);
        }
      }
    });
    
    console.log(`✅ Total JS size: ${totalSize}KB`);
    if (largeChunks === 0) {
      console.log('✅ No oversized chunks');
    } else {
      console.log(`❌ ${largeChunks} oversized chunks found`);
    }
  } else {
    issues.push('Build output directory missing');
  }

  // Check 4: Dependencies analysis
  console.log('\n4. Checking dependencies...');
  
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  // Check for peer dependency issues
  const deps = {...packageJson.dependencies, ...packageJson.devDependencies};
  
  // Common problematic versions
  const problematicDeps = {
    'react': '^18.2.0',
    'react-dom': '^18.2.0',
    'typescript': '^5.8.3',
    'vite': '^4.4.5'
  };
  
  Object.entries(problematicDeps).forEach(([dep, expectedVersion]) => {
    if (deps[dep] && deps[dep] !== expectedVersion) {
      warnings.push(`${dep} version mismatch: ${deps[dep]} (expected ${expectedVersion})`);
    }
  });
  
  if (!packageJson.engines) {
    warnings.push('Missing engines field in package.json');
  }
  
  console.log('✅ Dependencies checked');

  // Check 5: Configuration files
  console.log('\n5. Checking configuration files...');
  
  const configFiles = [
    'vite.config.ts',
    'tsconfig.json', 
    'vercel.json',
    'tailwind.config.js'
  ];
  
  configFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file} exists`);
    } else {
      warnings.push(`Missing ${file}`);
    }
  });

  // Check 6: Runtime issues
  console.log('\n6. Checking for potential runtime issues...');
  
  // Check for localStorage usage (SSR issues)
  function checkSSRIssues(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        checkSSRIssues(filePath);
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Check for direct localStorage usage without guards
        if (content.includes('localStorage') && !content.includes('typeof window')) {
          warnings.push(`${filePath}: Potential SSR issue with localStorage`);
        }
        
        // Check for document usage without guards
        if (content.includes('document.') && !content.includes('typeof document')) {
          warnings.push(`${filePath}: Potential SSR issue with document`);
        }
      }
    });
  }
  
  checkSSRIssues('src');
  
  console.log('✅ Runtime checks completed');

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('🔍 DEPLOYMENT DEBUG SUMMARY');
  console.log('='.repeat(60));
  
  if (issues.length === 0 && warnings.length === 0) {
    console.log('🎉 NO DEPLOYMENT ISSUES DETECTED!');
    console.log('✅ All checks passed');
    console.log('✅ Build is deployment-ready');
    console.log('\n💡 If deployment still fails, the issue might be:');
    console.log('   - Platform-specific configuration');
    console.log('   - Network/timeout issues');
    console.log('   - Environment variables');
    console.log('   - Platform resource limits');
  } else {
    if (issues.length > 0) {
      console.log(`❌ CRITICAL ISSUES (${issues.length}):`);
      issues.forEach(issue => console.log(`   ${issue}`));
    }
    
    if (warnings.length > 0) {
      console.log(`⚠️  WARNINGS (${warnings.length}):`);
      warnings.slice(0, 10).forEach(warning => console.log(`   ${warning}`));
      if (warnings.length > 10) {
        console.log(`   ... and ${warnings.length - 10} more warnings`);
      }
    }
  }

} catch (error) {
  console.error('❌ Debug script failed:', error.message);
}