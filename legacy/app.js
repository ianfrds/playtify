// Playtify - YouTube-powered music streaming app
// Uses YouTube IFrame Player for playback and Piped / Invidious API for search and recommendations

(function () {
  'use strict';

  // ─── Curated & Verified YouTube Recommendations ─────────────
  const RECOMMENDATIONS_DATA = {
  "top_indo": [
    {
      "id": "E7kHvjvU6JY",
      "title": "Hati-Hati di Jalan",
      "artist": "Tulus",
      "duration": 242,
      "thumb": "https://i.ytimg.com/vi/E7kHvjvU6JY/hqdefault.jpg"
    },
    {
      "id": "z-XHpftdXEE",
      "title": "Satu Bulan",
      "artist": "Bernadya",
      "duration": 201,
      "thumb": "https://i.ytimg.com/vi/z-XHpftdXEE/hqdefault.jpg"
    },
    {
      "id": "2MyjWg7P00A",
      "title": "Sial",
      "artist": "Mahalini",
      "duration": 244,
      "thumb": "https://i.ytimg.com/vi/2MyjWg7P00A/hqdefault.jpg"
    },
    {
      "id": "M4YpWWj_IWs",
      "title": "Lantas",
      "artist": "Juicy Luicy",
      "duration": 235,
      "thumb": "https://i.ytimg.com/vi/M4YpWWj_IWs/hqdefault.jpg"
    },
    {
      "id": "lABZ_-uhC0E",
      "title": "Gala bunga matahari",
      "artist": "Sal Priadi",
      "duration": 210,
      "thumb": "https://i.ytimg.com/vi/lABZ_-uhC0E/hqdefault.jpg"
    },
    {
      "id": "g6iIVyRfiUk",
      "title": "penjaga hati",
      "artist": "Nadhif Basalamah",
      "duration": 261,
      "thumb": "https://i.ytimg.com/vi/g6iIVyRfiUk/hqdefault.jpg"
    },
    {
      "id": "IR7tYHdYN2Q",
      "title": "To the Bone",
      "artist": "Pamungkas",
      "duration": 345,
      "thumb": "https://i.ytimg.com/vi/IR7tYHdYN2Q/hqdefault.jpg"
    },
    {
      "id": "2A9Atl2hUkg",
      "title": "Rayuan Perempuan Gila",
      "artist": "Nadin Amizah",
      "duration": 320,
      "thumb": "https://i.ytimg.com/vi/2A9Atl2hUkg/hqdefault.jpg"
    },
    {
      "id": "_BJpBN9ZReQ",
      "title": "Evaluasi",
      "artist": "Hindia",
      "duration": 197,
      "thumb": "https://i.ytimg.com/vi/_BJpBN9ZReQ/hqdefault.jpg"
    },
    {
      "id": "BoESHbOq_s8",
      "title": "Rumah Singgah",
      "artist": "Fabio Asher",
      "duration": 247,
      "thumb": "https://i.ytimg.com/vi/BoESHbOq_s8/hqdefault.jpg"
    }
  ],
  "global_hits": [
    {
      "id": "WKZO-CWeOVA",
      "title": "BIRDS OF A FEATHER",
      "artist": "Billie Eilish",
      "duration": 211,
      "thumb": "https://i.ytimg.com/vi/WKZO-CWeOVA/hqdefault.jpg"
    },
    {
      "id": "J7p4bzqLvCw",
      "title": "Blinding Lights",
      "artist": "The Weeknd",
      "duration": 202,
      "thumb": "https://i.ytimg.com/vi/J7p4bzqLvCw/hqdefault.jpg"
    },
    {
      "id": "nujn6wbr-e8",
      "title": "As It Was",
      "artist": "Harry Styles",
      "duration": 168,
      "thumb": "https://i.ytimg.com/vi/nujn6wbr-e8/hqdefault.jpg"
    },
    {
      "id": "DlFXDl_ROAM",
      "title": "Die With A Smile",
      "artist": "Lady Gaga",
      "duration": 252,
      "thumb": "https://i.ytimg.com/vi/DlFXDl_ROAM/hqdefault.jpg"
    },
    {
      "id": "kIft-LUHHVA",
      "title": "Espresso",
      "artist": "Sabrina Carpenter",
      "duration": 176,
      "thumb": "https://i.ytimg.com/vi/kIft-LUHHVA/hqdefault.jpg"
    },
    {
      "id": "aC9HkZW2hZk",
      "title": "Cruel Summer",
      "artist": "Taylor Swift",
      "duration": 179,
      "thumb": "https://i.ytimg.com/vi/aC9HkZW2hZk/hqdefault.jpg"
    },
    {
      "id": "ALsvdSA9tOU",
      "title": "Viva La Vida",
      "artist": "Coldplay",
      "duration": 243,
      "thumb": "https://i.ytimg.com/vi/ALsvdSA9tOU/hqdefault.jpg"
    },
    {
      "id": "-IGBV35f3tk",
      "title": "Levitating",
      "artist": "Tatiana Kurecka",
      "duration": 199,
      "thumb": "https://i.ytimg.com/vi/-IGBV35f3tk/hqdefault.jpg"
    },
    {
      "id": "r7Rn4ryE_w8",
      "title": "Sunflower (Spider-Man: Into the Spider-Verse)",
      "artist": "Post Malone",
      "duration": 159,
      "thumb": "https://i.ytimg.com/vi/r7Rn4ryE_w8/hqdefault.jpg"
    }
  ],
  "chill_vibes": [
    {
      "id": "BRPaF-O-3rE",
      "title": "Akad",
      "artist": "Payung Teduh",
      "duration": 259,
      "thumb": "https://i.ytimg.com/vi/BRPaF-O-3rE/hqdefault.jpg"
    },
    {
      "id": "IeDt0xG59EQ",
      "title": "Zona Nyaman",
      "artist": "Fourtwnty",
      "duration": 260,
      "thumb": "https://i.ytimg.com/vi/IeDt0xG59EQ/hqdefault.jpg"
    },
    {
      "id": "EodKDRHKoxk",
      "title": "Ada Di Sana",
      "artist": "Danilla",
      "duration": 199,
      "thumb": "https://i.ytimg.com/vi/EodKDRHKoxk/hqdefault.jpg"
    },
    {
      "id": "DHsPUNFXxCM",
      "title": "bitterlove",
      "artist": "Ardhito Pramono",
      "duration": 217,
      "thumb": "https://i.ytimg.com/vi/DHsPUNFXxCM/hqdefault.jpg"
    },
    {
      "id": "1_uKdmr5R-Y",
      "title": "Berita Kehilangan (feat. Rayssa Dynta)",
      "artist": ".Feast",
      "duration": 260,
      "thumb": "https://i.ytimg.com/vi/1_uKdmr5R-Y/hqdefault.jpg"
    },
    {
      "id": "Ooq4BElSph8",
      "title": "Anything You Want",
      "artist": "Reality Club",
      "duration": 237,
      "thumb": "https://i.ytimg.com/vi/Ooq4BElSph8/hqdefault.jpg"
    },
    {
      "id": "M1Qbakkhkpw",
      "title": "Kita Bikin Romantis",
      "artist": "MALIQ & D'Essentials",
      "duration": 237,
      "thumb": "https://i.ytimg.com/vi/M1Qbakkhkpw/hqdefault.jpg"
    },
    {
      "id": "pqBeqZE_dpY",
      "title": "Rehat",
      "artist": "Kunto Aji",
      "duration": 355,
      "thumb": "https://i.ytimg.com/vi/pqBeqZE_dpY/hqdefault.jpg"
    }
  ],
  "lofi": [
    {
      "id": "kAw9xGI8vgk",
      "title": "3 Hours of Chill Lofi Music for DEEP Sleep or Study Session",
      "artist": "Lumosound",
      "duration": 11017,
      "thumb": "https://i.ytimg.com/vi/kAw9xGI8vgk/hqdefault.jpg"
    },
    {
      "id": "axupbYi6_5E",
      "title": "Blue Sun",
      "artist": "Vanilla",
      "duration": 226,
      "thumb": "https://i.ytimg.com/vi/axupbYi6_5E/hqdefault.jpg"
    },
    {
      "id": "BLeizR3YRiM",
      "title": "Zen Japanese Garden | LoFi Music | Japanese Vibes",
      "artist": "YourOtakuShop",
      "duration": 2231,
      "thumb": "https://i.ytimg.com/vi/BLeizR3YRiM/hqdefault.jpg"
    },
    {
      "id": "X1BakPUY9_M",
      "title": "Lofi Coffee Shop Radio",
      "artist": "Jazz Beats",
      "duration": 131,
      "thumb": "https://i.ytimg.com/vi/X1BakPUY9_M/hqdefault.jpg"
    },
    {
      "id": "1N8hOpMqvYs",
      "title": "Lofi Rain Chill Beats for Sleep, Study & Relax (1 Hour)",
      "artist": "Zyra Music",
      "duration": 5738,
      "thumb": "https://i.ytimg.com/vi/1N8hOpMqvYs/hqdefault.jpg"
    },
    {
      "id": "NNpLc8291rU",
      "title": "Cozy Quiet Twilight",
      "artist": "Lofi Beats",
      "duration": 90,
      "thumb": "https://i.ytimg.com/vi/NNpLc8291rU/hqdefault.jpg"
    }
  ],
  "kpop": [
    {
      "id": "0c7zGU2C2mM",
      "title": "Super Shy",
      "artist": "NewJeans",
      "duration": 155,
      "thumb": "https://i.ytimg.com/vi/0c7zGU2C2mM/hqdefault.jpg"
    },
    {
      "id": "HaEYUJ2aRHs",
      "title": "Dynamite",
      "artist": "BTS",
      "duration": 200,
      "thumb": "https://i.ytimg.com/vi/HaEYUJ2aRHs/hqdefault.jpg"
    },
    {
      "id": "4N15045PHEA",
      "title": "Pink Venom",
      "artist": "BLACKPINK",
      "duration": 187,
      "thumb": "https://i.ytimg.com/vi/4N15045PHEA/hqdefault.jpg"
    },
    {
      "id": "LCIs3JXb5Aw",
      "title": "Supernova",
      "artist": "aespa",
      "duration": 179,
      "thumb": "https://i.ytimg.com/vi/LCIs3JXb5Aw/hqdefault.jpg"
    },
    {
      "id": "iv7TrKrwteI",
      "title": "Cupid (Twin Version)",
      "artist": "FIFTY FIFTY",
      "duration": 175,
      "thumb": "https://i.ytimg.com/vi/iv7TrKrwteI/hqdefault.jpg"
    },
    {
      "id": "m9SMT5ipbxk",
      "title": "\u30a2\u30a4\u30c9\u30eb",
      "artist": "YOASOBI",
      "duration": 214,
      "thumb": "https://i.ytimg.com/vi/m9SMT5ipbxk/hqdefault.jpg"
    },
    {
      "id": "3zh9Wb1KuW8",
      "title": "\u6b7b\u306c\u306e\u304c\u3044\u3044\u308f - Shinunoga E-Wa",
      "artist": "Fujii Kaze",
      "duration": 186,
      "thumb": "https://i.ytimg.com/vi/3zh9Wb1KuW8/hqdefault.jpg"
    }
  ],
  "nostalgia": [
    {
      "id": "k1BfsO0mxWQ",
      "title": "Dan...",
      "artist": "Sheila On 7",
      "duration": 289,
      "thumb": "https://i.ytimg.com/vi/k1BfsO0mxWQ/hqdefault.jpg"
    },
    {
      "id": "YKK5_OQiEa4",
      "title": "Kangen",
      "artist": "Dewa 19",
      "duration": 304,
      "thumb": "https://i.ytimg.com/vi/YKK5_OQiEa4/hqdefault.jpg"
    },
    {
      "id": "j9ITOOStWNU",
      "title": "Semua Tentang Kita",
      "artist": "Peterpan",
      "duration": 266,
      "thumb": "https://i.ytimg.com/vi/j9ITOOStWNU/hqdefault.jpg"
    },
    {
      "id": "TNKhZzwZRLU",
      "title": "Kasih Tak Sampai",
      "artist": "Padi",
      "duration": 294,
      "thumb": "https://i.ytimg.com/vi/TNKhZzwZRLU/hqdefault.jpg"
    },
    {
      "id": "CIRSQrkhehM",
      "title": "Sempurna",
      "artist": "Andra And The Backbone",
      "duration": 269,
      "thumb": "https://i.ytimg.com/vi/CIRSQrkhehM/hqdefault.jpg"
    },
    {
      "id": "qpUIuxN4-Fo",
      "title": "Hampa",
      "artist": "Ari Lasso",
      "duration": 299,
      "thumb": "https://i.ytimg.com/vi/qpUIuxN4-Fo/hqdefault.jpg"
    },
    {
      "id": "Vjp424-pA6A",
      "title": "Risalah Hati",
      "artist": "Dewa",
      "duration": 293,
      "thumb": "https://i.ytimg.com/vi/Vjp424-pA6A/hqdefault.jpg"
    }
  ]
};

  // ─── Curated Spotify-Style Playlists ─────────────────────────
  const CURATED_PLAYLISTS = [
    {
      id: 'top-indo',
      name: 'Top Hits Indonesia 2026',
      desc: 'Lagu-lagu pop Indonesia paling banyak didengar, viral, dan trending saat ini.',
      cover: 'https://i.ytimg.com/vi/E7kHvjvU6JY/hqdefault.jpg',
      gradient: 'linear-gradient(135deg, #134e5e 0%, #121212 100%)',
      badge: 'POP INDONESIA',
      tracks: RECOMMENDATIONS_DATA.top_indo,
    },
    {
      id: 'global-hits',
      name: "Today's Top Hits Dunia",
      desc: 'Hits internasional paling populer di seluruh dunia minggu ini.',
      cover: 'https://i.ytimg.com/vi/WKZO-CWeOVA/hqdefault.jpg',
      gradient: 'linear-gradient(135deg, #4b1248 0%, #121212 100%)',
      badge: 'GLOBAL HITS',
      tracks: RECOMMENDATIONS_DATA.global_hits,
    },
    {
      id: 'chill-vibes',
      name: 'Santai & Akustik Sore',
      desc: 'Alunan musik akustik dan indie syahdu peneman senja, rehat, dan secangkir kopi.',
      cover: 'https://i.ytimg.com/vi/BRPaF-O-3rE/hqdefault.jpg',
      gradient: 'linear-gradient(135deg, #3a1c71 0%, #121212 100%)',
      badge: 'INDIE AKUSTIK',
      tracks: RECOMMENDATIONS_DATA.chill_vibes,
    },
    {
      id: 'lofi-beats',
      name: 'Lofi Beats & Deep Focus',
      desc: 'Ketukan instrumen lofi santai tanpa lirik untuk belajar, membaca, dan coding.',
      cover: 'https://i.ytimg.com/vi/kAw9xGI8vgk/hqdefault.jpg',
      gradient: 'linear-gradient(135deg, #1f1c2c 0%, #121212 100%)',
      badge: 'LOFI STUDY',
      tracks: RECOMMENDATIONS_DATA.lofi,
    },
    {
      id: 'kpop-hits',
      name: 'K-Pop & Asian Pop Superhits',
      desc: 'Irama energik dari musisi pop Korea dan Jepang terpopuler di tangga lagu.',
      cover: 'https://i.ytimg.com/vi/0c7zGU2C2mM/hqdefault.jpg',
      gradient: 'linear-gradient(135deg, #833ab4 0%, #121212 100%)',
      badge: 'K-POP SUPER',
      tracks: RECOMMENDATIONS_DATA.kpop,
    },
    {
      id: 'nostalgia-indo',
      name: 'Nostalgia Pop Rock Indonesia',
      desc: 'Deretan karya legendaris era 2000-an Sheila On 7, Dewa 19, Peterpan & Padi.',
      cover: 'https://i.ytimg.com/vi/k1BfsO0mxWQ/hqdefault.jpg',
      gradient: 'linear-gradient(135deg, #09203f 0%, #121212 100%)',
      badge: 'NOSTALGIA',
      tracks: RECOMMENDATIONS_DATA.nostalgia,
    },
    {
      id: 'muted-jazz',
      name: 'Coffee Shop & Muted Jazz',
      desc: 'Alunan piano dan jazz santai untuk suasana cafe yang hangat dan rileks.',
      cover: 'https://i.ytimg.com/vi/X1BakPUY9_M/hqdefault.jpg',
      gradient: 'linear-gradient(135deg, #2c3e50 0%, #121212 100%)',
      badge: 'JAZZ CAFE',
      tracks: [
        RECOMMENDATIONS_DATA.lofi[3],
        RECOMMENDATIONS_DATA.chill_vibes[3],
        RECOMMENDATIONS_DATA.chill_vibes[6],
        RECOMMENDATIONS_DATA.lofi[1],
        RECOMMENDATIONS_DATA.chill_vibes[1],
        RECOMMENDATIONS_DATA.chill_vibes[0],
      ].filter(Boolean),
    },
    {
      id: 'bedtime-piano',
      name: 'Bedtime Acoustic & Sleep',
      desc: 'Melodi lembut dan vokal menenangkan menjelang istirahat dan tidur lelap.',
      cover: 'https://i.ytimg.com/vi/1N8hOpMqvYs/hqdefault.jpg',
      gradient: 'linear-gradient(135deg, #1a102f 0%, #121212 100%)',
      badge: 'SLEEP PIANO',
      tracks: [
        RECOMMENDATIONS_DATA.lofi[4],
        RECOMMENDATIONS_DATA.chill_vibes[7],
        RECOMMENDATIONS_DATA.chill_vibes[2],
        RECOMMENDATIONS_DATA.top_indo[4],
        RECOMMENDATIONS_DATA.lofi[0],
        RECOMMENDATIONS_DATA.top_indo[1],
      ].filter(Boolean),
    },
  ];

  // ─── Browse Categories for Search View ───────────────────────
  const BROWSE_CATEGORIES = [
    { name: 'Pop Indonesia', gradient: 'linear-gradient(135deg, #006450, #1ed760)', thumb: 'https://i.ytimg.com/vi/E7kHvjvU6JY/hqdefault.jpg', playlistId: 'top-indo' },
    { name: 'Global Hits', gradient: 'linear-gradient(135deg, #e13300, #ff7a00)', thumb: 'https://i.ytimg.com/vi/WKZO-CWeOVA/hqdefault.jpg', playlistId: 'global-hits' },
    { name: 'Indie & Akustik', gradient: 'linear-gradient(135deg, #8400e7, #b05cff)', thumb: 'https://i.ytimg.com/vi/BRPaF-O-3rE/hqdefault.jpg', playlistId: 'chill-vibes' },
    { name: 'Lofi & Fokus', gradient: 'linear-gradient(135deg, #1e3264, #4880ff)', thumb: 'https://i.ytimg.com/vi/kAw9xGI8vgk/hqdefault.jpg', playlistId: 'lofi-beats' },
    { name: 'K-Pop Super', gradient: 'linear-gradient(135deg, #e91429, #ff5e7e)', thumb: 'https://i.ytimg.com/vi/0c7zGU2C2mM/hqdefault.jpg', playlistId: 'kpop-hits' },
    { name: 'Nostalgia Indo', gradient: 'linear-gradient(135deg, #503750, #966796)', thumb: 'https://i.ytimg.com/vi/k1BfsO0mxWQ/hqdefault.jpg', playlistId: 'nostalgia-indo' },
    { name: 'Muted Jazz', gradient: 'linear-gradient(135deg, #50371e, #8c6035)', thumb: 'https://i.ytimg.com/vi/X1BakPUY9_M/hqdefault.jpg', playlistId: 'muted-jazz' },
    { name: 'Sleep & Piano', gradient: 'linear-gradient(135deg, #141b41, #3066be)', thumb: 'https://i.ytimg.com/vi/1N8hOpMqvYs/hqdefault.jpg', playlistId: 'bedtime-piano' },
  ];

  // ─── Artist Database (Spotify-accurate Curated Profiles) ──────
  const ARTIST_DATABASE = {
    'billie eilish': {
      name: 'Billie Eilish',
      verified: true,
      monthlyListeners: '94.215.820',
      followers: '92.4M',
      rank: '#3 di Dunia',
      banner: 'https://i.ytimg.com/vi/WKZO-CWeOVA/hqdefault.jpg',
      bio: 'Penyanyi dan penulis lagu pemenang multi-Grammy dan Academy Award asal Los Angeles. Terkenal lewat vokal bisik yang khas, aransemen bass mendalam, dan penulisan lagu eksperimental bersama kakaknya FINNEAS.',
      writer: 'Billie Eilish O\'Connell & FINNEAS',
      producer: 'FINNEAS',
      albums: [
        { title: 'HIT ME HARD AND SOFT', year: '2024', type: 'Album', thumb: 'https://i.ytimg.com/vi/WKZO-CWeOVA/hqdefault.jpg' },
        { title: 'Happier Than Ever', year: '2021', type: 'Album', thumb: 'https://i.ytimg.com/vi/WKZO-CWeOVA/hqdefault.jpg' },
        { title: 'WHEN WE ALL FALL ASLEEP, WHERE DO WE GO?', year: '2019', type: 'Album', thumb: 'https://i.ytimg.com/vi/WKZO-CWeOVA/hqdefault.jpg' },
        { title: 'WILDFLOWER', year: '2024', type: 'Single', thumb: 'https://i.ytimg.com/vi/WKZO-CWeOVA/hqdefault.jpg' }
      ],
      related: ['Sabrina Carpenter', 'Lady Gaga', 'The Weeknd', 'Taylor Swift']
    },
    'bernadya': {
      name: 'Bernadya',
      verified: true,
      monthlyListeners: '14.821.503',
      followers: '6.2M',
      rank: '#1 di Indonesia',
      banner: 'https://i.ytimg.com/vi/E7kHvjvU6JY/hqdefault.jpg',
      bio: 'Penyanyi dan penulis lagu muda berbakat asal Surabaya, Indonesia. Sukses memecahkan rekor streaming tertinggi di Indonesia lewat album debut "Sialnya, Hidup Harus Tetap Berjalan" dengan lagu-lagu patah hati yang jujur dan menyentuh.',
      writer: 'Bernadya Ribka',
      producer: 'Rendy Pandugo',
      albums: [
        { title: 'Sialnya, Hidup Harus Tetap Berjalan', year: '2024', type: 'Album', thumb: 'https://i.ytimg.com/vi/E7kHvjvU6JY/hqdefault.jpg' },
        { title: 'Terlintas', year: '2023', type: 'EP', thumb: 'https://i.ytimg.com/vi/E7kHvjvU6JY/hqdefault.jpg' },
        { title: 'Satu Bulan', year: '2024', type: 'Single', thumb: 'https://i.ytimg.com/vi/E7kHvjvU6JY/hqdefault.jpg' },
        { title: 'Kata Mereka Ini Berlebihan', year: '2024', type: 'Single', thumb: 'https://i.ytimg.com/vi/E7kHvjvU6JY/hqdefault.jpg' }
      ],
      related: ['Nadin Amizah', 'Sal Priadi', 'Hindia', 'Juicy Luicy', 'Mahalini']
    },
    'bruno mars': {
      name: 'Bruno Mars',
      verified: true,
      monthlyListeners: '118.490.120',
      followers: '56.8M',
      rank: '#1 di Dunia',
      banner: 'https://i.ytimg.com/vi/PMivT7MJ41M/hqdefault.jpg',
      bio: 'Penyanyi, penulis lagu, produser, dan penari legendaris peraih 15 Grammy Awards asal Hawaii. Terkenal lewat aksi panggung enerjik dan lagu-lagu pop, soul, funk pemuncak tangga lagu Billboard Hot 100.',
      writer: 'Bruno Mars, Dernst Emile II',
      producer: 'D\'Mile & Bruno Mars',
      albums: [
        { title: 'Die With A Smile (feat. Lady Gaga)', year: '2024', type: 'Single', thumb: 'https://i.ytimg.com/vi/PMivT7MJ41M/hqdefault.jpg' },
        { title: 'An Evening with Silk Sonic', year: '2021', type: 'Album', thumb: 'https://i.ytimg.com/vi/PMivT7MJ41M/hqdefault.jpg' },
        { title: '24K Magic', year: '2016', type: 'Album', thumb: 'https://i.ytimg.com/vi/PMivT7MJ41M/hqdefault.jpg' },
        { title: 'Unorthodox Jukebox', year: '2012', type: 'Album', thumb: 'https://i.ytimg.com/vi/PMivT7MJ41M/hqdefault.jpg' }
      ],
      related: ['Lady Gaga', 'The Weeknd', 'Coldplay', 'Taylor Swift']
    },
    'lady gaga': {
      name: 'Lady Gaga',
      verified: true,
      monthlyListeners: '106.820.400',
      followers: '31.2M',
      rank: '#2 di Dunia',
      banner: 'https://i.ytimg.com/vi/PMivT7MJ41M/hqdefault.jpg',
      bio: 'Ikon pop global, pemenang 13 Grammy Awards dan Academy Award. Dikenal karena fleksibilitas musikal spektakuler mulai dari dance-pop teatrikal hingga jazz klasik dan balada vokal emosional.',
      writer: 'Stefani Germanotta, Andrew Watt',
      producer: 'Andrew Watt & Lady Gaga',
      albums: [
        { title: 'Die With A Smile', year: '2024', type: 'Single', thumb: 'https://i.ytimg.com/vi/PMivT7MJ41M/hqdefault.jpg' },
        { title: 'Harlequin', year: '2024', type: 'Album', thumb: 'https://i.ytimg.com/vi/PMivT7MJ41M/hqdefault.jpg' },
        { title: 'Chromatica', year: '2020', type: 'Album', thumb: 'https://i.ytimg.com/vi/PMivT7MJ41M/hqdefault.jpg' },
        { title: 'A Star Is Born', year: '2018', type: 'Album', thumb: 'https://i.ytimg.com/vi/PMivT7MJ41M/hqdefault.jpg' }
      ],
      related: ['Bruno Mars', 'Billie Eilish', 'Taylor Swift', 'Sabrina Carpenter']
    },
    'coldplay': {
      name: 'Coldplay',
      verified: true,
      monthlyListeners: '88.340.210',
      followers: '52.1M',
      rank: '#6 di Dunia',
      banner: 'https://i.ytimg.com/vi/yKNxeF4KMsY/hqdefault.jpg',
      bio: 'Grup musik rock alternatif legendaris asal London, Inggris, beranggotakan Chris Martin, Jonny Buckland, Guy Berryman, dan Will Champion. Salah satu band dengan penjualan album dan tur stadion terbesar sepanjang masa.',
      writer: 'Guy Berryman, Jonny Buckland, Will Champion, Chris Martin',
      producer: 'Max Martin & Bill Rahko',
      albums: [
        { title: 'Moon Music', year: '2024', type: 'Album', thumb: 'https://i.ytimg.com/vi/yKNxeF4KMsY/hqdefault.jpg' },
        { title: 'Music of the Spheres', year: '2021', type: 'Album', thumb: 'https://i.ytimg.com/vi/yKNxeF4KMsY/hqdefault.jpg' },
        { title: 'A Rush of Blood to the Head', year: '2002', type: 'Album', thumb: 'https://i.ytimg.com/vi/yKNxeF4KMsY/hqdefault.jpg' },
        { title: 'Parachutes', year: '2000', type: 'Album', thumb: 'https://i.ytimg.com/vi/yKNxeF4KMsY/hqdefault.jpg' }
      ],
      related: ['The Weeknd', 'Bruno Mars', 'Sheila On 7', 'The Adams']
    },
    'hindia': {
      name: 'Hindia',
      verified: true,
      monthlyListeners: '8.450.900',
      followers: '4.8M',
      rank: '#5 di Indonesia',
      banner: 'https://i.ytimg.com/vi/BRPaF-O-3rE/hqdefault.jpg',
      bio: 'Proyek solo dari Baskara Putra, vokalis Feast dan Lomba Sihir. Musik Hindia merekam perjalanan quarter-life crisis, refleksi sosial, dan kesehatan mental generasi urban Indonesia dengan kejujuran tajam.',
      writer: 'Baskara Putra',
      producer: 'Enrico Octaviano & Kareem Soenharjo',
      albums: [
        { title: 'Lagipula Hidup Akan Berakhir', year: '2023', type: 'Album', thumb: 'https://i.ytimg.com/vi/BRPaF-O-3rE/hqdefault.jpg' },
        { title: 'Menari Dengan Bayangan', year: '2019', type: 'Album', thumb: 'https://i.ytimg.com/vi/BRPaF-O-3rE/hqdefault.jpg' },
        { title: 'Evaluasi', year: '2019', type: 'Single', thumb: 'https://i.ytimg.com/vi/BRPaF-O-3rE/hqdefault.jpg' }
      ],
      related: ['Bernadya', 'Nadin Amizah', 'Sal Priadi', 'The Adams', 'Lomba Sihir']
    },
    'nadin amizah': {
      name: 'Nadin Amizah',
      verified: true,
      monthlyListeners: '7.120.300',
      followers: '5.1M',
      rank: '#7 di Indonesia',
      banner: 'https://i.ytimg.com/vi/60tLg_XG17Y/hqdefault.jpg',
      bio: 'Penyanyi dan penulis lagu beraliran folk-pop asal Bandung dengan lirik puitis khas sastra dan nuansa dongeng yang mendalam.',
      writer: 'Nadin Amizah',
      producer: 'Lafa Pratomo',
      albums: [
        { title: 'Untuk Dunia, Cinta, dan Kotornya', year: '2023', type: 'Album', thumb: 'https://i.ytimg.com/vi/60tLg_XG17Y/hqdefault.jpg' },
        { title: 'Selamat Ulang Tahun', year: '2020', type: 'Album', thumb: 'https://i.ytimg.com/vi/60tLg_XG17Y/hqdefault.jpg' },
        { title: 'Kalah', year: '2023', type: 'Single', thumb: 'https://i.ytimg.com/vi/60tLg_XG17Y/hqdefault.jpg' }
      ],
      related: ['Bernadya', 'Sal Priadi', 'Hindia', 'Tulus']
    },
    'sal priadi': {
      name: 'Sal Priadi',
      verified: true,
      monthlyListeners: '7.890.400',
      followers: '3.9M',
      rank: '#6 di Indonesia',
      banner: 'https://i.ytimg.com/vi/Zf95vXo4a68/hqdefault.jpg',
      bio: 'Solois dan aktor asal Malang yang memadukan teaterikal dan lirik puitis menyentuh kalbu. Lagu "Gala Bunga Matahari" menjadi lagu refleksi duka dan kehangatan paling populer di Indonesia.',
      writer: 'Salmantyo Ashrizky Priadi',
      producer: 'Lafa Pratomo & Mahatattwa',
      albums: [
        { title: 'MARKERS AND SUCH PENS FLASHDISKS', year: '2024', type: 'Album', thumb: 'https://i.ytimg.com/vi/Zf95vXo4a68/hqdefault.jpg' },
        { title: 'Berhati', year: '2020', type: 'Album', thumb: 'https://i.ytimg.com/vi/Zf95vXo4a68/hqdefault.jpg' },
        { title: 'Gala Bunga Matahari', year: '2024', type: 'Single', thumb: 'https://i.ytimg.com/vi/Zf95vXo4a68/hqdefault.jpg' }
      ],
      related: ['Bernadya', 'Nadin Amizah', 'Hindia', 'Juicy Luicy', 'Tulus']
    },
    'juicy luicy': {
      name: 'Juicy Luicy',
      verified: true,
      monthlyListeners: '9.340.800',
      followers: '4.2M',
      rank: '#4 di Indonesia',
      banner: 'https://i.ytimg.com/vi/B7V6yGq6K8o/hqdefault.jpg',
      bio: 'Band pop asal Bandung beranggotakan Julian Kaisar, Denis Ligia, Zamzam Y.M, Dwi Nugroho, dan Bina Bagja. Menghadirkan lagu-lagu patah hati santai yang menemani keseharian jutaan pendengar.',
      writer: 'Denis Ligia & Julian Kaisar',
      producer: 'Juicy Luicy Productions',
      albums: [
        { title: 'Nonbar', year: '2024', type: 'Album', thumb: 'https://i.ytimg.com/vi/B7V6yGq6K8o/hqdefault.jpg' },
        { title: 'Sentimental', year: '2020', type: 'Album', thumb: 'https://i.ytimg.com/vi/B7V6yGq6K8o/hqdefault.jpg' },
        { title: 'Sialan (feat. Adrian Khalif)', year: '2023', type: 'Single', thumb: 'https://i.ytimg.com/vi/B7V6yGq6K8o/hqdefault.jpg' }
      ],
      related: ['Bernadya', 'Mahalini', 'Sal Priadi', 'Sheila On 7']
    },
    'sheila on 7': {
      name: 'Sheila On 7',
      verified: true,
      monthlyListeners: '7.450.000',
      followers: '7.8M',
      rank: '#8 di Indonesia',
      banner: 'https://i.ytimg.com/vi/k1BfsO0mxWQ/hqdefault.jpg',
      bio: 'Band pop rock legendaris asal Yogyakarta yang didirikan tahun 1996 oleh Duta, Eross, Adam. Pencetak hits abadi lintas generasi seperti "Dan", "Sephia", dan "Melompat Lebih Tinggi".',
      writer: 'Eross Candra',
      producer: 'Sony Music Indonesia',
      albums: [
        { title: 'Kisah Klasik Untuk Masa Depan', year: '2000', type: 'Album', thumb: 'https://i.ytimg.com/vi/k1BfsO0mxWQ/hqdefault.jpg' },
        { title: 'Sheila On 7', year: '1999', type: 'Album', thumb: 'https://i.ytimg.com/vi/k1BfsO0mxWQ/hqdefault.jpg' },
        { title: '07 Des', year: '2002', type: 'Album', thumb: 'https://i.ytimg.com/vi/k1BfsO0mxWQ/hqdefault.jpg' }
      ],
      related: ['Dewa 19', 'Padi Reborn', 'The Adams', 'Juicy Luicy']
    },
    'tulus': {
      name: 'Tulus',
      verified: true,
      monthlyListeners: '6.840.100',
      followers: '8.4M',
      rank: '#10 di Indonesia',
      banner: 'https://i.ytimg.com/vi/N7vG_3g7M5E/hqdefault.jpg',
      bio: 'Solois dan pencipta lagu pop jazz berbakat asal Bukittinggi. Menghadirkan karya-karya orisinal dengan bahasa Indonesia yang anggun dan melodi yang abadi.',
      writer: 'Muhammad Tulus',
      producer: 'Ari Renaldi',
      albums: [
        { title: 'Manusia', year: '2022', type: 'Album', thumb: 'https://i.ytimg.com/vi/N7vG_3g7M5E/hqdefault.jpg' },
        { title: 'Monokrom', year: '2016', type: 'Album', thumb: 'https://i.ytimg.com/vi/N7vG_3g7M5E/hqdefault.jpg' },
        { title: 'Gajah', year: '2014', type: 'Album', thumb: 'https://i.ytimg.com/vi/N7vG_3g7M5E/hqdefault.jpg' }
      ],
      related: ['Bernadya', 'Sal Priadi', 'Nadin Amizah', 'Mahalini']
    },
    'the weeknd': {
      name: 'The Weeknd',
      verified: true,
      monthlyListeners: '112.980.300',
      followers: '84.2M',
      rank: '#2 di Dunia',
      banner: 'https://i.ytimg.com/vi/4NRXx6U8ABQ/hqdefault.jpg',
      bio: 'Musisi pop dan R&B asal Toronto, Kanada bernama asli Abel Tesfaye. Mencetak rekor lagu terlama di tangga lagu Billboard lewat "Blinding Lights".',
      writer: 'Abel Tesfaye & Max Martin',
      producer: 'Max Martin & Oscar Holter',
      albums: [
        { title: 'Hurry Up Tomorrow', year: '2024', type: 'Album', thumb: 'https://i.ytimg.com/vi/4NRXx6U8ABQ/hqdefault.jpg' },
        { title: 'After Hours', year: '2020', type: 'Album', thumb: 'https://i.ytimg.com/vi/4NRXx6U8ABQ/hqdefault.jpg' },
        { title: 'Starboy', year: '2016', type: 'Album', thumb: 'https://i.ytimg.com/vi/4NRXx6U8ABQ/hqdefault.jpg' }
      ],
      related: ['Bruno Mars', 'Billie Eilish', 'Taylor Swift', 'Coldplay']
    },
    'sabrina carpenter': {
      name: 'Sabrina Carpenter',
      verified: true,
      monthlyListeners: '84.210.500',
      followers: '28.4M',
      rank: '#7 di Dunia',
      banner: 'https://i.ytimg.com/vi/eVli-tstM5E/hqdefault.jpg',
      bio: 'Bintang pop sensasional asal Amerika Serikat peraih berbagai sertifikasi Platinum dengan hits global "Espresso" dan "Please Please Please" dari album "Short n\' Sweet".',
      writer: 'Sabrina Carpenter, Amy Allen, Julian Bunetta',
      producer: 'Julian Bunetta & Jack Antonoff',
      albums: [
        { title: 'Short n\' Sweet', year: '2024', type: 'Album', thumb: 'https://i.ytimg.com/vi/eVli-tstM5E/hqdefault.jpg' },
        { title: 'emails i can\'t send', year: '2022', type: 'Album', thumb: 'https://i.ytimg.com/vi/eVli-tstM5E/hqdefault.jpg' },
        { title: 'Espresso', year: '2024', type: 'Single', thumb: 'https://i.ytimg.com/vi/eVli-tstM5E/hqdefault.jpg' }
      ],
      related: ['Billie Eilish', 'Lady Gaga', 'Taylor Swift', 'Bruno Mars']
    }
  };

  // ─── Config / State ──────────────────────────────────────────
  const PIPED_INSTANCES = [
    'https://api.piped.private.coffee',
    'https://piped.video',
    'https://pipedapi.kavin.rocks',
  ];

  const INVIDIOUS_INSTANCES = [
    'https://yewtu.be',
    'https://inv.tux.pizza',
    'https://vid.puffyan.us',
    'https://invidious.privacyredirect.com',
  ];

  let currentInstance = 0;

  const state = {
    brand: localStorage.getItem('playtify_brand') || 'Playtify',
    currentTrack: null,
    queue: [],
    history: [],
    liked: JSON.parse(localStorage.getItem('playtify_liked') || '[]'),
    playlists: JSON.parse(localStorage.getItem('playtify_playlists') || '[]'),
    followedArtists: JSON.parse(localStorage.getItem('playtify_followed_artists') || '[]'),
    currentArtist: null,
    artistExpandedTracks: false,
    artistDiscoFilter: 'all',
    currentView: 'home',
    previousView: 'home',
    isPlaying: false,
    isShuffle: false,
    repeatMode: 0, // 0 = off, 1 = all, 2 = one
    volume: parseFloat(localStorage.getItem('playtify_volume') || '0.8'),
    currentPlaylistId: null,
    currentCuratedPlaylistId: null,
    searchDebounce: null,
    contextTarget: null,
    contextSource: null,
    ytReady: false,
    player: null,
    progressInterval: null,
  };

  // ─── DOM References ──────────────────────────────────────────
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const dom = {
    brandName: $('#brand-name'),
    btnEditBrand: $('#btn-edit-brand'),
    modalBrand: $('#modal-brand'),
    inputBrandName: $('#input-brand-name'),
    btnSaveBrand: $('#btn-save-brand'),

    navItems: $$('.nav-item'),
    views: $$('.view'),

    homeGreeting: $('#home-greeting'),
    homeGreetingSub: $('#home-greeting-sub'),
    homeSearchInput: $('#home-search-input'),
    btnHomeClearSearch: $('#btn-home-clear-search'),
    homeSearchContainer: $('#home-search-container'),
    homeResults: $('#home-results'),
    homeSearchTitle: $('#home-search-title'),
    homeSearchCount: $('#home-search-count'),
    btnBackToRecommendations: $('#btn-back-to-recommendations'),
    recommendationsContainer: $('#recommendations-container'),
    quickMixGrid: $('#quick-mix-grid'),
    shelfRowPlaylists: $('#shelf-row-playlists'),

    searchInput: $('#search-input'),
    btnSearchClear: $('#btn-search-clear'),
    searchResults: $('#search-results'),
    searchLoading: $('#search-loading'),
    searchError: $('#search-error'),
    btnRetrySearch: $('#btn-retry-search'),
    searchRecommendations: $('#search-recommendations'),
    browseGrid: $('#browse-grid'),
    searchPlaylistGrid: $('#search-playlist-grid'),

    likedList: $('#liked-list'),
    likedEmpty: $('#liked-empty'),
    likedCount: $('#liked-count'),

    queueNowPlaying: $('#queue-now-playing'),
    queueCurrent: $('#queue-current'),
    queueNext: $('#queue-next'),
    queueList: $('#queue-list'),
    queueEmpty: $('#queue-empty'),
    btnClearQueue: $('#btn-clear-queue'),
    btnBackQueue: $('#btn-back-queue'),
    queueSuggestions: $('#queue-suggestions'),
    queueSuggestionsList: $('#queue-suggestions-list'),

    playlistList: $('#playlist-list'),
    btnNewPlaylist: $('#btn-new-playlist'),
    modalPlaylist: $('#modal-playlist'),
    inputPlaylistName: $('#input-playlist-name'),
    btnSavePlaylist: $('#btn-save-playlist'),

    btnBackPlaylist: $('#btn-back-playlist'),
    playlistDetailBanner: $('#playlist-detail-banner'),
    playlistGradient: $('#playlist-gradient'),
    playlistDetailThumb: $('#playlist-detail-thumb'),
    playlistThumbFallback: $('#playlist-thumb-fallback'),
    playlistTypeBadge: $('#playlist-type-badge'),
    playlistDetailName: $('#playlist-detail-name'),
    playlistDetailDesc: $('#playlist-detail-desc'),
    playlistDetailCount: $('#playlist-detail-count'),
    playlistDetailTracks: $('#playlist-detail-tracks'),
    playlistDetailEmpty: $('#playlist-detail-empty'),
    btnPlayPlaylist: $('#btn-play-playlist'),
    btnPillPlayPlaylist: $('#btn-pill-play-playlist'),
    btnEditPlaylist: $('#btn-edit-playlist'),
    btnDeletePlaylist: $('#btn-delete-playlist'),

    modalAddToPlaylist: $('#modal-add-to-playlist'),
    modalPlaylistChoices: $('#modal-playlist-choices'),

    playerThumb: $('#player-thumb'),
    playerTitle: $('#player-title'),
    playerArtist: $('#player-artist'),
    btnPlayerLike: $('#btn-player-like'),

    btnShuffle: $('#btn-shuffle'),
    btnPrev: $('#btn-prev'),
    btnPlayPause: $('#btn-play-pause'),
    btnNext: $('#btn-next'),
    btnRepeat: $('#btn-repeat'),
    iconPlay: $('#icon-play'),
    iconPause: $('#icon-pause'),

    playerCurrentTime: $('#player-current-time'),
    playerDuration: $('#player-duration'),
    progressBar: $('#progress-bar'),
    progressFill: $('#progress-fill'),
    progressHandle: $('#progress-handle'),

    btnPlayerRec: $('#btn-player-rec'),
    btnPlayerQueue: $('#btn-player-queue'),
    playerRecDrawer: $('#player-rec-drawer'),
    recDrawerContext: $('#rec-drawer-context'),
    recDrawerList: $('#rec-drawer-list'),
    btnCloseRecDrawer: $('#btn-close-rec-drawer'),

    queueSidebar: $('#queue-sidebar'),
    btnCloseQueueSidebar: $('#btn-close-queue-sidebar'),
    queueSidebarCount: $('#queue-sidebar-count'),
    btnClearSidebarQueue: $('#btn-clear-sidebar-queue'),
    sidebarQueueNowPlaying: $('#sidebar-queue-now-playing'),
    sidebarQueueCurrent: $('#sidebar-queue-current'),
    sidebarQueueNext: $('#sidebar-queue-next'),
    sidebarQueueList: $('#sidebar-queue-list'),
    sidebarQueueEmpty: $('#sidebar-queue-empty'),
    sidebarSuggestionsList: $('#sidebar-suggestions-list'),
    btnRefreshSidebarSuggestions: $('#btn-refresh-sidebar-suggestions'),

    btnAddToPlaylist: $('#btn-add-to-playlist'),
    btnVolume: $('#btn-volume'),
    iconVolHigh: $('#icon-vol-high'),
    iconVolMute: $('#icon-vol-mute'),
    volumeBar: $('#volume-bar'),
    volumeFill: $('#volume-fill'),
    volumeHandle: $('#volume-handle'),

    contextMenu: $('#context-menu'),
    toastContainer: $('#toast-container'),

    // Mobile & PWA Layout Elements
    mobileMiniPlayer: $('#mobile-mini-player'),
    mobileMiniArtworkWrap: $('#mobile-mini-artwork-wrap'),
    mobileMiniThumb: $('#mobile-mini-thumb'),
    mobileMiniTitle: $('#mobile-mini-title'),
    mobileMiniArtist: $('#mobile-mini-artist'),
    mobileMiniExpandBtn: $('#mobile-mini-expand-btn'),
    btnMobileMiniNext: $('#btn-mobile-mini-next'),
    btnMobileMiniPlayPause: $('#btn-mobile-mini-play-pause'),
    mobileMiniIconPlay: $('#mobile-mini-icon-play'),
    mobileMiniIconPause: $('#mobile-mini-icon-pause'),

    mobileBottomDock: $('#mobile-bottom-dock'),
    dockItems: $$('.dock-item'),

    modalNowPlaying: $('#modal-now-playing'),
    btnCollapseNowPlaying: $('#btn-collapse-now-playing'),
    modalDiscWrap: $('#modal-disc-wrap'),
    modalDiscThumb: $('#modal-disc-thumb'),
    modalTrackTitle: $('#modal-track-title'),
    modalTrackArtist: $('#modal-track-artist'),
    modalLyrics1: $('#modal-lyrics-1'),
    modalLyrics2: $('#modal-lyrics-2'),
    modalLyrics3: $('#modal-lyrics-3'),
    modalProgressBar: $('#modal-progress-bar'),
    modalProgressFill: $('#modal-progress-fill'),
    modalProgressHandle: $('#modal-progress-handle'),
    modalCurrentTime: $('#modal-current-time'),
    modalDuration: $('#modal-duration'),
    btnModalShuffle: $('#btn-modal-shuffle'),
    btnModalPrev: $('#btn-modal-prev'),
    btnModalPlayPause: $('#btn-modal-play-pause'),
    modalIconPlay: $('#modal-icon-play'),
    modalIconPause: $('#modal-icon-pause'),
    btnModalNext: $('#btn-modal-next'),
    btnModalQueue: $('#btn-modal-queue'),
    btnModalLike: $('#btn-modal-like'),

    btnMobileTopLiked: $('#btn-mobile-top-liked'),
    btnMobileCuratedPlay: $('#btn-mobile-curated-play'),
    btnMobileCuratedLike: $('#btn-mobile-curated-like'),
    btnMobileCuratedQueue: $('#btn-mobile-curated-queue'),
    btnMobileSeeAllCurated: $('#btn-mobile-see-all-curated'),
    mobileFilterPills: $$('.mobile-filter-pill'),

    // Desktop Now Playing View (Non-Modal) Elements
    navNowPlaying: $('#nav-now-playing'),
    btnBackNowPlaying: $('#btn-back-now-playing'),
    btnPlayerNowPlaying: $('#btn-player-now-playing'),
    playerTrackInfo: $('.player-track-info'),
    playerThumbWrap: $('#player-thumb-wrap'),

    webNpTitle: $('#web-np-title'),
    webNpArtist: $('#web-np-artist'),
    webDiscWrap: $('#web-disc-wrap'),
    webDiscThumb: $('#web-disc-thumb'),
    btnWebNpPlayPause: $('#btn-web-np-play-pause'),
    webNpIconPlay: $('#web-np-icon-play'),
    webNpIconPause: $('#web-np-icon-pause'),
    btnWebNpShuffle: $('#btn-web-np-shuffle'),
    btnWebNpPrev: $('#btn-web-np-prev'),
    btnWebNpNext: $('#btn-web-np-next'),
    btnWebNpLike: $('#btn-web-np-like'),
    btnWebNpAddPlaylist: $('#btn-web-np-add-playlist'),
    webNpProgressBar: $('#web-np-progress-bar'),
    webNpProgressFill: $('#web-np-progress-fill'),
    webNpProgressHandle: $('#web-np-progress-handle'),
    webNpCurrentTime: $('#web-np-current-time'),
    webNpDuration: $('#web-np-duration'),
    webLyrics1: $('#web-lyrics-1'),
    webLyrics2: $('#web-lyrics-2'),
    webLyrics3: $('#web-lyrics-3'),
    btnWebNpViewAllQueue: $('#btn-web-np-view-all-queue'),
    webNpQueueList: $('#web-np-queue-list'),

    // Mobile Header interactive buttons
    mobileAvatarBtn: $('#mobile-avatar-btn'),
    mobileNotificationBtn: $('#mobile-notification-btn'),

    // Enhanced Desktop Now Playing Card Elements
    webNpArtistRow: $('.now-playing-web-artist-row'),
    webNpAlbumTag: $('#web-np-album-tag'),
    webNpAudioLabel: $('#web-np-audio-label'),
    webNpArtistCard: $('#web-np-artist-card'),
    webNpArtistCardBg: $('#web-np-artist-card-bg'),
    webNpArtistCardName: $('#web-np-artist-card-name'),
    webNpArtistListeners: $('#web-np-artist-listeners'),
    webNpArtistBio: $('#web-np-artist-bio'),
    btnWebNpFollowArtist: $('#btn-web-np-follow-artist'),
    btnWebNpViewArtist: $('#btn-web-np-view-artist'),
    webNpArtistTracksCard: $('#web-np-artist-tracks-card'),
    btnWebNpMoreArtistTracks: $('#btn-web-np-more-artist-tracks'),
    webNpArtistTracksList: $('#web-np-artist-tracks-list'),
    webNpCreditArtist: $('#web-np-credit-artist'),
    webNpCreditWriter: $('#web-np-credit-writer'),
    webNpCreditProducer: $('#web-np-credit-producer'),
    webNpCreditSource: $('#web-np-credit-source'),

    // Artist Profile View Elements
    viewArtist: $('#view-artist'),
    btnBackArtist: $('#btn-back-artist'),
    artistStickyName: $('#artist-sticky-name'),
    artistHeroBg: $('#artist-hero-bg'),
    artistName: $('#artist-name'),
    artistMonthlyListeners: $('#artist-monthly-listeners'),
    btnArtistPlayAll: $('#btn-artist-play-all'),
    btnArtistFollow: $('#btn-artist-follow'),
    btnArtistShuffle: $('#btn-artist-shuffle'),
    artistPopularTracks: $('#artist-popular-tracks'),
    btnArtistMoreTracks: $('#btn-artist-more-tracks'),
    artistDiscographyTabs: $('#artist-discography-tabs'),
    artistDiscographyGrid: $('#artist-discography-grid'),
    artistRelatedGrid: $('#artist-related-grid'),
    artistAboutCard: $('#artist-about-card'),
    artistAboutBg: $('#artist-about-bg'),
    artistAboutRank: $('#artist-about-rank'),
    artistAboutName: $('#artist-about-name'),
    artistAboutBio: $('#artist-about-bio'),
    artistStatFollowers: $('#artist-stat-followers'),
    artistStatListeners: $('#artist-stat-listeners'),
  };

  // ─── YouTube IFrame API ──────────────────────────────────────
  function loadYTApi() {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
  }

  window.onYouTubeIframeAPIReady = function () {
    state.player = new YT.Player('yt-player', {
      height: '1',
      width: '1',
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        fs: 0,
        iv_load_policy: 3,
        modestbranding: 1,
        rel: 0,
      },
      events: {
        onReady: () => {
          state.ytReady = true;
          state.player.setVolume(state.volume * 100);
        },
        onStateChange: onPlayerStateChange,
        onError: onPlayerError,
      },
    });
  };

  function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
      state.isPlaying = true;
      updatePlayPauseUI();
      startProgressUpdater();
    } else if (event.data === YT.PlayerState.PAUSED) {
      state.isPlaying = false;
      updatePlayPauseUI();
      stopProgressUpdater();
    } else if (event.data === YT.PlayerState.ENDED) {
      state.isPlaying = false;
      updatePlayPauseUI();
      stopProgressUpdater();
      onTrackEnded();
    }
  }

  function onPlayerError() {
    toast('Gagal memutar lagu. Melompat ke lagu berikutnya...');
    playNext();
  }

  // ─── Multi-tier YouTube Search ───────────────────────────────
  async function searchYouTube(query) {
    if (!query.trim()) return [];

    // 1. Try Piped API (CORS enabled, fast, returns 20 music tracks)
    for (const base of PIPED_INSTANCES) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 6000);
        const resp = await fetch(`${base}/search?q=${encodeURIComponent(query)}&filter=music_songs`, {
          signal: controller.signal,
        });
        clearTimeout(timeout);
        if (!resp.ok) continue;
        const data = await resp.json();
        const items = data.items || [];
        if (items.length > 0) {
          return items
            .map((it) => {
              const id = (it.url || '').replace('/watch?v=', '');
              return {
                id,
                title: it.title || 'Untitled',
                artist: it.uploaderName || 'Unknown Artist',
                duration: it.duration || 180,
                thumb: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
              };
            })
            .filter((t) => t.id && t.title);
        }
      } catch {
        // try next instance
      }
    }

    // 2. Fallback to Invidious
    for (let attempt = 0; attempt < INVIDIOUS_INSTANCES.length; attempt++) {
      const base = INVIDIOUS_INSTANCES[currentInstance];
      const url = `${base}/api/v1/search?q=${encodeURIComponent(query)}&type=video&sort_by=relevance`;

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 6000);
        const resp = await fetch(url, { signal: controller.signal });
        clearTimeout(timeout);

        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();

        return data
          .filter((item) => item.type === 'video')
          .slice(0, 20)
          .map((v) => ({
            id: v.videoId,
            title: v.title,
            artist: v.author || 'Unknown',
            duration: v.lengthSeconds || 0,
            thumb: `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`,
          }));
      } catch {
        currentInstance = (currentInstance + 1) % INVIDIOUS_INSTANCES.length;
      }
    }

    // 3. Fallback to local curated database filter
    const qLower = query.toLowerCase();
    const allCurated = Object.values(RECOMMENDATIONS_DATA).flat();
    const matched = allCurated.filter(
      (t) => t.title.toLowerCase().includes(qLower) || t.artist.toLowerCase().includes(qLower)
    );
    if (matched.length) return matched;

    throw new Error('Semua instance YouTube sibuk');
  }

  // ─── Utilities ───────────────────────────────────────────────
  function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  function toast(message) {
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = message;
    dom.toastContainer.appendChild(el);
    setTimeout(() => el.remove(), 3200);
  }

  function saveLiked() {
    localStorage.setItem('playtify_liked', JSON.stringify(state.liked));
  }

  function savePlaylists() {
    localStorage.setItem('playtify_playlists', JSON.stringify(state.playlists));
  }

  function isLiked(trackId) {
    return state.liked.some((t) => t.id === trackId);
  }

  // ─── Brand ───────────────────────────────────────────────────
  function initBrand() {
    dom.brandName.textContent = state.brand;
    document.title = state.brand;
  }

  dom.btnEditBrand.addEventListener('click', () => {
    dom.inputBrandName.value = state.brand;
    openModal('modal-brand');
    dom.inputBrandName.focus();
  });

  dom.btnSaveBrand.addEventListener('click', () => {
    const name = dom.inputBrandName.value.trim();
    if (name) {
      state.brand = name;
      localStorage.setItem('playtify_brand', name);
      dom.brandName.textContent = name;
      document.title = name;
      toast(`Brand diubah menjadi "${name}"`);
    }
    closeModal('modal-brand');
  });

  // ─── Navigation ──────────────────────────────────────────────
  function switchView(viewName) {
    if (viewName === 'now-playing' && window.innerWidth <= 768) {
      if (state.currentTrack) {
        openNowPlayingModal();
      } else {
        toast('Pilih lagu terlebih dahulu untuk memutar');
      }
      return;
    }

    if (state.currentView !== 'playlist-detail' && state.currentView !== 'queue' && state.currentView !== 'now-playing' && state.currentView !== 'artist') {
      state.previousView = state.currentView;
    }
    state.currentView = viewName;

    dom.navItems.forEach((item) => {
      item.classList.toggle('active', item.dataset.view === viewName);
    });
    if (dom.dockItems) {
      dom.dockItems.forEach((item) => {
        item.classList.toggle('active', item.dataset.mobileView === viewName);
      });
    }
    dom.views.forEach((view) => {
      view.classList.toggle('active', view.id === `view-${viewName}`);
    });

    if (dom.btnPlayerQueue) {
      dom.btnPlayerQueue.classList.toggle('active', viewName === 'queue');
    }

    const mainEl = document.getElementById('main-content');
    if (mainEl) mainEl.scrollTop = 0;

    if (viewName === 'home') refreshCurrentView();
    if (viewName === 'liked') renderLiked();
    if (viewName === 'queue') renderQueue();
    if (viewName === 'now-playing') updateWebNowPlayingUI();
    if (viewName === 'artist') renderArtistView();
    if (viewName === 'search') {
      if (!dom.searchInput.value.trim() && dom.searchRecommendations) {
        dom.searchRecommendations.hidden = false;
      }
      dom.searchInput.focus();
    }
  }

  dom.navItems.forEach((item) => {
    item.addEventListener('click', () => {
      const view = item.dataset.view;
      if (view === 'queue') {
        toggleQueueSidebar(true);
        return;
      }
      if (view) switchView(view);
    });
  });

  // Mobile Bottom Dock Binding
  if (dom.dockItems) {
    dom.dockItems.forEach((item) => {
      item.addEventListener('click', () => {
        const view = item.dataset.mobileView;
        if (view === 'queue') {
          toggleQueueSidebar();
          return;
        }
        if (view) switchView(view);
      });
    });
  }

  // ─── Home Greeting & Recommendations ─────────────────────────
  function getGreeting() {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 11) return 'Selamat pagi';
    if (hour >= 11 && hour < 15) return 'Selamat siang';
    if (hour >= 15 && hour < 18) return 'Selamat sore';
    return 'Selamat malam';
  }

  function initRecommendations() {
    if (dom.homeGreeting) {
      dom.homeGreeting.textContent = getGreeting();
    }

    renderQuickMix();
    initHomePlaylists();
    updateForYouShelf();

    renderShelf($('#shelf-row-top_indo'), RECOMMENDATIONS_DATA.top_indo, 'top_indo');
    renderShelf($('#shelf-row-global_hits'), RECOMMENDATIONS_DATA.global_hits, 'global_hits');
    renderShelf($('#shelf-row-chill_vibes'), RECOMMENDATIONS_DATA.chill_vibes, 'chill_vibes');
    renderShelf($('#shelf-row-lofi'), RECOMMENDATIONS_DATA.lofi, 'lofi');
    renderShelf($('#shelf-row-kpop'), RECOMMENDATIONS_DATA.kpop, 'kpop');
    renderShelf($('#shelf-row-nostalgia'), RECOMMENDATIONS_DATA.nostalgia, 'nostalgia');

    bindShelfControls();
  }

  function renderQuickMix() {
    if (!dom.quickMixGrid) return;
    const mixes = [
      { name: 'Top Hits Indonesia', key: 'top_indo', track: RECOMMENDATIONS_DATA.top_indo[0] },
      { name: "Today's Top Hits Dunia", key: 'global_hits', track: RECOMMENDATIONS_DATA.global_hits[0] },
      { name: 'Santai & Akustik Sore', key: 'chill_vibes', track: RECOMMENDATIONS_DATA.chill_vibes[0] },
      { name: 'Lofi Beats & Fokus', key: 'lofi', track: RECOMMENDATIONS_DATA.lofi[0] },
      { name: 'K-Pop Terpopuler', key: 'kpop', track: RECOMMENDATIONS_DATA.kpop[0] },
      { name: 'Nostalgia Pop Rock', key: 'nostalgia', track: RECOMMENDATIONS_DATA.nostalgia[0] },
    ];

    dom.quickMixGrid.innerHTML = mixes
      .map(
        (m) => `
      <div class="quick-mix-card ${state.currentTrack?.id === m.track?.id ? 'playing' : ''}" data-key="${m.key}">
        <div class="quick-mix-thumb">
          <img src="${escHtml(m.track?.thumb)}" alt="${escHtml(m.name)}" loading="lazy">
        </div>
        <span class="quick-mix-title">${escHtml(m.name)}</span>
        <button class="quick-mix-play" title="Putar ${escHtml(m.name)}" aria-label="Putar ${escHtml(m.name)}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        </button>
      </div>
    `
      )
      .join('');

    dom.quickMixGrid.querySelectorAll('.quick-mix-card').forEach((card) => {
      card.addEventListener('click', () => {
        const key = card.dataset.key;
        playShelf(key);
      });
    });
  }

  function initHomePlaylists() {
    if (!dom.shelfRowPlaylists) return;
    dom.shelfRowPlaylists.innerHTML = CURATED_PLAYLISTS.map((p) => playlistCardHTML(p)).join('');
    bindPlaylistCards(dom.shelfRowPlaylists);
  }

  function playlistCardHTML(playlist) {
    return `
      <div class="playlist-card" data-id="${playlist.id}">
        <div class="playlist-card-thumb">
          <img src="${escHtml(playlist.cover)}" alt="${escHtml(playlist.name)}" loading="lazy">
          <span class="playlist-card-badge">${escHtml(playlist.badge || 'PLAYLIST')}</span>
          <button class="playlist-card-play" title="Putar ${escHtml(playlist.name)}" aria-label="Putar ${escHtml(playlist.name)}">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          </button>
        </div>
        <p class="playlist-card-title">${escHtml(playlist.name)}</p>
        <p class="playlist-card-desc">${escHtml(playlist.desc)}</p>
      </div>
    `;
  }

  function bindPlaylistCards(container) {
    container.querySelectorAll('.playlist-card').forEach((card) => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.playlist-card-play')) {
          e.stopPropagation();
          const pl = CURATED_PLAYLISTS.find((p) => p.id === card.dataset.id);
          if (pl && pl.tracks.length > 0) {
            state.queue = pl.tracks.slice(1);
            playTrack(pl.tracks[0]);
            toast(`Memutar playlist "${pl.name}"`);
          }
          return;
        }
        openPlaylist(card.dataset.id);
      });
    });
  }

  function updateForYouShelf() {
    const row = $('#shelf-row-for-you');
    if (!row) return;

    let mix = [];
    if (state.liked.length > 0) {
      mix.push(...state.liked.slice(0, 4));
    }

    const categories = ['top_indo', 'global_hits', 'chill_vibes', 'nostalgia', 'kpop', 'lofi'];
    for (let i = 0; i < categories.length; i++) {
      if (mix.length >= 10) break;
      const cat = categories[i];
      const items = RECOMMENDATIONS_DATA[cat] || [];
      const item = items[mix.length % items.length];
      if (item && !mix.some((m) => m.id === item.id)) {
        mix.push(item);
      }
    }

    renderShelf(row, mix, 'for-you');
  }

  function renderShelf(container, tracks, shelfId) {
    if (!container || !tracks) return;

    container.innerHTML = tracks
      .map(
        (t) => `
      <div class="track-card ${state.currentTrack?.id === t.id ? 'playing' : ''}" data-id="${t.id}" data-title="${escHtml(t.title)}" data-artist="${escHtml(t.artist)}" data-thumb="${escHtml(t.thumb)}" data-duration="${t.duration}" data-shelf="${shelfId}">
        <div class="track-card-thumb">
          <img src="${escHtml(t.thumb)}" alt="${escHtml(t.title)}" loading="lazy">
          <button class="track-card-play" title="Putar" aria-label="Putar ${escHtml(t.title)}">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          </button>
        </div>
        <p class="track-card-title">${escHtml(t.title)}</p>
        <p class="track-card-artist clickable-artist" data-artist="${escHtml(t.artist)}">${escHtml(t.artist)}</p>
      </div>
    `
      )
      .join('');

    container.querySelectorAll('.track-card').forEach((card) => {
      card.addEventListener('click', () => {
        const track = trackFromElement(card);
        const allInShelf = Array.from(container.querySelectorAll('.track-card')).map(trackFromElement);
        const idx = allInShelf.findIndex((t) => t.id === track.id);
        if (idx >= 0) {
          state.queue = allInShelf.slice(idx + 1);
        }
        playTrack(track);
      });

      card.addEventListener('contextmenu', (e) => {
        showContextMenu(e, trackFromElement(card), 'home');
      });
    });
  }

  function playShelf(shelfId) {
    let tracks = [];
    let shelfName = 'rekomendasi';

    if (shelfId === 'for-you') {
      const row = $('#shelf-row-for-you');
      if (row) tracks = Array.from(row.querySelectorAll('.track-card')).map(trackFromElement);
      shelfName = 'Dibuat Untuk Kamu';
    } else if (RECOMMENDATIONS_DATA[shelfId]) {
      tracks = [...RECOMMENDATIONS_DATA[shelfId]];
      const names = {
        top_indo: 'Top Hits Indonesia',
        global_hits: "Today's Top Hits Mancanegara",
        chill_vibes: 'Santai & Akustik Sore',
        lofi: 'Lofi Beats & Fokus',
        kpop: 'K-Pop Terpopuler',
        nostalgia: 'Nostalgia Pop Rock Indonesia',
      };
      shelfName = names[shelfId] || shelfId;
    }

    if (tracks.length > 0) {
      state.queue = tracks.slice(1);
      playTrack(tracks[0]);
      toast(`Memutar "${shelfName}"`);
    }
  }

  function bindShelfControls() {
    // Arrow navigation buttons
    $$('.shelf-arrow-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const targetId = btn.dataset.target;
        const row = document.getElementById(targetId);
        if (!row) return;
        const scrollAmount = row.clientWidth * 0.75;
        if (btn.classList.contains('prev')) {
          row.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        } else {
          row.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      });
    });

    // "Putar Semua" buttons
    $$('.shelf-play-all').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        playShelf(btn.dataset.shelf);
      });
    });

    // Filter pills
    $$('#home-filter-pills .pill').forEach((pill) => {
      pill.addEventListener('click', () => {
        $$('#home-filter-pills .pill').forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');
        filterHomeSections(pill.dataset.filter);
      });
    });
  }

  function filterHomeSections(filter) {
    const allShelves = $$('.shelf-section');
    if (filter === 'all') {
      allShelves.forEach((s) => s.classList.remove('shelf-hidden'));
      return;
    }

    allShelves.forEach((s) => {
      if (s.id === `shelf-${filter}`) {
        s.classList.remove('shelf-hidden');
        s.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        s.classList.add('shelf-hidden');
      }
    });
  }

  // ─── Search View & Recommendations ──────────────────────────
  function initSearchRecommendations() {
    if (!dom.browseGrid || !dom.searchPlaylistGrid) return;

    // Render Browse Category Boxes (Spotify Colored Boxes)
    dom.browseGrid.innerHTML = BROWSE_CATEGORIES.map(
      (b) => `
      <div class="browse-card" style="background: ${b.gradient};" data-playlist-id="${b.playlistId}">
        <span class="browse-card-title">${escHtml(b.name)}</span>
        <img class="browse-card-thumb" src="${escHtml(b.thumb)}" alt="" loading="lazy">
      </div>
    `
    ).join('');

    dom.browseGrid.querySelectorAll('.browse-card').forEach((card) => {
      card.addEventListener('click', () => {
        const plId = card.dataset.playlistId;
        if (plId) openPlaylist(plId);
      });
    });

    // Render Curated Playlists in Search View
    dom.searchPlaylistGrid.innerHTML = CURATED_PLAYLISTS.map((p) => playlistCardHTML(p)).join('');
    bindPlaylistCards(dom.searchPlaylistGrid);
  }

  dom.searchInput.addEventListener('input', () => {
    clearTimeout(state.searchDebounce);
    const query = dom.searchInput.value.trim();

    if (dom.btnSearchClear) {
      dom.btnSearchClear.hidden = !query;
    }

    if (!query) {
      dom.searchResults.innerHTML = '';
      dom.searchLoading.hidden = true;
      dom.searchError.hidden = true;
      if (dom.searchRecommendations) dom.searchRecommendations.hidden = false;
      return;
    }

    if (dom.searchRecommendations) dom.searchRecommendations.hidden = true;
    dom.searchLoading.hidden = false;
    dom.searchError.hidden = true;
    dom.searchResults.innerHTML = '';

    state.searchDebounce = setTimeout(async () => {
      try {
        const results = await searchYouTube(query);
        dom.searchLoading.hidden = true;
        renderSearchResults(results);
      } catch {
        dom.searchLoading.hidden = true;
        dom.searchError.hidden = false;
      }
    }, 450);
  });

  if (dom.btnSearchClear) {
    dom.btnSearchClear.addEventListener('click', () => {
      dom.searchInput.value = '';
      dom.btnSearchClear.hidden = true;
      dom.searchResults.innerHTML = '';
      dom.searchLoading.hidden = true;
      dom.searchError.hidden = true;
      if (dom.searchRecommendations) dom.searchRecommendations.hidden = false;
    });
  }

  dom.btnRetrySearch.addEventListener('click', () => {
    const query = dom.searchInput.value;
    if (query.trim()) {
      dom.searchInput.dispatchEvent(new Event('input'));
    }
  });

  function renderSearchResults(tracks) {
    if (!tracks.length) {
      dom.searchResults.innerHTML = '<div class="empty-state"><h3>Tidak ditemukan</h3><p>Coba kata kunci lain</p></div>';
      return;
    }
    dom.searchResults.innerHTML = tracks.map((t) => trackRowHTML(t, 'search')).join('');
    bindTrackRows(dom.searchResults, 'search');
  }

  // ─── Search (Home View) ─────────────────────────────────────
  dom.homeSearchInput.addEventListener('input', () => {
    clearTimeout(state.searchDebounce);
    const query = dom.homeSearchInput.value.trim();

    if (dom.btnHomeClearSearch) {
      dom.btnHomeClearSearch.hidden = !query;
    }

    if (!query) {
      exitHomeSearch();
      return;
    }

    dom.homeSearchContainer.hidden = false;
    dom.recommendationsContainer.hidden = true;
    if (dom.quickMixGrid) dom.quickMixGrid.hidden = true;
    dom.homeSearchTitle.textContent = `Mencari "${query}"...`;
    dom.homeSearchCount.textContent = 'Mencari lagu dari YouTube...';
    dom.homeResults.innerHTML = '<div class="loading-state"><div class="spinner"></div><p>Mencari musik dari YouTube...</p></div>';

    state.searchDebounce = setTimeout(async () => {
      try {
        const results = await searchYouTube(query);
        dom.homeSearchTitle.textContent = `Hasil untuk "${query}"`;
        dom.homeSearchCount.textContent = `${results.length} lagu ditemukan dari YouTube`;
        renderHomeResults(results);
      } catch {
        dom.homeResults.innerHTML = '<div class="error-state"><p>Gagal mencari di YouTube. Silakan coba lagi.</p></div>';
      }
    }, 450);
  });

  function exitHomeSearch() {
    dom.homeSearchInput.value = '';
    if (dom.btnHomeClearSearch) dom.btnHomeClearSearch.hidden = true;
    dom.homeSearchContainer.hidden = true;
    dom.recommendationsContainer.hidden = false;
    if (dom.quickMixGrid) dom.quickMixGrid.hidden = false;
    dom.homeResults.innerHTML = '';
  }

  if (dom.btnHomeClearSearch) {
    dom.btnHomeClearSearch.addEventListener('click', exitHomeSearch);
  }

  if (dom.btnBackToRecommendations) {
    dom.btnBackToRecommendations.addEventListener('click', exitHomeSearch);
  }

  function renderHomeResults(tracks) {
    if (!tracks.length) {
      dom.homeResults.innerHTML = '<div class="empty-state"><h3>Tidak ditemukan</h3><p>Coba kata kunci lain</p></div>';
      return;
    }
    dom.homeResults.innerHTML = tracks
      .map(
        (t) => `
      <div class="track-card ${state.currentTrack?.id === t.id ? 'playing' : ''}" data-id="${t.id}" data-title="${escHtml(t.title)}" data-artist="${escHtml(t.artist)}" data-thumb="${escHtml(t.thumb)}" data-duration="${t.duration}">
        <div class="track-card-thumb">
          <img src="${escHtml(t.thumb)}" alt="${escHtml(t.title)}" loading="lazy">
          <button class="track-card-play" title="Putar" aria-label="Putar ${escHtml(t.title)}">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          </button>
        </div>
        <p class="track-card-title">${escHtml(t.title)}</p>
        <p class="track-card-artist clickable-artist" data-artist="${escHtml(t.artist)}">${escHtml(t.artist)}</p>
      </div>
    `
      )
      .join('');

    dom.homeResults.querySelectorAll('.track-card').forEach((card) => {
      card.addEventListener('click', () => playTrackFromElement(card));
      card.addEventListener('contextmenu', (e) => showContextMenu(e, trackFromElement(card), 'home'));
    });
  }

  // ─── Liked ──────────────────────────────────────────────────
  function renderLiked() {
    dom.likedCount.textContent = `${state.liked.length} lagu`;
    if (!state.liked.length) {
      dom.likedList.innerHTML = '';
      dom.likedEmpty.hidden = false;
      return;
    }
    dom.likedEmpty.hidden = true;
    dom.likedList.innerHTML = state.liked.map((t) => trackRowHTML(t, 'liked')).join('');
    bindTrackRows(dom.likedList, 'liked');
  }

  // ─── Queue ──────────────────────────────────────────────────
  function renderQueue() {
    const hasCurrentTrack = !!state.currentTrack;
    const hasQueue = state.queue.length > 0;

    if (dom.queueNowPlaying) {
      dom.queueNowPlaying.hidden = !hasCurrentTrack;
      dom.queueNowPlaying.style.display = hasCurrentTrack ? 'block' : 'none';
      if (hasCurrentTrack) {
        dom.queueCurrent.innerHTML = trackRowHTML(state.currentTrack, 'queue-current');
        bindTrackRows(dom.queueCurrent, 'queue-current');
      }
    }

    if (dom.queueNext) {
      dom.queueNext.hidden = !hasQueue;
      dom.queueNext.style.display = hasQueue ? 'block' : 'none';
      if (hasQueue) {
        dom.queueList.innerHTML = state.queue.map((t) => trackRowHTML(t, 'queue')).join('');
        bindTrackRows(dom.queueList, 'queue');
      }
    }

    if (dom.queueEmpty) {
      const showEmpty = !hasCurrentTrack && !hasQueue;
      dom.queueEmpty.hidden = !showEmpty;
      dom.queueEmpty.style.display = showEmpty ? 'flex' : 'none';
    }

    // Render suggestions inside queue view
    if (dom.queueSuggestionsList) {
      const pool = RECOMMENDATIONS_DATA.top_indo || [];
      const currentId = state.currentTrack?.id;
      const queueIds = new Set(state.queue.map((t) => t.id));
      const suggestions = pool.filter((t) => t.id !== currentId && !queueIds.has(t.id)).slice(0, 6);

      dom.queueSuggestionsList.innerHTML = suggestions.map((t) => trackRowHTML(t, 'queue-suggestion')).join('');
      bindTrackRows(dom.queueSuggestionsList, 'queue-suggestion');
    }
  }

  if (dom.btnBackQueue) {
    dom.btnBackQueue.addEventListener('click', () => {
      switchView(state.previousView || 'home');
    });
  }

  dom.btnClearQueue.addEventListener('click', () => {
    state.queue = [];
    renderQueue();
    toast('Queue dihapus');
  });

  // ─── Playlists & Spotify Detail View ────────────────────────
  function renderPlaylistSidebar() {
    dom.playlistList.innerHTML = state.playlists
      .map(
        (pl) => `
      <li class="playlist-item ${state.currentPlaylistId === pl.id ? 'active' : ''}" data-id="${pl.id}">
        <div class="playlist-item-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
        </div>
        <span>${escHtml(pl.name)}</span>
      </li>
    `
      )
      .join('');

    dom.playlistList.querySelectorAll('.playlist-item').forEach((item) => {
      item.addEventListener('click', () => openPlaylist(item.dataset.id));
    });
  }

  dom.btnNewPlaylist.addEventListener('click', () => {
    dom.inputPlaylistName.value = '';
    openModal('modal-playlist');
    dom.inputPlaylistName.focus();
  });

  dom.btnSavePlaylist.addEventListener('click', () => {
    const name = dom.inputPlaylistName.value.trim();
    if (!name) return;
    const pl = { id: generateId(), name, tracks: [], createdAt: Date.now() };
    state.playlists.push(pl);
    savePlaylists();
    renderPlaylistSidebar();
    closeModal('modal-playlist');
    toast(`Playlist "${name}" dibuat`);
  });

  function openPlaylist(id) {
    if (state.currentView !== 'playlist-detail') {
      state.previousView = state.currentView;
    }

    // 1. Check if this is a Curated Playlist
    const curated = CURATED_PLAYLISTS.find((p) => p.id === id);
    if (curated) {
      state.currentPlaylistId = null;
      state.currentCuratedPlaylistId = id;
      renderPlaylistSidebar();

      dom.playlistDetailName.textContent = curated.name;
      dom.playlistTypeBadge.textContent = 'PLAYLIST • REKOMENDASI SPOTIFY';
      dom.playlistDetailDesc.textContent = curated.desc;
      dom.playlistDetailDesc.hidden = false;

      const totalSec = curated.tracks.reduce((acc, t) => acc + (t.duration || 0), 0);
      dom.playlistDetailCount.textContent = `${curated.tracks.length} lagu • Sekitar ${Math.round(totalSec / 60)} menit`;

      dom.playlistDetailThumb.src = curated.cover;
      dom.playlistDetailThumb.hidden = false;
      dom.playlistThumbFallback.hidden = true;
      dom.playlistGradient.style.background = curated.gradient || 'linear-gradient(135deg, #134e5e 0%, #121212 100%)';

      dom.btnEditPlaylist.hidden = true;
      dom.btnDeletePlaylist.hidden = true;

      dom.playlistDetailTracks.innerHTML = curated.tracks
        .map((t, idx) => trackTableRowHTML(t, idx + 1, 'playlist-curated'))
        .join('');
      bindTrackRows(dom.playlistDetailTracks, 'playlist-curated');
      dom.playlistDetailEmpty.hidden = true;

      switchView('playlist-detail');
      return;
    }

    // 2. Otherwise User Created Playlist
    const pl = state.playlists.find((p) => p.id === id);
    if (!pl) return;

    state.currentPlaylistId = id;
    state.currentCuratedPlaylistId = null;
    renderPlaylistSidebar();

    dom.playlistDetailName.textContent = pl.name;
    dom.playlistTypeBadge.textContent = 'PLAYLIST SAYA';
    dom.playlistDetailDesc.hidden = true;
    dom.playlistDetailCount.textContent = `${pl.tracks.length} lagu`;

    if (pl.tracks.length > 0) {
      dom.playlistDetailThumb.src = pl.tracks[0].thumb;
      dom.playlistDetailThumb.hidden = false;
      dom.playlistThumbFallback.hidden = true;
    } else {
      dom.playlistDetailThumb.hidden = true;
      dom.playlistThumbFallback.hidden = false;
    }
    dom.playlistGradient.style.background = 'linear-gradient(135deg, #1a4a3a 0%, #0d2d22 50%, var(--bg-surface) 100%)';

    dom.btnEditPlaylist.hidden = false;
    dom.btnDeletePlaylist.hidden = false;

    if (pl.tracks.length) {
      dom.playlistDetailTracks.innerHTML = pl.tracks
        .map((t, idx) => trackTableRowHTML(t, idx + 1, 'playlist-user'))
        .join('');
      bindTrackRows(dom.playlistDetailTracks, 'playlist-user');
      dom.playlistDetailEmpty.hidden = true;
    } else {
      dom.playlistDetailTracks.innerHTML = '';
      dom.playlistDetailEmpty.hidden = false;
    }

    switchView('playlist-detail');
  }

  function playActivePlaylist() {
    if (state.currentCuratedPlaylistId) {
      const curated = CURATED_PLAYLISTS.find((p) => p.id === state.currentCuratedPlaylistId);
      if (curated && curated.tracks.length > 0) {
        state.queue = curated.tracks.slice(1);
        playTrack(curated.tracks[0]);
        toast(`Memutar playlist "${curated.name}"`);
      }
    } else if (state.currentPlaylistId) {
      const pl = state.playlists.find((p) => p.id === state.currentPlaylistId);
      if (pl && pl.tracks.length > 0) {
        state.queue = pl.tracks.slice(1);
        playTrack(pl.tracks[0]);
        toast(`Memutar "${pl.name}"`);
      }
    }
  }

  dom.btnPlayPlaylist.addEventListener('click', playActivePlaylist);
  if (dom.btnPillPlayPlaylist) {
    dom.btnPillPlayPlaylist.addEventListener('click', playActivePlaylist);
  }

  if (dom.btnBackPlaylist) {
    dom.btnBackPlaylist.addEventListener('click', () => {
      switchView(state.previousView || 'home');
    });
  }

  dom.btnEditPlaylist.addEventListener('click', () => {
    const nameEl = dom.playlistDetailName;
    if (nameEl.contentEditable === 'true') {
      nameEl.contentEditable = 'false';
      const pl = state.playlists.find((p) => p.id === state.currentPlaylistId);
      if (pl) {
        pl.name = nameEl.textContent.trim() || pl.name;
        savePlaylists();
        renderPlaylistSidebar();
        toast('Nama playlist disimpan');
      }
    } else {
      nameEl.contentEditable = 'true';
      nameEl.focus();
      const range = document.createRange();
      range.selectNodeContents(nameEl);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  });

  dom.btnDeletePlaylist.addEventListener('click', () => {
    const pl = state.playlists.find((p) => p.id === state.currentPlaylistId);
    if (!pl) return;
    if (!confirm(`Hapus playlist "${pl.name}"?`)) return;
    state.playlists = state.playlists.filter((p) => p.id !== state.currentPlaylistId);
    state.currentPlaylistId = null;
    savePlaylists();
    renderPlaylistSidebar();
    switchView('home');
    toast('Playlist dihapus');
  });

  // ─── Add to Playlist Modal ──────────────────────────────────
  dom.btnAddToPlaylist.addEventListener('click', () => {
    if (!state.currentTrack) return;
    showAddToPlaylistModal(state.currentTrack);
  });

  function showAddToPlaylistModal(track) {
    if (!state.playlists.length) {
      toast('Buat playlist terlebih dahulu');
      return;
    }
    dom.modalPlaylistChoices.innerHTML = state.playlists
      .map(
        (pl) => `
      <li class="playlist-choice-item" data-id="${pl.id}">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
        <span>${escHtml(pl.name)} (${pl.tracks.length})</span>
      </li>
    `
      )
      .join('');

    dom.modalPlaylistChoices.querySelectorAll('.playlist-choice-item').forEach((item) => {
      item.addEventListener('click', () => {
        const pl = state.playlists.find((p) => p.id === item.dataset.id);
        if (!pl) return;
        if (pl.tracks.some((t) => t.id === track.id)) {
          toast('Lagu sudah ada di playlist');
        } else {
          pl.tracks.push({ ...track });
          savePlaylists();
          toast(`Ditambahkan ke "${pl.name}"`);
          if (state.currentPlaylistId === pl.id) openPlaylist(pl.id);
        }
        closeModal('modal-add-to-playlist');
      });
    });

    openModal('modal-add-to-playlist');
  }

  // ─── Track Rendering Helpers ────────────────────────────────
  function escHtml(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }

  function trackRowHTML(track, source) {
    const isCurrentPlaying = state.currentTrack?.id === track.id;
    return `
    <div class="track-row ${isCurrentPlaying ? 'playing' : ''}" data-id="${track.id}" data-title="${escHtml(track.title)}" data-artist="${escHtml(track.artist)}" data-thumb="${escHtml(track.thumb)}" data-duration="${track.duration}" data-source="${source}">
      <div class="track-thumb">
        <img src="${escHtml(track.thumb)}" alt="" loading="lazy">
        <div class="track-thumb-overlay">
          ${isCurrentPlaying && state.isPlaying
            ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>'
            : '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>'
          }
        </div>
      </div>
      <div class="track-info">
        <p class="track-title">${escHtml(track.title)}</p>
        <p class="track-artist clickable-artist" data-artist="${escHtml(track.artist)}">${escHtml(track.artist)}</p>
      </div>
      <div class="track-actions">
        <button class="icon-btn btn-like-track ${isLiked(track.id) ? 'liked' : ''}" title="Suka" aria-label="Suka">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="${isLiked(track.id) ? 'var(--accent)' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>
        <span class="track-duration">${formatTime(track.duration)}</span>
        <button class="icon-btn btn-more-track" title="Lainnya" aria-label="Opsi lainnya">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
        </button>
      </div>
    </div>
  `;
  }

  function trackTableRowHTML(track, index, source) {
    const isCurrentPlaying = state.currentTrack?.id === track.id;
    return `
    <div class="track-row track-table-row ${isCurrentPlaying ? 'playing' : ''}" data-id="${track.id}" data-title="${escHtml(track.title)}" data-artist="${escHtml(track.artist)}" data-thumb="${escHtml(track.thumb)}" data-duration="${track.duration}" data-source="${source}">
      <div class="row-index-wrap">
        <span class="track-row-index">${index}</span>
        <button class="icon-btn row-play-btn" title="Putar" aria-label="Putar ${escHtml(track.title)}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        </button>
      </div>
      <div class="track-main-info">
        <div class="track-thumb">
          <img src="${escHtml(track.thumb)}" alt="" loading="lazy">
        </div>
        <div class="track-info">
          <p class="track-title">${escHtml(track.title)}</p>
          <p class="track-artist clickable-artist" data-artist="${escHtml(track.artist)}">${escHtml(track.artist)}</p>
        </div>
      </div>
      <div class="track-actions">
        <button class="icon-btn btn-like-track ${isLiked(track.id) ? 'liked' : ''}" title="Suka" aria-label="Suka">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="${isLiked(track.id) ? 'var(--accent)' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>
        <span class="track-duration">${formatTime(track.duration)}</span>
        <button class="icon-btn btn-more-track" title="Lainnya" aria-label="Opsi lainnya">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
        </button>
      </div>
    </div>
  `;
  }

  function trackFromElement(el) {
    return {
      id: el.dataset.id,
      title: el.dataset.title,
      artist: el.dataset.artist,
      thumb: el.dataset.thumb,
      duration: parseInt(el.dataset.duration, 10) || 0,
    };
  }

  function bindTrackRows(container, source) {
    container.querySelectorAll('.track-row').forEach((row) => {
      row.addEventListener('click', (e) => {
        if (e.target.closest('.icon-btn')) return;
        const track = trackFromElement(row);
        const allInList = Array.from(container.querySelectorAll('.track-row')).map(trackFromElement);
        const idx = allInList.findIndex((t) => t.id === track.id);
        if (idx >= 0) {
          state.queue = allInList.slice(idx + 1);
        }
        playTrack(track);
      });

      row.addEventListener('contextmenu', (e) => {
        showContextMenu(e, trackFromElement(row), source);
      });

      const likeBtn = row.querySelector('.btn-like-track');
      if (likeBtn) {
        likeBtn.addEventListener('click', () => {
          toggleLike(trackFromElement(row));
          refreshCurrentView();
        });
      }

      const moreBtn = row.querySelector('.btn-more-track');
      if (moreBtn) {
        moreBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          showContextMenu(e, trackFromElement(row), source);
        });
      }
    });
  }

  function playTrackFromElement(el) {
    playTrack(trackFromElement(el));
  }

  // ─── Playback ───────────────────────────────────────────────
  function playTrack(track) {
    if (!state.ytReady || !track) return;

    if (state.currentTrack) {
      state.history.push(state.currentTrack);
      if (state.history.length > 50) state.history.shift();
    }

    state.currentTrack = track;
    state.player.loadVideoById(track.id);
    state.isPlaying = true;

    updatePlayerUI();
    updatePlayPauseUI();
    refreshCurrentView();

    // If rec drawer is open, refresh recommendations based on new track
    if (dom.playerRecDrawer && !dom.playerRecDrawer.hidden) {
      renderPlayerRecDrawer();
    }

    // If right queue sidebar is open, refresh queue sidebar
    if (dom.queueSidebar && dom.queueSidebar.classList.contains('open')) {
      renderQueueSidebar();
    }
  }

  function togglePlayPause() {
    if (!state.currentTrack) {
      const first = CURATED_PLAYLISTS[0]?.tracks[0] || RECOMMENDATIONS_DATA.top_indo[0];
      if (first) {
        playTrack(first);
        return;
      }
    }
    if (!state.ytReady || !state.player) return;
    if (state.isPlaying) {
      state.player.pauseVideo();
    } else {
      state.player.playVideo();
    }
  }

  function playNext() {
    if (state.repeatMode === 2 && state.currentTrack) {
      state.player.seekTo(0, true);
      state.player.playVideo();
      return;
    }

    if (state.queue.length) {
      const idx = state.isShuffle ? Math.floor(Math.random() * state.queue.length) : 0;
      const next = state.queue.splice(idx, 1)[0];
      playTrack(next);
    } else if (state.repeatMode === 1 && state.history.length) {
      state.queue = [...state.history];
      state.history = [];
      playNext();
    }
  }

  function playPrev() {
    if (!state.ytReady) return;
    const current = state.player.getCurrentTime?.() || 0;
    if (current > 3 && state.currentTrack) {
      state.player.seekTo(0, true);
      return;
    }
    if (state.history.length) {
      if (state.currentTrack) {
        state.queue.unshift(state.currentTrack);
      }
      const prev = state.history.pop();
      state.currentTrack = prev;
      state.player.loadVideoById(prev.id);
      state.isPlaying = true;
      updatePlayerUI();
      updatePlayPauseUI();
      refreshCurrentView();
    }
  }

  function onTrackEnded() {
    playNext();
  }

  // ─── Player UI ──────────────────────────────────────────────
  function updatePlayerUI() {
    const t = state.currentTrack;
    if (!t) return;

    dom.playerThumb.src = t.thumb;
    dom.playerThumb.alt = t.title;
    dom.playerTitle.textContent = t.title;
    dom.playerArtist.textContent = t.artist;
    dom.playerDuration.textContent = formatTime(t.duration);

    // Mobile Mini Player (Screen 2)
    if (dom.mobileMiniPlayer) {
      dom.mobileMiniPlayer.classList.add('visible');
    }
    if (dom.mobileMiniThumb) {
      dom.mobileMiniThumb.src = t.thumb;
      dom.mobileMiniThumb.alt = t.title;
    }
    if (dom.mobileMiniTitle) dom.mobileMiniTitle.textContent = t.title;
    if (dom.mobileMiniArtist) dom.mobileMiniArtist.textContent = t.artist;

    // Mobile Full-Screen Now Playing Modal (Screen 3)
    if (dom.modalDiscThumb) {
      dom.modalDiscThumb.src = t.thumb;
      dom.modalDiscThumb.alt = t.title;
    }
    if (dom.modalTrackTitle) dom.modalTrackTitle.textContent = t.title;
    if (dom.modalTrackArtist) dom.modalTrackArtist.textContent = t.artist;
    if (dom.modalDuration) dom.modalDuration.textContent = formatTime(t.duration);

    // Aesthetic Lyrics / Atmosphere Card (Mobile)
    if (dom.modalLyrics1 && dom.modalLyrics2 && dom.modalLyrics3) {
      dom.modalLyrics1.textContent = 'Memutar dari YouTube:';
      dom.modalLyrics2.textContent = `"${t.title}"`;
      dom.modalLyrics3.textContent = `oleh ${t.artist}`;
    }

    // Desktop Now Playing View (Web Non-Modal)
    if (dom.webNpTitle) dom.webNpTitle.textContent = t.title;
    if (dom.webNpArtist) dom.webNpArtist.textContent = t.artist;
    if (dom.webDiscThumb) {
      dom.webDiscThumb.src = t.thumb;
      dom.webDiscThumb.alt = t.title;
    }
    if (dom.webNpDuration) dom.webNpDuration.textContent = formatTime(t.duration);
    if (dom.webLyrics1 && dom.webLyrics2 && dom.webLyrics3) {
      dom.webLyrics1.textContent = 'Memutar dari YouTube:';
      dom.webLyrics2.textContent = `"${t.title}"`;
      dom.webLyrics3.textContent = `oleh ${t.artist}`;
    }
    renderWebNowPlayingQueue();

    updateLikeButton();
    document.title = `${t.title} - ${state.brand}`;
  }

  function updatePlayPauseUI() {
    const isPlaying = !!state.isPlaying;

    // Desktop Player Bar
    if (dom.btnPlayPause) {
      dom.btnPlayPause.classList.toggle('is-playing', isPlaying);
      dom.btnPlayPause.title = isPlaying ? 'Jeda' : 'Putar';
      dom.btnPlayPause.setAttribute('aria-label', isPlaying ? 'Jeda' : 'Putar');
    }
    if (dom.iconPlay) {
      dom.iconPlay.hidden = isPlaying;
      dom.iconPlay.style.display = isPlaying ? 'none' : 'block';
    }
    if (dom.iconPause) {
      dom.iconPause.hidden = !isPlaying;
      dom.iconPause.style.display = isPlaying ? 'block' : 'none';
    }

    // Mobile Mini Player
    if (dom.btnMobileMiniPlayPause) {
      dom.btnMobileMiniPlayPause.classList.toggle('is-playing', isPlaying);
      dom.btnMobileMiniPlayPause.title = isPlaying ? 'Jeda' : 'Putar';
    }
    if (dom.mobileMiniIconPlay) {
      dom.mobileMiniIconPlay.hidden = isPlaying;
      dom.mobileMiniIconPlay.style.display = isPlaying ? 'none' : 'block';
    }
    if (dom.mobileMiniIconPause) {
      dom.mobileMiniIconPause.hidden = !isPlaying;
      dom.mobileMiniIconPause.style.display = isPlaying ? 'block' : 'none';
    }
    if (dom.mobileMiniArtworkWrap) {
      dom.mobileMiniArtworkWrap.classList.toggle('spinning', isPlaying);
    }

    // Mobile Full-Screen Modal
    if (dom.btnModalPlayPause) {
      dom.btnModalPlayPause.classList.toggle('is-playing', isPlaying);
      dom.btnModalPlayPause.title = isPlaying ? 'Jeda' : 'Putar';
    }
    if (dom.modalIconPlay) {
      dom.modalIconPlay.hidden = isPlaying;
      dom.modalIconPlay.style.display = isPlaying ? 'none' : 'block';
    }
    if (dom.modalIconPause) {
      dom.modalIconPause.hidden = !isPlaying;
      dom.modalIconPause.style.display = isPlaying ? 'block' : 'none';
    }
    if (dom.modalDiscWrap) {
      dom.modalDiscWrap.classList.toggle('spinning', isPlaying);
    }

    // Desktop Now Playing View
    if (dom.btnWebNpPlayPause) {
      dom.btnWebNpPlayPause.classList.toggle('is-playing', isPlaying);
      dom.btnWebNpPlayPause.title = isPlaying ? 'Jeda' : 'Putar';
    }
    if (dom.webNpIconPlay) {
      dom.webNpIconPlay.hidden = isPlaying;
      dom.webNpIconPlay.style.display = isPlaying ? 'none' : 'block';
    }
    if (dom.webNpIconPause) {
      dom.webNpIconPause.hidden = !isPlaying;
      dom.webNpIconPause.style.display = isPlaying ? 'block' : 'none';
    }
    if (dom.webDiscWrap) {
      dom.webDiscWrap.classList.toggle('spinning', isPlaying);
    }
  }

  function updateLikeButton() {
    if (!state.currentTrack) return;
    const liked = isLiked(state.currentTrack.id);
    if (dom.btnPlayerLike) {
      dom.btnPlayerLike.classList.toggle('liked', liked);
      dom.btnPlayerLike.title = liked ? 'Hapus dari Liked' : 'Suka lagu ini';
    }
    if (dom.btnModalLike) {
      dom.btnModalLike.classList.toggle('liked', liked);
      dom.btnModalLike.title = liked ? 'Hapus dari Liked' : 'Suka lagu ini';
    }
    if (dom.btnWebNpLike) {
      dom.btnWebNpLike.classList.toggle('liked', liked);
      dom.btnWebNpLike.title = liked ? 'Hapus dari Liked' : 'Suka lagu ini';
    }
  }

  function startProgressUpdater() {
    stopProgressUpdater();
    state.progressInterval = setInterval(() => {
      if (!state.player || !state.player.getCurrentTime) return;
      const current = state.player.getCurrentTime();
      const duration = state.player.getDuration() || state.currentTrack?.duration || 1;
      const pct = (current / duration) * 100;

      // Desktop
      if (dom.progressFill) dom.progressFill.style.width = `${pct}%`;
      if (dom.progressHandle) dom.progressHandle.style.left = `${pct}%`;
      if (dom.playerCurrentTime) dom.playerCurrentTime.textContent = formatTime(current);

      if (duration && dom.playerDuration && dom.playerDuration.textContent === '0:00') {
        dom.playerDuration.textContent = formatTime(duration);
      }

      // Mobile Modal
      if (dom.modalProgressFill) dom.modalProgressFill.style.width = `${pct}%`;
      if (dom.modalProgressHandle) dom.modalProgressHandle.style.left = `${pct}%`;
      if (dom.modalCurrentTime) dom.modalCurrentTime.textContent = formatTime(current);
      if (duration && dom.modalDuration && dom.modalDuration.textContent === '0:00') {
        dom.modalDuration.textContent = formatTime(duration);
      }

      // Desktop Now Playing View
      if (dom.webNpProgressFill) dom.webNpProgressFill.style.width = `${pct}%`;
      if (dom.webNpProgressHandle) dom.webNpProgressHandle.style.left = `${pct}%`;
      if (dom.webNpCurrentTime) dom.webNpCurrentTime.textContent = formatTime(current);
      if (duration && dom.webNpDuration && dom.webNpDuration.textContent === '0:00') {
        dom.webNpDuration.textContent = formatTime(duration);
      }
    }, 250);
  }

  function stopProgressUpdater() {
    clearInterval(state.progressInterval);
    state.progressInterval = null;
  }

  // ─── Modal Open / Close Helpers (Screen 3) ───────────────────
  function openNowPlayingModal() {
    if (!dom.modalNowPlaying) return;
    dom.modalNowPlaying.classList.add('active');
    dom.modalNowPlaying.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeNowPlayingModal() {
    if (!dom.modalNowPlaying) return;
    dom.modalNowPlaying.classList.remove('active');
    dom.modalNowPlaying.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // ─── Artist Data & Profile Helpers ───────────────────────────
  function getArtistData(name, optionalTrack) {
    if (!name) name = 'Artis Pilihan';
    const cleanName = name.split(/\s+(?:feat\.|ft\.|&|,|\/)\s+/i)[0].trim();
    const key = cleanName.toLowerCase();

    // Pool all known tracks to find matching tracks by this artist
    const allTracksPool = [
      ...Object.values(RECOMMENDATIONS_DATA).flat(),
      ...(state.liked || []),
      ...(state.queue || []),
      ...(optionalTrack ? [optionalTrack] : [])
    ];

    const matchingTracks = [];
    const seenIds = new Set();
    allTracksPool.forEach((t) => {
      if (t && t.id && !seenIds.has(t.id)) {
        if (t.artist.toLowerCase().includes(key) || key.includes(t.artist.toLowerCase())) {
          seenIds.add(t.id);
          matchingTracks.push(t);
        }
      }
    });

    if (ARTIST_DATABASE[key]) {
      const dbEntry = { ...ARTIST_DATABASE[key] };
      if (matchingTracks.length < 5) {
        const fallbacks = (RECOMMENDATIONS_DATA.top_indo || []).concat(RECOMMENDATIONS_DATA.global_hits || []).slice(0, 6);
        fallbacks.forEach((f) => {
          if (!seenIds.has(f.id) && matchingTracks.length < 6) {
            seenIds.add(f.id);
            matchingTracks.push({ ...f, artist: dbEntry.name });
          }
        });
      }
      dbEntry.tracks = matchingTracks;
      if (optionalTrack && optionalTrack.thumb && !dbEntry.banner) {
        dbEntry.banner = optionalTrack.thumb;
      }
      return dbEntry;
    }

    // Dynamic procedural generator for any other artist
    let hash = 0;
    for (let i = 0; i < cleanName.length; i++) {
      hash = (hash << 5) - hash + cleanName.charCodeAt(i);
      hash |= 0;
    }
    const seed = Math.abs(hash);
    const millions = (seed % 40) + 3;
    const thousands = (seed % 899) + 100;
    const hundreds = (seed % 899) + 100;
    const listenersFormatted = `${millions}.${thousands}.${hundreds}`;
    const rankNum = (seed % 80) + 10;
    const followersFormatted = `${(seed % 15) + 1}.${seed % 9}M`;

    if (matchingTracks.length < 5) {
      const pool = (RECOMMENDATIONS_DATA.top_indo || []).concat(RECOMMENDATIONS_DATA.global_hits || []);
      pool.forEach((f) => {
        if (matchingTracks.length < 6 && !seenIds.has(f.id)) {
          seenIds.add(f.id);
          matchingTracks.push({
            ...f,
            title: matchingTracks.length === 0 && optionalTrack ? optionalTrack.title : f.title,
            artist: cleanName,
            thumb: optionalTrack?.thumb || f.thumb
          });
        }
      });
    }

    const defaultBanner = optionalTrack?.thumb || matchingTracks[0]?.thumb || 'https://i.ytimg.com/vi/WKZO-CWeOVA/hqdefault.jpg';

    return {
      name: cleanName,
      verified: true,
      monthlyListeners: listenersFormatted,
      followers: followersFormatted,
      rank: `#${rankNum} di Dunia`,
      banner: defaultBanner,
      bio: `${cleanName} adalah musisi dengan karya lagu yang telah didengarkan jutaan kali di berbagai platform musik digital global. Menghadirkan warna musik khas dengan aransemen modern dan jutaan pendengar aktif.`,
      writer: cleanName,
      producer: 'Playtify Music Production',
      albums: [
        { title: `${cleanName} (The Collection)`, year: '2024', type: 'Album', thumb: defaultBanner },
        { title: 'Live Session & Akustik', year: '2023', type: 'EP', thumb: defaultBanner },
        { title: 'Hits Populer Terpilih', year: '2024', type: 'Single', thumb: defaultBanner }
      ],
      related: ['Bernadya', 'Billie Eilish', 'Bruno Mars', 'Hindia', 'Juicy Luicy'],
      tracks: matchingTracks
    };
  }

  function isArtistFollowed(name) {
    if (!name) return false;
    const list = state.followedArtists || [];
    return list.some((a) => a.toLowerCase() === name.toLowerCase());
  }

  function toggleFollowArtist(name) {
    if (!name) return;
    state.followedArtists = state.followedArtists || [];
    const idx = state.followedArtists.findIndex((a) => a.toLowerCase() === name.toLowerCase());
    if (idx >= 0) {
      state.followedArtists.splice(idx, 1);
      toast(`Berhenti mengikuti ${name}`);
    } else {
      state.followedArtists.push(name);
      toast(`Mulai mengikuti ${name}`);
    }
    localStorage.setItem('playtify_followed_artists', JSON.stringify(state.followedArtists));
    updateArtistFollowUI(name);
  }

  function updateArtistFollowUI(name) {
    const isFollowed = isArtistFollowed(name);
    if (dom.btnArtistFollow) {
      dom.btnArtistFollow.classList.toggle('following', isFollowed);
      const span = dom.btnArtistFollow.querySelector('span');
      if (span) span.textContent = isFollowed ? 'MENGIKUTI' : 'IKUTI';
    }
    if (dom.btnWebNpFollowArtist) {
      dom.btnWebNpFollowArtist.classList.toggle('following', isFollowed);
      dom.btnWebNpFollowArtist.textContent = isFollowed ? 'MENGIKUTI' : 'IKUTI';
    }
  }

  function openArtistProfile(artistName, optionalTrack) {
    if (!artistName) return;
    state.currentArtist = getArtistData(artistName, optionalTrack);
    state.artistExpandedTracks = false;
    state.artistDiscoFilter = 'all';

    closeNowPlayingModal();
    switchView('artist');
    renderArtistView();
  }

  function renderArtistView() {
    const artist = state.currentArtist;
    if (!artist) {
      switchView('home');
      return;
    }

    if (dom.artistStickyName) dom.artistStickyName.textContent = artist.name;
    if (dom.artistName) dom.artistName.textContent = artist.name;
    if (dom.artistMonthlyListeners) dom.artistMonthlyListeners.textContent = `${artist.monthlyListeners} pendengar bulanan`;
    if (dom.artistHeroBg) {
      dom.artistHeroBg.style.backgroundImage = `url("${artist.banner || 'https://i.ytimg.com/vi/WKZO-CWeOVA/hqdefault.jpg'}")`;
    }

    updateArtistFollowUI(artist.name);
    renderArtistPopularTracks();
    renderArtistDiscography(state.artistDiscoFilter || 'all');
    renderArtistRelated();

    if (dom.artistAboutBg) {
      dom.artistAboutBg.style.backgroundImage = `url("${artist.banner || 'https://i.ytimg.com/vi/WKZO-CWeOVA/hqdefault.jpg'}")`;
    }
    if (dom.artistAboutRank) dom.artistAboutRank.textContent = artist.rank || '#12 di Dunia';
    if (dom.artistAboutName) dom.artistAboutName.textContent = `Tentang ${artist.name}`;
    if (dom.artistAboutBio) dom.artistAboutBio.textContent = artist.bio;
    if (dom.artistStatFollowers) dom.artistStatFollowers.textContent = artist.followers;
    if (dom.artistStatListeners) dom.artistStatListeners.textContent = artist.monthlyListeners;

    if (dom.btnArtistMoreTracks) {
      dom.btnArtistMoreTracks.textContent = state.artistExpandedTracks ? 'Tampilkan lebih sedikit' : 'Tampilkan lebih banyak';
    }
  }

  function renderArtistPopularTracks() {
    if (!dom.artistPopularTracks || !state.currentArtist) return;
    const tracks = state.currentArtist.tracks || [];
    const limit = state.artistExpandedTracks ? 10 : 5;
    const displayTracks = tracks.slice(0, limit);

    dom.artistPopularTracks.innerHTML = displayTracks
      .map((t, idx) => {
        const isCurrentPlaying = state.currentTrack?.id === t.id;
        const playCount = (Math.floor(950000000 - idx * 78000000 + (t.duration || 180) * 1000)).toLocaleString('id-ID');
        return `
        <div class="track-row track-table-row ${isCurrentPlaying ? 'playing' : ''}" data-id="${t.id}" data-index="${idx}">
          <div class="row-index-wrap">
            <span class="track-row-index">${idx + 1}</span>
            <button class="icon-btn row-play-btn" title="Putar" aria-label="Putar ${escHtml(t.title)}" data-play-track-index="${idx}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            </button>
          </div>
          <div class="track-main-info" data-play-track-index="${idx}" style="cursor: pointer;">
            <div class="track-thumb">
              <img src="${escHtml(t.thumb)}" alt="" loading="lazy">
            </div>
            <div class="track-info">
              <p class="track-title">${escHtml(t.title)}</p>
              <p class="track-artist">${escHtml(t.artist)}</p>
            </div>
          </div>
          <div style="font-size: 0.8rem; color: var(--text-muted); font-variant-numeric: tabular-nums; display: flex; align-items: center; justify-content: flex-end; padding-right: 16px;">
            ${playCount}
          </div>
          <div class="track-actions">
            <button class="icon-btn btn-like-track ${isLiked(t.id) ? 'liked' : ''}" data-like-id="${t.id}" title="Suka" aria-label="Suka">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="${isLiked(t.id) ? 'var(--accent)' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </button>
            <span class="track-duration">${formatTime(t.duration)}</span>
          </div>
        </div>
      `;
      })
      .join('');

    dom.artistPopularTracks.querySelectorAll('[data-play-track-index]').forEach((el) => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.dataset.playTrackIndex, 10);
        const selected = displayTracks[idx];
        if (selected) {
          playTrack(selected);
          state.queue = tracks.filter((t) => t.id !== selected.id);
          renderQueue();
        }
      });
    });

    dom.artistPopularTracks.querySelectorAll('[data-like-id]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.likeId;
        const track = tracks.find((t) => t.id === id);
        if (track) {
          toggleLike(track);
          btn.classList.toggle('liked', isLiked(id));
          const svg = btn.querySelector('svg');
          if (svg) svg.setAttribute('fill', isLiked(id) ? 'var(--accent)' : 'none');
        }
      });
    });
  }

  function renderArtistDiscography(filter) {
    if (!dom.artistDiscographyGrid || !state.currentArtist) return;
    const albums = state.currentArtist.albums || [];
    const filtered = filter === 'all' ? albums : albums.filter((a) => a.type.toLowerCase() === filter.toLowerCase());

    dom.artistDiscographyGrid.innerHTML = filtered
      .map(
        (alb) => `
      <div class="shelf-card" style="cursor: pointer;" data-disco-title="${escHtml(alb.title)}">
        <div class="track-card-thumb" style="border-radius: 8px;">
          <img src="${escHtml(alb.thumb)}" alt="${escHtml(alb.title)}" loading="lazy">
          <button class="track-card-play" title="Putar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg>
          </button>
        </div>
        <p class="track-card-title">${escHtml(alb.title)}</p>
        <p class="track-card-artist">${escHtml(alb.year)} • ${escHtml(alb.type)}</p>
      </div>
    `
      )
      .join('');

    dom.artistDiscographyGrid.querySelectorAll('[data-disco-title]').forEach((card) => {
      card.addEventListener('click', () => {
        if (state.currentArtist?.tracks?.length) {
          playTrack(state.currentArtist.tracks[0]);
          toast(`Memutar rilis "${card.dataset.discoTitle}"`);
        }
      });
    });
  }

  function renderArtistRelated() {
    if (!dom.artistRelatedGrid || !state.currentArtist) return;
    const relatedNames = state.currentArtist.related || ['Bernadya', 'Billie Eilish', 'Bruno Mars', 'Hindia'];

    dom.artistRelatedGrid.innerHTML = relatedNames
      .map((name) => {
        const relData = getArtistData(name);
        return `
        <div class="artist-circle-card" data-rel-artist="${escHtml(relData.name)}">
          <div class="artist-circle-avatar">
            <img src="${escHtml(relData.banner)}" alt="${escHtml(relData.name)}" loading="lazy">
          </div>
          <p class="artist-circle-name">${escHtml(relData.name)}</p>
          <span class="artist-circle-role">Artis</span>
        </div>
      `;
      })
      .join('');

    dom.artistRelatedGrid.querySelectorAll('[data-rel-artist]').forEach((card) => {
      card.addEventListener('click', () => {
        const name = card.dataset.relArtist;
        if (name) openArtistProfile(name);
      });
    });
  }

  // ─── Desktop Now Playing View Helpers ────────────────────────
  function updateWebNowPlayingUI() {
    const t = state.currentTrack;
    if (!t) {
      if (dom.webNpTitle) dom.webNpTitle.textContent = 'Belum ada lagu yang diputar';
      if (dom.webNpArtist) {
        const span = dom.webNpArtist.querySelector('span');
        if (span) span.textContent = 'Pilih lagu dari Beranda atau Cari';
      }
      if (dom.webDiscThumb) dom.webDiscThumb.src = '';
      if (dom.webNpDuration) dom.webNpDuration.textContent = '0:00';
      if (dom.webNpAlbumTag) dom.webNpAlbumTag.textContent = 'Playtify Music';
      renderWebNowPlayingQueue();
      return;
    }

    if (dom.webNpTitle) dom.webNpTitle.textContent = t.title;
    if (dom.webNpArtist) {
      const span = dom.webNpArtist.querySelector('span');
      if (span) span.textContent = t.artist;
    }
    if (dom.webNpAlbumTag) dom.webNpAlbumTag.textContent = t.album || 'Audio Resmi YouTube';
    if (dom.webDiscThumb) {
      dom.webDiscThumb.src = t.thumb;
      dom.webDiscThumb.alt = t.title;
    }
    if (dom.webNpDuration) dom.webNpDuration.textContent = formatTime(t.duration);

    // Get artist data for Now Playing cards
    const artistData = getArtistData(t.artist, t);

    // Card 1: Tentang Artis
    if (dom.webNpArtistCardName) dom.webNpArtistCardName.textContent = artistData.name;
    if (dom.webNpArtistListeners) dom.webNpArtistListeners.textContent = `${artistData.monthlyListeners} pendengar bulanan`;
    if (dom.webNpArtistBio) dom.webNpArtistBio.textContent = artistData.bio;
    if (dom.webNpArtistCardBg) {
      dom.webNpArtistCardBg.style.backgroundImage = `url("${artistData.banner || t.thumb}")`;
    }
    updateArtistFollowUI(artistData.name);

    // Card 2: More tracks by artist
    renderWebNowPlayingArtistTracks(artistData, t);

    // Card 3: Lyrics
    if (dom.webLyrics1 && dom.webLyrics2 && dom.webLyrics3) {
      dom.webLyrics1.textContent = 'Memutar dari YouTube:';
      dom.webLyrics2.textContent = `"${t.title}"`;
      dom.webLyrics3.textContent = `oleh ${t.artist}`;
    }

    // Card 4: Queue
    renderWebNowPlayingQueue();

    // Card 5: Credits
    if (dom.webNpCreditArtist) dom.webNpCreditArtist.textContent = t.artist;
    if (dom.webNpCreditWriter) dom.webNpCreditWriter.textContent = artistData.writer || t.artist;
    if (dom.webNpCreditProducer) dom.webNpCreditProducer.textContent = artistData.producer || 'Official Label Record';
    if (dom.webNpCreditSource) dom.webNpCreditSource.textContent = 'YouTube Audio Engine (Official)';

    if (dom.btnWebNpLike) {
      dom.btnWebNpLike.classList.toggle('liked', isLiked(t.id));
    }
  }

  function renderWebNowPlayingArtistTracks(artistData, currentTrack) {
    if (!dom.webNpArtistTracksList) return;
    const tracks = (artistData.tracks || []).filter((item) => item.id !== currentTrack.id).slice(0, 4);
    if (!tracks.length) {
      dom.webNpArtistTracksList.innerHTML = `
        <div style="padding: 12px; text-align: center; color: var(--text-muted); font-size: 0.8rem;">
          Tidak ada lagu tambahan dari artis ini dalam antrian.
        </div>
      `;
      return;
    }

    dom.webNpArtistTracksList.innerHTML = tracks
      .map(
        (track) => `
      <div class="web-np-artist-track-item" data-track-id="${track.id}">
        <div style="display: flex; align-items: center; gap: 10px; min-width: 0;">
          <div style="width: 36px; height: 36px; border-radius: 4px; overflow: hidden; flex-shrink: 0; background: #222;">
            <img src="${escHtml(track.thumb)}" alt="${escHtml(track.title)}" style="width: 100%; height: 100%; object-fit: cover; transform: scale(1.36);">
          </div>
          <div style="min-width: 0;">
            <p style="font-size: 0.85rem; font-weight: 600; color: #fff; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escHtml(track.title)}</p>
            <p style="font-size: 0.74rem; color: var(--text-muted); margin: 2px 0 0;">${formatTime(track.duration)}</p>
          </div>
        </div>
        <button class="btn-text small" style="color: var(--accent); font-weight: 700; cursor: pointer; flex-shrink: 0;" data-play-artist-track="${track.id}">Putar</button>
      </div>
    `
      )
      .join('');

    dom.webNpArtistTracksList.querySelectorAll('[data-play-artist-track]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.playArtistTrack;
        const target = tracks.find((item) => item.id === id);
        if (target) playTrack(target);
      });
    });
  }

  function renderWebNowPlayingQueue() {
    if (!dom.webNpQueueList) return;
    if (!state.queue || state.queue.length === 0) {
      dom.webNpQueueList.innerHTML = `
        <div style="padding: 20px; text-align: center; color: var(--text-muted); font-size: 0.84rem;">
          Antrian kosong. Pilih lagu dari rekomendasi untuk ditambahkan ke antrian.
        </div>
      `;
      return;
    }
    const nextTracks = state.queue.slice(0, 5);
    dom.webNpQueueList.innerHTML = nextTracks
      .map(
        (t, idx) => `
      <div class="web-queue-item" data-index="${idx}" style="cursor: pointer; display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-radius: 8px; background: rgba(255,255,255,0.03); margin-bottom: 6px; transition: background 0.15s ease;">
        <div style="display: flex; align-items: center; gap: 12px; min-width: 0;">
          <div style="width: 40px; height: 40px; border-radius: 6px; overflow: hidden; flex-shrink: 0; background: #222;">
            <img src="${escHtml(t.thumb)}" alt="${escHtml(t.title)}" style="width: 100%; height: 100%; object-fit: cover; transform: scale(1.36);">
          </div>
          <div style="min-width: 0;">
            <p style="font-size: 0.88rem; font-weight: 600; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin: 0;">${escHtml(t.title)}</p>
            <p style="font-size: 0.76rem; color: var(--text-muted); margin: 3px 0 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escHtml(t.artist)}</p>
          </div>
        </div>
        <button class="btn-text small" style="color: var(--accent); font-weight: 700; font-size: 0.8rem; flex-shrink: 0; cursor: pointer;" data-play-index="${idx}">Putar</button>
      </div>
    `
      )
      .join('');

    dom.webNpQueueList.querySelectorAll('[data-play-index]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(btn.dataset.playIndex, 10);
        const track = state.queue.splice(index, 1)[0];
        if (track) playTrack(track);
      });
    });
  }

  // ─── Player Controls Binding ────────────────────────────────
  dom.btnPlayPause.addEventListener('click', togglePlayPause);
  dom.btnNext.addEventListener('click', playNext);
  dom.btnPrev.addEventListener('click', playPrev);

  dom.btnShuffle.addEventListener('click', () => {
    state.isShuffle = !state.isShuffle;
    dom.btnShuffle.classList.toggle('active', state.isShuffle);
    if (dom.btnModalShuffle) {
      dom.btnModalShuffle.classList.toggle('active', state.isShuffle);
    }
    if (dom.btnWebNpShuffle) {
      dom.btnWebNpShuffle.classList.toggle('active', state.isShuffle);
    }
    toast(state.isShuffle ? 'Shuffle aktif' : 'Shuffle nonaktif');
  });

  dom.btnRepeat.addEventListener('click', () => {
    state.repeatMode = (state.repeatMode + 1) % 3;
    dom.btnRepeat.classList.toggle('active', state.repeatMode > 0);
    const labels = ['Repeat nonaktif', 'Repeat semua', 'Repeat satu'];
    toast(labels[state.repeatMode]);
  });

  // Desktop Progress bar seek
  dom.progressBar.addEventListener('click', (e) => {
    if (!state.currentTrack || !state.ytReady) return;
    const rect = dom.progressBar.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    const duration = state.player.getDuration?.() || 0;
    if (duration) state.player.seekTo(pct * duration, true);
  });

  // Desktop Web Now Playing Progress bar seek
  if (dom.webNpProgressBar) {
    dom.webNpProgressBar.addEventListener('click', (e) => {
      if (!state.currentTrack || !state.ytReady) return;
      const rect = dom.webNpProgressBar.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const duration = state.player?.getDuration?.() || 0;
      if (duration) state.player.seekTo(pct * duration, true);
    });
  }

  // Mobile Modal Progress bar seek
  if (dom.modalProgressBar) {
    dom.modalProgressBar.addEventListener('click', (e) => {
      if (!state.currentTrack || !state.ytReady) return;
      const rect = dom.modalProgressBar.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const duration = state.player?.getDuration?.() || 0;
      if (duration) state.player.seekTo(pct * duration, true);
    });
  }

  // Desktop Now Playing View Controls
  if (dom.btnBackNowPlaying) {
    dom.btnBackNowPlaying.addEventListener('click', () => {
      switchView(state.previousView || 'home');
    });
  }
  if (dom.btnWebNpPlayPause) {
    dom.btnWebNpPlayPause.addEventListener('click', togglePlayPause);
  }
  if (dom.btnWebNpNext) {
    dom.btnWebNpNext.addEventListener('click', playNext);
  }
  if (dom.btnWebNpPrev) {
    dom.btnWebNpPrev.addEventListener('click', playPrev);
  }
  if (dom.btnWebNpShuffle) {
    dom.btnWebNpShuffle.addEventListener('click', () => {
      dom.btnShuffle.click();
    });
  }
  if (dom.btnWebNpLike) {
    dom.btnWebNpLike.addEventListener('click', () => {
      if (state.currentTrack) toggleLike(state.currentTrack);
    });
  }
  if (dom.btnWebNpAddPlaylist) {
    dom.btnWebNpAddPlaylist.addEventListener('click', () => {
      if (state.currentTrack) showAddToPlaylistModal(state.currentTrack);
    });
  }
  if (dom.btnWebNpViewAllQueue) {
    dom.btnWebNpViewAllQueue.addEventListener('click', () => {
      switchView('queue');
    });
  }
  if (dom.btnPlayerNowPlaying) {
    dom.btnPlayerNowPlaying.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        openNowPlayingModal();
      } else {
        switchView('now-playing');
      }
    });
  }
  if (dom.playerTrackInfo) {
    dom.playerTrackInfo.addEventListener('click', (e) => {
      if (e.target.closest('#btn-player-like')) return;
      if (e.target.closest('#player-artist') || e.target.closest('.clickable-artist')) {
        if (state.currentTrack) {
          openArtistProfile(state.currentTrack.artist, state.currentTrack);
          return;
        }
      }
      if (window.innerWidth <= 768) {
        openNowPlayingModal();
      } else {
        switchView('now-playing');
      }
    });
  }
  if (dom.playerThumbWrap) {
    dom.playerThumbWrap.addEventListener('click', (e) => {
      e.stopPropagation();
      if (window.innerWidth <= 768) {
        openNowPlayingModal();
      } else {
        switchView('now-playing');
      }
    });
  }

  // Enhanced Now Playing Artist Actions
  if (dom.webNpArtist) {
    dom.webNpArtist.addEventListener('click', () => {
      if (state.currentTrack) {
        openArtistProfile(state.currentTrack.artist, state.currentTrack);
      }
    });
  }
  if (dom.btnWebNpViewArtist) {
    dom.btnWebNpViewArtist.addEventListener('click', () => {
      if (state.currentTrack) {
        openArtistProfile(state.currentTrack.artist, state.currentTrack);
      }
    });
  }
  if (dom.btnWebNpMoreArtistTracks) {
    dom.btnWebNpMoreArtistTracks.addEventListener('click', () => {
      if (state.currentTrack) {
        openArtistProfile(state.currentTrack.artist, state.currentTrack);
      }
    });
  }
  if (dom.btnWebNpFollowArtist) {
    dom.btnWebNpFollowArtist.addEventListener('click', () => {
      if (state.currentTrack) {
        toggleFollowArtist(state.currentTrack.artist);
      }
    });
  }

  // Artist Profile View Controls
  if (dom.btnBackArtist) {
    dom.btnBackArtist.addEventListener('click', () => {
      switchView(state.previousView || 'home');
    });
  }
  if (dom.btnArtistPlayAll) {
    dom.btnArtistPlayAll.addEventListener('click', () => {
      if (state.currentArtist?.tracks?.length) {
        const tracks = [...state.currentArtist.tracks];
        playTrack(tracks[0]);
        state.queue = tracks.slice(1);
        renderQueue();
        toast(`Memutar lagu populer dari ${state.currentArtist.name}`);
      }
    });
  }
  if (dom.btnArtistShuffle) {
    dom.btnArtistShuffle.addEventListener('click', () => {
      if (state.currentArtist?.tracks?.length) {
        const shuffled = [...state.currentArtist.tracks].sort(() => Math.random() - 0.5);
        playTrack(shuffled[0]);
        state.queue = shuffled.slice(1);
        renderQueue();
        toast(`Memutar acak lagu dari ${state.currentArtist.name}`);
      }
    });
  }
  if (dom.btnArtistFollow) {
    dom.btnArtistFollow.addEventListener('click', () => {
      if (state.currentArtist) {
        toggleFollowArtist(state.currentArtist.name);
      }
    });
  }
  if (dom.btnArtistMoreTracks) {
    dom.btnArtistMoreTracks.addEventListener('click', () => {
      state.artistExpandedTracks = !state.artistExpandedTracks;
      dom.btnArtistMoreTracks.textContent = state.artistExpandedTracks ? 'Tampilkan lebih sedikit' : 'Tampilkan lebih banyak';
      renderArtistPopularTracks();
    });
  }
  if (dom.artistDiscographyTabs) {
    dom.artistDiscographyTabs.querySelectorAll('.disco-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        dom.artistDiscographyTabs.querySelectorAll('.disco-tab').forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        state.artistDiscoFilter = tab.dataset.type || 'all';
        renderArtistDiscography(state.artistDiscoFilter);
      });
    });
  }

  // Sticky header name and global artist click delegation
  const mainContentContainer = document.getElementById('main-content');
  if (mainContentContainer) {
    mainContentContainer.addEventListener('scroll', () => {
      if (state.currentView === 'artist' && dom.artistStickyName) {
        dom.artistStickyName.classList.toggle('visible', mainContentContainer.scrollTop > 240);
      }
    });

    mainContentContainer.addEventListener('click', (e) => {
      const artistEl = e.target.closest('.clickable-artist, [data-artist]');
      if (artistEl) {
        e.stopPropagation();
        const artistName = artistEl.dataset.artist || artistEl.textContent.trim();
        if (artistName && artistName !== 'Playtify' && artistName !== 'Playtify Music') {
          openArtistProfile(artistName);
        }
      }
    });
  }

  // Mobile Mini Player Bindings (Screen 2)
  if (dom.mobileMiniExpandBtn) {
    dom.mobileMiniExpandBtn.addEventListener('click', openNowPlayingModal);
  }
  if (dom.mobileMiniArtworkWrap) {
    dom.mobileMiniArtworkWrap.addEventListener('click', openNowPlayingModal);
  }
  if (dom.btnMobileMiniPlayPause) {
    dom.btnMobileMiniPlayPause.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePlayPause();
    });
  }
  if (dom.btnMobileMiniNext) {
    dom.btnMobileMiniNext.addEventListener('click', (e) => {
      e.stopPropagation();
      playNext();
    });
  }

  // Mobile Full-Screen Modal Controls (Screen 3)
  if (dom.btnCollapseNowPlaying) {
    dom.btnCollapseNowPlaying.addEventListener('click', closeNowPlayingModal);
  }
  if (dom.btnModalPlayPause) {
    dom.btnModalPlayPause.addEventListener('click', togglePlayPause);
  }
  if (dom.btnModalNext) {
    dom.btnModalNext.addEventListener('click', playNext);
  }
  if (dom.btnModalPrev) {
    dom.btnModalPrev.addEventListener('click', playPrev);
  }
  if (dom.btnModalShuffle) {
    dom.btnModalShuffle.addEventListener('click', () => {
      dom.btnShuffle.click();
    });
  }
  if (dom.btnModalLike) {
    dom.btnModalLike.addEventListener('click', () => {
      if (state.currentTrack) {
        toggleLike(state.currentTrack);
      }
    });
  }
  if (dom.btnModalQueue) {
    dom.btnModalQueue.addEventListener('click', () => {
      closeNowPlayingModal();
      toggleQueueSidebar(true);
    });
  }

  // Volume
  dom.volumeBar.addEventListener('click', (e) => {
    const rect = dom.volumeBar.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    state.volume = pct;
    localStorage.setItem('playtify_volume', pct.toString());
    if (state.player) state.player.setVolume(pct * 100);
    dom.volumeFill.style.width = `${pct * 100}%`;
    dom.volumeHandle.style.left = `${pct * 100}%`;
    updateVolumeIcon();
  });

  dom.btnVolume.addEventListener('click', () => {
    if (state.volume > 0) {
      state._prevVolume = state.volume;
      state.volume = 0;
    } else {
      state.volume = state._prevVolume || 0.8;
    }
    if (state.player) state.player.setVolume(state.volume * 100);
    dom.volumeFill.style.width = `${state.volume * 100}%`;
    dom.volumeHandle.style.left = `${state.volume * 100}%`;
    localStorage.setItem('playtify_volume', state.volume.toString());
    updateVolumeIcon();
  });

  function updateVolumeIcon() {
    dom.iconVolHigh.hidden = state.volume === 0;
    dom.iconVolMute.hidden = state.volume !== 0;
  }

  // ─── Player Bar Extra Controls (Right Queue Sidebar & Rekomendasi Drawer) ─
  function toggleQueueSidebar(forceState) {
    if (!dom.queueSidebar) return;
    const isOpen = dom.queueSidebar.classList.contains('open');
    const shouldOpen = forceState !== undefined ? forceState : !isOpen;

    if (shouldOpen) {
      if (dom.playerRecDrawer) dom.playerRecDrawer.hidden = true;
      if (dom.btnPlayerRec) dom.btnPlayerRec.classList.remove('active');

      renderQueueSidebar();
      dom.queueSidebar.classList.add('open');
      if (dom.btnPlayerQueue) dom.btnPlayerQueue.classList.add('active');
      const queueDock = $('#dock-btn-queue');
      if (queueDock) queueDock.classList.add('active');
    } else {
      dom.queueSidebar.classList.remove('open');
      if (dom.btnPlayerQueue) dom.btnPlayerQueue.classList.remove('active');
      const queueDock = $('#dock-btn-queue');
      if (queueDock) queueDock.classList.remove('active');
    }
  }

  function renderQueueSidebar() {
    if (!dom.queueSidebar) return;

    const hasCurrent = !!state.currentTrack;
    const hasQueue = state.queue.length > 0;
    const totalCount = (hasCurrent ? 1 : 0) + state.queue.length;

    if (dom.queueSidebarCount) {
      dom.queueSidebarCount.textContent = `${totalCount} lagu`;
    }

    if (dom.btnClearSidebarQueue) {
      dom.btnClearSidebarQueue.hidden = !hasQueue;
      dom.btnClearSidebarQueue.style.display = hasQueue ? 'block' : 'none';
    }

    if (dom.sidebarQueueNowPlaying) {
      dom.sidebarQueueNowPlaying.hidden = !hasCurrent;
      dom.sidebarQueueNowPlaying.style.display = hasCurrent ? 'block' : 'none';
      if (hasCurrent) {
        dom.sidebarQueueCurrent.innerHTML = sidebarTrackItemHTML(state.currentTrack, 'now-playing');
        bindSidebarTrackItems(dom.sidebarQueueCurrent);
      }
    }

    if (dom.sidebarQueueNext) {
      dom.sidebarQueueNext.hidden = !hasQueue;
      dom.sidebarQueueNext.style.display = hasQueue ? 'block' : 'none';
      if (hasQueue) {
        dom.sidebarQueueList.innerHTML = state.queue
          .map((t, idx) => sidebarTrackItemHTML(t, 'queue', idx))
          .join('');
        bindSidebarTrackItems(dom.sidebarQueueList);
      }
    }

    if (dom.sidebarQueueEmpty) {
      const showEmpty = !hasCurrent && !hasQueue;
      dom.sidebarQueueEmpty.hidden = !showEmpty;
      dom.sidebarQueueEmpty.style.display = showEmpty ? 'flex' : 'none';
    }

    renderSidebarSuggestions();
  }

  function renderSidebarSuggestions(shuffle = false) {
    if (!dom.sidebarSuggestionsList) return;
    const pool = RECOMMENDATIONS_DATA.top_indo || [];
    const currentId = state.currentTrack?.id;
    const queueIds = new Set(state.queue.map((t) => t.id));
    let candidates = pool.filter((t) => t.id !== currentId && !queueIds.has(t.id));

    if (shuffle) {
      candidates = candidates.sort(() => Math.random() - 0.5);
    }
    const picks = candidates.slice(0, 5);

    dom.sidebarSuggestionsList.innerHTML = picks
      .map((t) => sidebarTrackItemHTML(t, 'suggestion'))
      .join('');
    bindSidebarTrackItems(dom.sidebarSuggestionsList);
  }

  function sidebarTrackItemHTML(track, type, index = 0) {
    const isPlaying = type === 'now-playing';
    return `
      <div class="sidebar-track-item ${isPlaying ? 'playing' : ''}" data-id="${track.id}" data-title="${escHtml(track.title)}" data-artist="${escHtml(track.artist)}" data-thumb="${escHtml(track.thumb)}" data-duration="${track.duration}" data-queue-idx="${index}">
        <div class="sidebar-track-thumb">
          <img src="${escHtml(track.thumb)}" alt="" loading="lazy">
          <div class="sidebar-track-overlay">
            ${isPlaying && state.isPlaying
              ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>'
              : '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>'
            }
          </div>
        </div>
        <div class="sidebar-track-meta">
          <p class="sidebar-track-title">${escHtml(track.title)}</p>
          <p class="sidebar-track-artist">${escHtml(track.artist)}</p>
        </div>
        <div class="sidebar-track-actions">
          ${type === 'queue' ? `
            <button class="icon-btn btn-remove-queue" title="Hapus dari antrian" aria-label="Hapus dari antrian">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          ` : type === 'suggestion' ? `
            <button class="icon-btn btn-add-queue" title="Tambah ke antrian" aria-label="Tambah ke antrian">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
          ` : `
            <button class="icon-btn btn-like-track ${isLiked(track.id) ? 'liked' : ''}" title="Suka" aria-label="Suka">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="${isLiked(track.id) ? 'var(--accent)' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </button>
          `}
        </div>
      </div>
    `;
  }

  function bindSidebarTrackItems(container) {
    container.querySelectorAll('.sidebar-track-item').forEach((item) => {
      item.addEventListener('click', (e) => {
        const track = trackFromElement(item);
        if (e.target.closest('.btn-remove-queue')) {
          e.stopPropagation();
          const qIdx = parseInt(item.dataset.queueIdx, 10);
          if (!isNaN(qIdx) && qIdx >= 0 && qIdx < state.queue.length) {
            state.queue.splice(qIdx, 1);
            renderQueueSidebar();
            toast('Dihapus dari antrian');
          }
          return;
        }

        if (e.target.closest('.btn-add-queue')) {
          e.stopPropagation();
          state.queue.push({ ...track });
          renderQueueSidebar();
          toast(`"${track.title}" ditambahkan ke antrian`);
          return;
        }

        if (e.target.closest('.btn-like-track')) {
          e.stopPropagation();
          toggleLike(track);
          renderQueueSidebar();
          return;
        }

        playTrack(track);
      });
    });
  }

  if (dom.btnPlayerQueue) {
    dom.btnPlayerQueue.addEventListener('click', () => {
      toggleQueueSidebar();
    });
  }

  if (dom.btnCloseQueueSidebar) {
    dom.btnCloseQueueSidebar.addEventListener('click', () => {
      toggleQueueSidebar(false);
    });
  }

  if (dom.btnClearSidebarQueue) {
    dom.btnClearSidebarQueue.addEventListener('click', () => {
      state.queue = [];
      renderQueueSidebar();
      toast('Antrian dikosongkan');
    });
  }

  if (dom.btnRefreshSidebarSuggestions) {
    dom.btnRefreshSidebarSuggestions.addEventListener('click', () => {
      renderSidebarSuggestions(true);
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (dom.queueSidebar && dom.queueSidebar.classList.contains('open')) {
        toggleQueueSidebar(false);
      }
      if (dom.playerRecDrawer && !dom.playerRecDrawer.hidden) {
        dom.playerRecDrawer.hidden = true;
      }
    }
  });

  if (dom.btnPlayerRec) {
    dom.btnPlayerRec.addEventListener('click', () => {
      togglePlayerRecDrawer();
    });
  }

  if (dom.btnCloseRecDrawer) {
    dom.btnCloseRecDrawer.addEventListener('click', () => {
      if (dom.playerRecDrawer) dom.playerRecDrawer.hidden = true;
    });
  }

  function togglePlayerRecDrawer() {
    if (!dom.playerRecDrawer) return;
    const isHidden = dom.playerRecDrawer.hidden;
    if (isHidden) {
      renderPlayerRecDrawer();
      dom.playerRecDrawer.hidden = false;
    } else {
      dom.playerRecDrawer.hidden = true;
    }
  }

  function renderPlayerRecDrawer() {
    if (!dom.recDrawerList) return;
    const current = state.currentTrack;
    if (!current) {
      dom.recDrawerContext.textContent = 'Putar lagu untuk melihat rekomendasi serupa';
      dom.recDrawerList.innerHTML = '<p class="subtitle" style="padding: 16px; text-align: center;">Belum ada lagu yang diputar</p>';
      return;
    }

    dom.recDrawerContext.textContent = `Berdasarkan "${current.title}" oleh ${current.artist}`;

    const allTracks = Object.values(RECOMMENDATIONS_DATA).flat();
    const otherTracks = allTracks.filter((t) => t.id !== current.id);
    const shuffled = [...otherTracks].sort(() => 0.5 - Math.random()).slice(0, 5);

    dom.recDrawerList.innerHTML = shuffled
      .map(
        (t) => `
      <div class="rec-drawer-item" data-id="${t.id}" data-title="${escHtml(t.title)}" data-artist="${escHtml(t.artist)}" data-thumb="${escHtml(t.thumb)}" data-duration="${t.duration}">
        <div class="rec-drawer-thumb">
          <img src="${escHtml(t.thumb)}" alt="" loading="lazy">
        </div>
        <div class="rec-drawer-info">
          <p class="rec-drawer-name">${escHtml(t.title)}</p>
          <p class="rec-drawer-artist">${escHtml(t.artist)}</p>
        </div>
        <button class="rec-drawer-add" title="Tambah ke antrian">+ Queue</button>
      </div>
    `
      )
      .join('');

    dom.recDrawerList.querySelectorAll('.rec-drawer-item').forEach((item) => {
      item.addEventListener('click', (e) => {
        const track = trackFromElement(item);
        if (e.target.closest('.rec-drawer-add')) {
          e.stopPropagation();
          state.queue.push(track);
          if (dom.queueSidebar && dom.queueSidebar.classList.contains('open')) {
            renderQueueSidebar();
          }
          toast(`"${track.title}" ditambahkan ke queue`);
          return;
        }
        playTrack(track);
      });
    });
  }

  // ─── Like ───────────────────────────────────────────────────
  function toggleLike(track) {
    const idx = state.liked.findIndex((t) => t.id === track.id);
    if (idx >= 0) {
      state.liked.splice(idx, 1);
      toast('Dihapus dari Liked Songs');
    } else {
      state.liked.unshift({ ...track });
      toast('Ditambahkan ke Liked Songs');
    }
    saveLiked();
    updateLikeButton();
    updateForYouShelf();
  }

  dom.btnPlayerLike.addEventListener('click', () => {
    if (state.currentTrack) {
      toggleLike(state.currentTrack);
      refreshCurrentView();
    }
  });

  // ─── Context Menu ───────────────────────────────────────────
  function showContextMenu(e, track, source) {
    e.preventDefault();
    e.stopPropagation();
    state.contextTarget = track;
    state.contextSource = source;

    const playlistOnly = dom.contextMenu.querySelectorAll('.ctx-playlist-only');
    playlistOnly.forEach((el) => {
      el.hidden = source !== 'playlist-user';
    });

    const likeItem = dom.contextMenu.querySelector('[data-action="like"]');
    likeItem.textContent = isLiked(track.id) ? 'Hapus dari Liked' : 'Suka';

    dom.contextMenu.hidden = false;

    const menuRect = dom.contextMenu.getBoundingClientRect();
    let x = e.clientX;
    let y = e.clientY;
    if (x + menuRect.width > window.innerWidth) x = window.innerWidth - menuRect.width - 8;
    if (y + menuRect.height > window.innerHeight) y = window.innerHeight - menuRect.height - 8;

    dom.contextMenu.style.left = `${x}px`;
    dom.contextMenu.style.top = `${y}px`;
  }

  dom.contextMenu.querySelectorAll('.ctx-item').forEach((item) => {
    item.addEventListener('click', () => {
      const action = item.dataset.action;
      const track = state.contextTarget;
      if (!track) return;

      switch (action) {
        case 'play':
          playTrack(track);
          break;
        case 'play-next':
          state.queue.unshift({ ...track });
          if (dom.queueSidebar && dom.queueSidebar.classList.contains('open')) {
            renderQueueSidebar();
          }
          toast('Akan diputar selanjutnya');
          break;
        case 'add-queue':
          state.queue.push({ ...track });
          if (dom.queueSidebar && dom.queueSidebar.classList.contains('open')) {
            renderQueueSidebar();
          }
          toast('Ditambahkan ke queue');
          break;
        case 'like':
          toggleLike(track);
          refreshCurrentView();
          break;
        case 'add-playlist':
          showAddToPlaylistModal(track);
          break;
        case 'remove-from-playlist': {
          const pl = state.playlists.find((p) => p.id === state.currentPlaylistId);
          if (pl) {
            pl.tracks = pl.tracks.filter((t) => t.id !== track.id);
            savePlaylists();
            openPlaylist(pl.id);
            toast('Dihapus dari playlist');
          }
          break;
        }
      }

      dom.contextMenu.hidden = true;
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('#player-rec-drawer') && !e.target.closest('#btn-player-rec') && !e.target.closest('#mobile-notification-btn')) {
      if (dom.playerRecDrawer && !dom.playerRecDrawer.hidden) {
        dom.playerRecDrawer.hidden = true;
      }
    }
    dom.contextMenu.hidden = true;
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dom.contextMenu.hidden = true;
      if (dom.playerRecDrawer) dom.playerRecDrawer.hidden = true;
      closeAllModals();
    }
  });

  // ─── Modals ─────────────────────────────────────────────────
  function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.hidden = false;
  }

  function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.hidden = true;
  }

  function closeAllModals() {
    $$('.modal').forEach((m) => (m.hidden = true));
  }

  $$('[data-close-modal]').forEach((btn) => {
    btn.addEventListener('click', () => closeModal(btn.dataset.closeModal));
  });

  dom.inputBrandName.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') dom.btnSaveBrand.click();
  });
  dom.inputPlaylistName.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') dom.btnSavePlaylist.click();
  });

  // ─── Keyboard Shortcuts ─────────────────────────────────────
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.contentEditable === 'true') return;

    if (e.code === 'Space') {
      e.preventDefault();
      togglePlayPause();
    }
  });

  // ─── Refresh Helper ─────────────────────────────────────────
  function refreshCurrentView() {
    switch (state.currentView) {
      case 'liked':
        renderLiked();
        break;
      case 'queue':
        renderQueue();
        break;
      case 'playlist-detail':
        if (state.currentCuratedPlaylistId) {
          openPlaylist(state.currentCuratedPlaylistId);
        } else if (state.currentPlaylistId) {
          openPlaylist(state.currentPlaylistId);
        }
        break;
    }

    const currentId = state.currentTrack?.id;

    $$('.quick-mix-card').forEach((card) => {
      const isCardPlaying = card.querySelector('img')?.src.includes(currentId);
      card.classList.toggle('playing', !!isCardPlaying);
    });

    $$('.track-card').forEach((card) => {
      card.classList.toggle('playing', card.dataset.id === currentId);
    });

    $$('.track-row').forEach((row) => {
      row.classList.toggle('playing', row.dataset.id === currentId);
    });
  }

  // ─── Mobile Layout & PWA Init ──────────────────────────────
  function initMobileFeatures() {
    // Top header avatar -> Edit Brand modal
    if (dom.mobileAvatarBtn) {
      dom.mobileAvatarBtn.addEventListener('click', () => {
        openModal('modal-brand');
      });
    }

    // Modal artist button in Screen 3
    if (dom.modalTrackArtist) {
      dom.modalTrackArtist.addEventListener('click', () => {
        if (state.currentTrack) {
          closeNowPlayingModal();
          openArtistProfile(state.currentTrack.artist, state.currentTrack);
        }
      });
    }

    // Floating mini player artist click
    const mobileMiniArtist = document.getElementById('mobile-mini-artist');
    if (mobileMiniArtist) {
      mobileMiniArtist.classList.add('clickable-artist');
      mobileMiniArtist.addEventListener('click', (e) => {
        e.stopPropagation();
        if (state.currentTrack) {
          openArtistProfile(state.currentTrack.artist, state.currentTrack);
        }
      });
    }

    // Top header notification pill -> Quick Recommendations Drawer
    if (dom.mobileNotificationBtn) {
      dom.mobileNotificationBtn.addEventListener('click', () => {
        togglePlayerRecDrawer();
      });
    }

    // Modal notification pill in Screen 3
    const modalNotifBtn = document.getElementById('modal-notification-btn');
    if (modalNotifBtn) {
      modalNotifBtn.addEventListener('click', () => {
        closeNowPlayingModal();
        togglePlayerRecDrawer();
      });
    }

    // Top header heart button
    if (dom.btnMobileTopLiked) {
      dom.btnMobileTopLiked.addEventListener('click', () => {
        switchView('liked');
      });
    }

    // Curated & Trending card actions
    const featuredPlaylist = (typeof CURATED_PLAYLISTS !== 'undefined' && CURATED_PLAYLISTS[0]) ? CURATED_PLAYLISTS[0] : null;
    const featuredTrack = featuredPlaylist?.tracks?.[0] || RECOMMENDATIONS_DATA.top_indo?.[0];

    if (dom.btnMobileCuratedPlay) {
      dom.btnMobileCuratedPlay.addEventListener('click', () => {
        if (featuredPlaylist && featuredPlaylist.tracks.length > 0) {
          state.queue = featuredPlaylist.tracks.slice(1);
          playTrack(featuredPlaylist.tracks[0]);
          toast(`Memutar ${featuredPlaylist.name}`);
        } else if (featuredTrack) {
          playTrack(featuredTrack);
        }
      });
    }

    if (dom.btnMobileCuratedLike) {
      dom.btnMobileCuratedLike.addEventListener('click', () => {
        if (featuredTrack) {
          toggleLike(featuredTrack);
          const isL = isLiked(featuredTrack.id);
          dom.btnMobileCuratedLike.classList.toggle('liked', isL);
        }
      });
    }

    if (dom.btnMobileCuratedQueue) {
      dom.btnMobileCuratedQueue.addEventListener('click', () => {
        if (featuredTrack) {
          state.queue.push({ ...featuredTrack });
          toast(`"${featuredTrack.title}" ditambahkan ke antrian`);
          renderQueue();
          renderQueueSidebar();
        }
      });
    }

    if (dom.btnMobileSeeAllCurated) {
      dom.btnMobileSeeAllCurated.addEventListener('click', () => {
        if (featuredPlaylist) {
          openPlaylist(featuredPlaylist.id);
        } else {
          switchView('search');
        }
      });
    }

    // Filter pills (All, New Release, Trending, Top Sc)
    if (dom.mobileFilterPills) {
      dom.mobileFilterPills.forEach((pill) => {
        pill.addEventListener('click', () => {
          dom.mobileFilterPills.forEach((p) => p.classList.remove('active'));
          pill.classList.add('active');
          const filter = pill.dataset.filter;

          const targetMap = {
            all: '#shelf-playlists',
            new: '#shelf-for-you',
            trending: '#shelf-top_indo',
            top: '#shelf-global_hits'
          };
          const targetEl = $(targetMap[filter] || '#shelf-playlists');
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      });
    }
  }

  // ─── PWA Service Worker Registration ────────────────────────
  function initServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('Playtify Service Worker registered with scope:', registration.scope);
          })
          .catch((error) => {
            console.warn('Service Worker registration failed:', error);
          });
      });
    }
  }

  // ─── Init ───────────────────────────────────────────────────
  function init() {
    initBrand();
    initRecommendations();
    initSearchRecommendations();
    renderPlaylistSidebar();
    loadYTApi();
    initMobileFeatures();
    initServiceWorker();

    // Set initial volume UI
    dom.volumeFill.style.width = `${state.volume * 100}%`;
    dom.volumeHandle.style.left = `${state.volume * 100}%`;
    updateVolumeIcon();
  }

  init();
})();
