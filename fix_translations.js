const fs = require('fs');

console.log('Starting translation fixes...');

// Read the language context file
let content = fs.readFileSync('src/contexts/LanguageContext.tsx', 'utf8');

// Fix Turkish leaderboard placeholders
content = content.replace(/'leaderboard\.filterType': 'Leaderboard Filtertype'/g, "'leaderboard.filterType': 'Filtre Tipi'");
content = content.replace(/'leaderboard\.timeframe': 'Leaderboard Timeframe'/g, "'leaderboard.timeframe': 'Zaman Dilimi'");
content = content.replace(/'leaderboard\.globalLeaderboard': 'Leaderboard Globalleaderboard'/g, "'leaderboard.globalLeaderboard': 'Global N64 Fan Lider Tablosu'");
content = content.replace(/'leaderboard\.seasonLeaderboard': 'Leaderboard Seasonleaderboard'/g, "'leaderboard.seasonLeaderboard': 'Sezon Lider Tablosu'");

// Add missing leaderboard filter options for Turkish
content = content.replace(
  /'leaderboard\.timeframe': 'Zaman Dilimi',/g,
  `'leaderboard.timeframe': 'Zaman Dilimi',
    'leaderboard.filterGlobal': 'Global',
    'leaderboard.filterFriends': 'Arkadaşlar',
    'leaderboard.filterRegion': 'Bölge',
    'leaderboard.timeframeAllTime': 'Tüm Zamanlar',
    'leaderboard.timeframeSeason': 'Sezon',
    'leaderboard.timeframeMonth': 'Ay',
    'leaderboard.regionPlatform': 'Bölge/Platform',`
);

// Fix Chinese placeholders
content = content.replace(/'leaderboard\.filterType': 'Leaderboard Filtertype'/g, "'leaderboard.filterType': '筛选类型'");
content = content.replace(/'leaderboard\.timeframe': 'Leaderboard Timeframe'/g, "'leaderboard.timeframe': '时间范围'");

// Fix Japanese placeholders  
content = content.replace(/'leaderboard\.filterType': 'Leaderboard Filtertype'/g, "'leaderboard.filterType': 'フィルタータイプ'");
content = content.replace(/'leaderboard\.timeframe': 'Leaderboard Timeframe'/g, "'leaderboard.timeframe': '期間'");

// Fix Russian placeholders
content = content.replace(/'leaderboard\.filterType': 'Leaderboard Filtertype'/g, "'leaderboard.filterType': 'Тип фильтра'");
content = content.replace(/'leaderboard\.timeframe': 'Leaderboard Timeframe'/g, "'leaderboard.timeframe': 'Временные рамки'");

// Write the fixed content back
fs.writeFileSync('src/contexts/LanguageContext.tsx', content);
console.log('Translation fixes applied successfully!');