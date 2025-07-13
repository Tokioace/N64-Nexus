const moment = require('moment');

// Seasonal Events Data
const seasonalEvents = [
  // 🌸 Frühling (März–Mai): „Pixelblüten-Cup"
  {
    name: "Pixelblüten-Cup",
    description: "Frühlingserwachen im Battle64! Sammle Blütenblätter und kämpfe dich durch blühende Strecken.",
    type: "season",
    season: "spring",
    startDate: moment().month(2).date(1).format('YYYY-MM-DD'), // March 1st
    endDate: moment().month(4).date(31).format('YYYY-MM-DD'), // May 31st
    duration: 92,
    theme: {
      primaryColor: "#FF69B4", // Pink
      secondaryColor: "#98FB98", // Pale green
      backgroundImage: "spring_flowers.png",
      uiElements: {
        buttons: "flower_petal_style",
        icons: "blooming_icons",
        backgrounds: "cherry_blossom"
      }
    },
    rewards: [
      {
        type: "profile_frame",
        name: "Blütenkranz",
        description: "Exklusiver Profilrahmen mit animierten Blütenblättern",
        rarity: "epic"
      },
      {
        type: "sticker",
        name: "Frühlingsblume",
        description: "Animierter Sticker mit blühenden Pixelblumen",
        rarity: "rare"
      },
      {
        type: "title",
        name: "Blütenjäger",
        description: "Titel für erfolgreiche Teilnahme am Pixelblüten-Cup",
        rarity: "common"
      },
      {
        type: "xp_bonus",
        name: "Frühlingsbonus",
        description: "+50% XP für alle Speedruns während der Saison",
        rarity: "common"
      }
    ],
    challenges: [
      {
        name: "Blütenpflücker",
        description: "Sammle 1000 Blütenblätter in Speedruns",
        reward: "Frühlingsblume Sticker",
        progress: 0,
        target: 1000
      },
      {
        name: "Schnellster Blütenjäger",
        description: "Erreiche die beste Zeit auf allen Frühlings-Strecken",
        reward: "Blütenkranz Profilrahmen",
        progress: 0,
        target: 1
      }
    ],
    maps: [
      "Cherry_Blossom_Raceway",
      "Tulip_Tunnel",
      "Daffodil_Dash",
      "Spring_Valley_Sprint"
    ],
    soundtrack: "spring_chip_tune.mp3"
  },

  // ☀️ Sommer (Juni–August): „Sommerrennen 64"
  {
    name: "Sommerrennen 64",
    description: "Heiße Rennen unter der Sommersonne! Kühle dich in tropischen Strecken ab.",
    type: "season",
    season: "summer",
    startDate: moment().month(5).date(1).format('YYYY-MM-DD'), // June 1st
    endDate: moment().month(7).date(31).format('YYYY-MM-DD'), // August 31st
    duration: 92,
    theme: {
      primaryColor: "#FFD700", // Gold
      secondaryColor: "#87CEEB", // Sky blue
      backgroundImage: "summer_beach.png",
      uiElements: {
        buttons: "beach_style",
        icons: "summer_icons",
        backgrounds: "tropical_paradise"
      }
    },
    rewards: [
      {
        type: "profile_frame",
        name: "Sonnenglanz",
        description: "Profilrahmen mit funkelnden Sonnenstrahlen",
        rarity: "epic"
      },
      {
        type: "sticker",
        name: "Sommerpalme",
        description: "Animierte Palme mit tropischen Effekten",
        rarity: "rare"
      },
      {
        type: "title",
        name: "Sommerchampion",
        description: "Titel für den Sommerrennen-Meister",
        rarity: "common"
      },
      {
        type: "collector_bonus",
        name: "Sommertausch",
        description: "Spezial-Tauschaktionen für Sommer-Spiele",
        rarity: "rare"
      }
    ],
    challenges: [
      {
        name: "Sonnensammler",
        description: "Sammle 500 Sonnenstrahlen in Rennen",
        reward: "Sommerpalme Sticker",
        progress: 0,
        target: 500
      },
      {
        name: "Tropischer Speedrunner",
        description: "Meistere alle tropischen Strecken",
        reward: "Sonnenglanz Profilrahmen",
        progress: 0,
        target: 1
      }
    ],
    maps: [
      "Tropical_Beach_Race",
      "Coconut_Coast",
      "Sunset_Island_Sprint",
      "Ocean_Breeze_Track"
    ],
    soundtrack: "summer_beach_tune.mp3"
  },

  // 🍂 Herbst (September–November): „Retro Harvest Run"
  {
    name: "Retro Harvest Run",
    description: "Erntezeit im Retro-Stil! Sammle goldene Blätter und kämpfe durch herbstliche Landschaften.",
    type: "season",
    season: "autumn",
    startDate: moment().month(8).date(1).format('YYYY-MM-DD'), // September 1st
    endDate: moment().month(10).date(30).format('YYYY-MM-DD'), // November 30th
    duration: 91,
    theme: {
      primaryColor: "#FF8C00", // Dark orange
      secondaryColor: "#8B4513", // Saddle brown
      backgroundImage: "autumn_forest.png",
      uiElements: {
        buttons: "fall_style",
        icons: "autumn_icons",
        backgrounds: "golden_forest"
      }
    },
    rewards: [
      {
        type: "profile_frame",
        name: "Herbstkranz",
        description: "Profilrahmen mit fallenden Herbstblättern",
        rarity: "epic"
      },
      {
        type: "sticker",
        name: "Goldenes Blatt",
        description: "Animiertes Herbstblatt mit goldenem Glanz",
        rarity: "rare"
      },
      {
        type: "title",
        name: "Harvest Hero",
        description: "Titel für den Herbst-Erntemeister",
        rarity: "common"
      },
      {
        type: "xp_bonus",
        name: "Herbstbonus",
        description: "+75% XP für Herbst-Strecken",
        rarity: "rare"
      }
    ],
    challenges: [
      {
        name: "Blättersammler",
        description: "Sammle 750 goldene Herbstblätter",
        reward: "Goldenes Blatt Sticker",
        progress: 0,
        target: 750
      },
      {
        name: "Herbstmeister",
        description: "Erreiche die besten Zeiten auf allen Herbst-Strecken",
        reward: "Herbstkranz Profilrahmen",
        progress: 0,
        target: 1
      }
    ],
    maps: [
      "Golden_Forest_Race",
      "Maple_Leaf_Trail",
      "Harvest_Valley_Sprint",
      "Autumn_Breeze_Track"
    ],
    soundtrack: "autumn_harvest_tune.mp3"
  },

  // ❄️ Winter (Dezember–Februar): „64 Ice Trophy"
  {
    name: "64 Ice Trophy",
    description: "Eisige Herausforderungen warten! Glitte über gefrorene Strecken und sammle Schneeflocken.",
    type: "season",
    season: "winter",
    startDate: moment().month(11).date(1).format('YYYY-MM-DD'), // December 1st
    endDate: moment().add(1, 'year').month(1).date(28).format('YYYY-MM-DD'), // February 28th
    duration: 90,
    theme: {
      primaryColor: "#87CEEB", // Sky blue
      secondaryColor: "#FFFFFF", // White
      backgroundImage: "winter_snow.png",
      uiElements: {
        buttons: "ice_style",
        icons: "winter_icons",
        backgrounds: "frozen_landscape"
      }
    },
    rewards: [
      {
        type: "profile_frame",
        name: "Snow Glow",
        description: "Profilrahmen mit funkelnden Schneeflocken",
        rarity: "epic"
      },
      {
        type: "sticker",
        name: "Eiskristall",
        description: "Animierter Eiskristall mit Glitzereffekten",
        rarity: "rare"
      },
      {
        type: "title",
        name: "Eiskönig",
        description: "Titel für den Winter-Trophäenmeister",
        rarity: "common"
      },
      {
        type: "collector_bonus",
        name: "Wintertausch",
        description: "Spezial-Tauschaktionen für Winter-Spiele",
        rarity: "rare"
      }
    ],
    challenges: [
      {
        name: "Schneeflockensammler",
        description: "Sammle 1000 Schneeflocken in Eisrennen",
        reward: "Eiskristall Sticker",
        progress: 0,
        target: 1000
      },
      {
        name: "Eismeister",
        description: "Meistere alle Eis-Strecken",
        reward: "Snow Glow Profilrahmen",
        progress: 0,
        target: 1
      }
    ],
    maps: [
      "Frozen_Lake_Race",
      "Ice_Crystal_Trail",
      "Snow_Mountain_Sprint",
      "Winter_Wonderland_Track"
    ],
    soundtrack: "winter_ice_tune.mp3"
  }
];

