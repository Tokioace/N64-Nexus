const fs = require('fs');

// Read the language file
let content = fs.readFileSync('src/contexts/LanguageContext.tsx', 'utf8');

console.log('Fixing unterminated string literals...');

// Find and fix common patterns of unterminated strings
const fixes = [
  // Fix "yesterday'" -> "yesterday\'"
  {
    search: /('news\.speedrunEventContent':\s*'[^']*yesterday)'/g,
    replace: "$1\\'"
  },
  // Fix "haven'" -> "haven\'"
  {
    search: /('media\.noUploadsDesc':\s*'[^']*haven)'/g,
    replace: "$1\\'"
  },
  // Fix "Don'" -> "Don\'"
  {
    search: /('events\.notificationPrompt':\s*'[^']*Don)'/g,
    replace: "$1\\'"
  },
  // Fix other common contractions
  {
    search: /('forum\.thread\.toadStrategy':\s*'[^']*Toad)(\\'s)/g,
    replace: "$1\\'s"
  },
  {
    search: /('forum\.post\.toadContent':\s*'[^']*Toad)(\\'s)/g,
    replace: "$1\\'s"
  },
  {
    search: /('events\.luigiEvent':\s*'[^']*Luigi)(\\'s)/g,
    replace: "$1\\'s"
  },
  {
    search: /('events\.luigiEventDesc':\s*'[^']*Luigi)(\\'s)/g,
    replace: "$1\\'s"
  },
  {
    search: /('events\.rule\.luigiRaceway':\s*'[^']*Luigi)(\\'s)/g,
    replace: "$1\\'s"
  },
  {
    search: /('events\.prize\.luigiFirst':\s*'[^']*Luigi)(\\'s)/g,
    replace: "$1\\'s"
  },
  {
    search: /('events\.prize\.luigiTop10':\s*'[^']*Luigi)(\\'s)/g,
    replace: "$1\\'s"
  },
  {
    search: /('events\.prize\.luigiParticipant':\s*'[^']*Luigi)(\\'s)/g,
    replace: "$1\\'s"
  },
  {
    search: /('news\.luigiEvent':\s*'[^']*Luigi)(\\'s)/g,
    replace: "$1\\'s"
  },
  {
    search: /('news\.luigiEventContent':\s*'[^']*Luigi)(\\'s)/g,
    replace: "$1\\'s"
  }
];

// Apply fixes
fixes.forEach((fix, index) => {
  const beforeLength = content.length;
  content = content.replace(fix.search, fix.replace);
  const afterLength = content.length;
  if (beforeLength !== afterLength) {
    console.log(`Applied fix ${index + 1}: String length changed by ${afterLength - beforeLength}`);
  }
});

// More targeted fixes for the specific error lines
const specificFixes = [
  // Line 1173: 'news.speedrunEventContent': 'Incredible performances at yesterday',
  {
    search: /'news\.speedrunEventContent':\s*'Incredible performances at yesterday',/g,
    replace: "'news.speedrunEventContent': 'Incredible performances at yesterday\\'s event!',"
  },
  // Line 1347: 'media.noUploadsDesc': 'You haven',
  {
    search: /'media\.noUploadsDesc':\s*'You haven',/g,
    replace: "'media.noUploadsDesc': 'You haven\\'t uploaded any media yet.',"
  },
  // Line 1502: 'events.notificationPrompt': 'Don',
  {
    search: /'events\.notificationPrompt':\s*'Don',/g,
    replace: "'events.notificationPrompt': 'Don\\'t miss out on events!',"
  }
];

specificFixes.forEach((fix, index) => {
  const beforeLength = content.length;
  content = content.replace(fix.search, fix.replace);
  const afterLength = content.length;
  if (beforeLength !== afterLength) {
    console.log(`Applied specific fix ${index + 1}: String length changed by ${afterLength - beforeLength}`);
  }
});

// Find any remaining unterminated strings (basic pattern)
const unteriminatedPattern = /'[^']*':\s*'[^']*'(?!,|\s*$)/g;
let match;
let lineNumber = 1;
const lines = content.split('\n');

console.log('\nChecking for remaining unterminated strings...');
lines.forEach((line, index) => {
  // Look for patterns like 'key': 'value without closing quote
  if (line.includes("': '") && !line.includes("',") && !line.includes("'$") && line.trim() !== '') {
    // Check if it's a translation line that doesn't end properly
    const translationMatch = line.match(/'[^']+'\s*:\s*'[^']*$/);
    if (translationMatch) {
      console.log(`Potential unterminated string at line ${index + 1}: ${line.trim()}`);
    }
  }
});

// Write the fixed content back
fs.writeFileSync('src/contexts/LanguageContext.tsx', content);

console.log('\n✅ Fixed unterminated string literals!');
console.log('✅ File has been updated with proper escaping.');