// Holiday Events
const holidayEvents = [
  // 🎃 Halloween: „Haunted Kart Challenge"
  {
    name: "Haunted Kart Challenge",
    description: "Gruselige Rennen durch gespenstische Strecken! Sammle Geister und meistere die Schrecken.",
    type: "holiday",
    holiday: "halloween",
    startDate: moment().month(9).date(25).format('YYYY-MM-DD'), // October 25th
    endDate: moment().month(9).date(31).format('YYYY-MM-DD'), // October 31st
    duration: 7,
    theme: {
      primaryColor: "#FF8C00", // Dark orange
      secondaryColor: "#800080", // Purple
      backgroundImage: "haunted_mansion.png",
      uiElements: {
        buttons: "spooky_style",
        icons: "ghost_icons",
        backgrounds: "haunted_forest"
      }
    },
    rewards: [
      {
        type: "profile_frame",
        name: "Pumpkin Aura",
        description: "Profilrahmen mit gruseligen Kürbiseffekten",
        rarity: "epic"
      },
      {
        type: "sticker",
        name: "Geisterjäger",
        description: "Animierter Geistersticker",
        rarity: "rare"
      },
      {
        type: "title",
        name: "Glitch-o-Lantern",
        description: "Titel für Halloween-Meister",
        rarity: "common"
      }
    ],
    challenges: [
      {
        name: "Geistersammler",
        description: "Fange 100 Geister in gruseligen Rennen",
        reward: "Geisterjäger Sticker",
        progress: 0,
        target: 100
      },
      {
        name: "Gruselmeister",
        description: "Meistere alle Halloween-Strecken",
        reward: "Pumpkin Aura Profilrahmen",
        progress: 0,
        target: 1
      }
    ],
    maps: [
      "Banshee_Boardwalk",
      "Haunted_Mansion_Race",
      "Ghost_Forest_Trail",
      "Spooky_Castle_Sprint"
    ],
    soundtrack: "halloween_spooky_tune.mp3"
  },

  // 🎄 Weihnachten: „Frost Cup" mit Ice Maps
  {
    name: "Frost Cup",
    description: "Weihnachtliche Eiskönigschaft! Rutsche über gefrorene Strecken und sammle Geschenke.",
    type: "holiday",
    holiday: "christmas",
    startDate: moment().month(11).date(20).format('YYYY-MM-DD'), // December 20th
    endDate: moment().month(11).date(26).format('YYYY-MM-DD'), // December 26th
    duration: 7,
    theme: {
      primaryColor: "#FF0000", // Red
      secondaryColor: "#228B22", // Forest green
      backgroundImage: "christmas_village.png",
      uiElements: {
        buttons: "christmas_style",
        icons: "holiday_icons",
        backgrounds: "winter_wonderland"
      }
    },
    rewards: [
      {
        type: "profile_frame",
        name: "Weihnachtsglanz",
        description: "Profilrahmen mit funkelnden Weihnachtslichtern",
        rarity: "epic"
      },
      {
        type: "sticker",
        name: "Weihnachtsstern",
        description: "Animierter Weihnachtsstern",
        rarity: "rare"
      },
      {
        type: "title",
        name: "Frost Champion",
        description: "Titel für den Frost Cup Sieger",
        rarity: "common"
      }
    ],
    challenges: [
      {
        name: "Geschenkesammler",
        description: "Sammle 50 Weihnachtsgeschenke",
        reward: "Weihnachtsstern Sticker",
        progress: 0,
        target: 50
      },
      {
        name: "Eiskönig",
        description: "Meistere alle Frost Cup Strecken",
        reward: "Weihnachtsglanz Profilrahmen",
        progress: 0,
        target: 1
      }
    ],
    maps: [
      "Christmas_Village_Race",
      "Frozen_Lake_Sprint",
      "Snow_Valley_Trail",
      "Ice_Crystal_Track"
    ],
    soundtrack: "christmas_jingle_tune.mp3"
  },

  // 🎆 Neujahr: „Time Attack of the Year"
  {
    name: "Time Attack of the Year",
    description: "Starte das neue Jahr mit explosiven Speedruns! Jede Sekunde zählt im Jahreswechsel.",
    type: "holiday",
    holiday: "newyear",
    startDate: moment().month(11).date(30).format('YYYY-MM-DD'), // December 30th
    endDate: moment().add(1, 'year').month(0).date(2).format('YYYY-MM-DD'), // January 2nd
    duration: 4,
    theme: {
      primaryColor: "#FFD700", // Gold
      secondaryColor: "#FF69B4", // Hot pink
      backgroundImage: "new_year_fireworks.png",
      uiElements: {
        buttons: "celebration_style",
        icons: "firework_icons",
        backgrounds: "midnight_sky"
      }
    },
    rewards: [
      {
        type: "profile_frame",
        name: "Jahreswechsel",
        description: "Profilrahmen mit Feuerwerks-Effekten",
        rarity: "epic"
      },
      {
        type: "sticker",
        name: "Feuerwerk",
        description: "Animiertes Feuerwerk",
        rarity: "rare"
      },
      {
        type: "title",
        name: "Zeitmeister",
        description: "Titel für den schnellsten Jahreswechsel",
        rarity: "common"
      }
    ],
    challenges: [
      {
        name: "Sekundenjäger",
        description: "Sammle 1000 Sekunden in Speedruns",
        reward: "Feuerwerk Sticker",
        progress: 0,
        target: 1000
      },
      {
        name: "Jahresbester",
        description: "Erreiche die beste Zeit des Jahres",
        reward: "Jahreswechsel Profilrahmen",
        progress: 0,
        target: 1
      }
    ],
    maps: [
      "Midnight_Raceway",
      "Firework_Festival_Track",
      "Countdown_Sprint",
      "New_Year_Dash"
    ],
    soundtrack: "new_year_countdown_tune.mp3"
  },

  // ❤️ Valentinstag: „Duell der Herzen" (Team-Speedruns)
  {
    name: "Duell der Herzen",
    description: "Liebe ist in der Luft! Kämpfe in romantischen Team-Speedruns um die Herzen.",
    type: "holiday",
    holiday: "valentine",
    startDate: moment().month(1).date(12).format('YYYY-MM-DD'), // February 12th
    endDate: moment().month(1).date(14).format('YYYY-MM-DD'), // February 14th
    duration: 3,
    theme: {
      primaryColor: "#FF69B4", // Hot pink
      secondaryColor: "#FF1493", // Deep pink
      backgroundImage: "valentine_garden.png",
      uiElements: {
        buttons: "romantic_style",
        icons: "heart_icons",
        backgrounds: "rose_garden"
      }
    },
    rewards: [
      {
        type: "profile_frame",
        name: "Herzensglanz",
        description: "Profilrahmen mit schwebenden Herzen",
        rarity: "epic"
      },
      {
        type: "sticker",
        name: "Liebesherz",
        description: "Animiertes Herz mit Glitzereffekten",
        rarity: "rare"
      },
      {
        type: "title",
        name: "Valentine Runner",
        description: "Titel für romantische Speedrunner",
        rarity: "common"
      }
    ],
    challenges: [
      {
        name: "Herzensammler",
        description: "Sammle 500 Herzen in Team-Rennen",
        reward: "Liebesherz Sticker",
        progress: 0,
        target: 500
      },
      {
        name: "Liebesmeister",
        description: "Gewinne 10 Team-Duelle",
        reward: "Herzensglanz Profilrahmen",
        progress: 0,
        target: 10
      }
    ],
    maps: [
      "Rose_Garden_Race",
      "Heart_Valley_Sprint",
      "Love_Lane_Trail",
      "Cupid_Arrow_Track"
    ],
    soundtrack: "valentine_romance_tune.mp3"
  },

  // 📅 N64-Anniversary: „Retro All-Star Cup"
  {
    name: "Retro All-Star Cup",
    description: "Feiere die N64-Ära! Klassische Strecken und nostalgische Herausforderungen.",
    type: "holiday",
    holiday: "n64anniversary",
    startDate: moment().month(5).date(23).format('YYYY-MM-DD'), // June 23rd (N64 release date)
    endDate: moment().month(5).date(29).format('YYYY-MM-DD'), // June 29th
    duration: 7,
    theme: {
      primaryColor: "#4169E1", // Royal blue
      secondaryColor: "#FFD700", // Gold
      backgroundImage: "retro_n64.png",
      uiElements: {
        buttons: "retro_style",
        icons: "classic_icons",
        backgrounds: "nostalgic_era"
      }
    },
    rewards: [
      {
        type: "profile_frame",
        name: "Retro All-Star",
        description: "Profilrahmen mit klassischen N64-Elementen",
        rarity: "legendary"
      },
      {
        type: "sticker",
        name: "N64 Logo",
        description: "Animiertes N64-Logo",
        rarity: "epic"
      },
      {
        type: "title",
        name: "Retro Champion",
        description: "Titel für N64-Ära Meister",
        rarity: "rare"
      }
    ],
    challenges: [
      {
        name: "Klassiker-Sammler",
        description: "Spiele alle klassischen N64-Strecken",
        reward: "N64 Logo Sticker",
        progress: 0,
        target: 1
      },
      {
        name: "All-Star",
        description: "Erreiche die besten Zeiten auf allen Retro-Strecken",
        reward: "Retro All-Star Profilrahmen",
        progress: 0,
        target: 1
      }
    ],
    maps: [
      "Mario_Kart_64_Classic",
      "GoldenEye_007_Race",
      "Banjo_Kazooie_Trail",
      "Zelda_OoT_Sprint"
    ],
    soundtrack: "retro_n64_classic_tune.mp3"
  }
];

module.exports = {
  seasonalEvents,
  holidayEvents,
  allEvents: [...seasonalEvents, ...holidayEvents]
};