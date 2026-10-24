export interface LyricLine {
  time: number; // in seconds
  text: string;
}

export interface SongLyrics {
  id: string;
  themeColor: string;
  lines: LyricLine[];
}

export const LYRICS_DATABASE: Record<string, SongLyrics> = {
  // Satu Bulan - Bernadya
  'z-XHpftdXEE': {
    id: 'z-XHpftdXEE',
    themeColor: 'linear-gradient(180deg, #3d2348 0%, #170d1c 100%)',
    lines: [
      { time: 0, text: '♪ (Intro) ♪' },
      { time: 10, text: 'Belum ada satu bulan' },
      { time: 14, text: 'Ku yakin kau masih ada di sekitar sini' },
      { time: 20, text: 'Mungkin di kamar sebelah' },
      { time: 24, text: 'Atau sedang di jalan pulang' },
      { time: 30, text: 'Belum ada satu bulan' },
      { time: 35, text: 'Ku masih hafal aroma bajumu' },
      { time: 42, text: 'Yang kau tinggalkan di kursi kamarku' },
      { time: 50, text: 'Bagaimana bisa kau secepat itu lupa?' },
      { time: 58, text: 'Dengan semua malam yang kita lalui' },
      { time: 66, text: 'Bercerita hingga fajar tiba' },
      { time: 74, text: 'Sementara aku masih di sini' },
      { time: 80, text: 'Menghitung hari sejak kau pergi' },
      { time: 88, text: 'Dan menatap layar ponselku' },
      { time: 94, text: 'Menunggu namamu muncul kembali' },
      { time: 102, text: 'Belum ada satu bulan' },
      { time: 108, text: 'Tapi kau tampak begitu bahagia' },
      { time: 116, text: 'Seolah aku tak pernah ada di hidupmu' },
      { time: 126, text: '♪ (Solo Gitar) ♪' },
      { time: 142, text: 'Sementara aku masih di sini' },
      { time: 150, text: 'Menghitung hari sejak kau pergi' },
      { time: 160, text: 'Semoga harimu selalu menyenangkan' },
      { time: 170, text: 'Walau tanpa aku di sampingmu lagi' },
      { time: 185, text: 'Belum ada satu bulan...' },
    ],
  },

  // Hati-Hati di Jalan - Tulus
  'E7kHvjvU6JY': {
    id: 'E7kHvjvU6JY',
    themeColor: 'linear-gradient(180deg, #1b3d2f 0%, #0c1a14 100%)',
    lines: [
      { time: 0, text: '♪ (Intro piano) ♪' },
      { time: 12, text: 'Perjalanan membawamu' },
      { time: 18, text: 'Bertemu denganku' },
      { time: 24, text: 'Ku bertemu kamu' },
      { time: 30, text: 'Sepertimu yang kucari' },
      { time: 36, text: 'Konon aku juga seperti yang kaucari' },
      { time: 44, text: 'Kukira kita asam dan garam' },
      { time: 51, text: 'Dan kita bertemu di belanga' },
      { time: 58, text: 'Kisah yang ternyata tak seindah itu' },
      { time: 66, text: 'Kukira kita akan bersama' },
      { time: 74, text: 'Begitu banyak yang sama' },
      { time: 80, text: 'Latarmu dan latarku' },
      { time: 86, text: 'Kukira takkan ada kendala' },
      { time: 94, text: 'Kukira ini kan mudah' },
      { time: 100, text: 'Kau aku jadi kita' },
      { time: 108, text: 'Kasih sayangmu membekas' },
      { time: 114, text: 'Redam kini sudah pijar istimewa' },
      { time: 122, text: 'Entah apa maksud dunia' },
      { time: 128, text: 'Tentang ujung cerita kita tak bersama' },
      { time: 138, text: 'Semoga ada lain hari' },
      { time: 145, text: 'Untuk kita saling bertatap kembali' },
      { time: 154, text: 'Kukira kita kan bersama' },
      { time: 162, text: 'Hati-hati di jalan' },
      { time: 172, text: 'Hati-hati di jalan...' },
    ],
  },

  // BIRDS OF A FEATHER - Billie Eilish
  'WKZO-CWeOVA': {
    id: 'WKZO-CWeOVA',
    themeColor: 'linear-gradient(180deg, #1d3354 0%, #0d1829 100%)',
    lines: [
      { time: 0, text: '♪ (Upbeat guitar strum) ♪' },
      { time: 9, text: 'I want you to stay' },
      { time: 14, text: "'Til I'm in the grave" },
      { time: 18, text: "'Til I rot away, dead and buried" },
      { time: 24, text: "'Til I'm in the casket you carry" },
      { time: 29, text: 'If you go, I\'m going too, uh' },
      { time: 34, text: "'Cause it was always you, alright" },
      { time: 39, text: 'And if I\'m turning blue, please don\'t save me' },
      { time: 44, text: "Nothing left to lose without my baby" },
      { time: 49, text: "Birds of a feather, we should stick together" },
      { time: 54, text: "I know, I said I'd never think I wasn't better alone" },
      { time: 60, text: "Can't change the weather, might not be forever" },
      { time: 65, text: "But if it's forever, it's even better" },
      { time: 72, text: "And I don't know what I'm crying for" },
      { time: 77, text: "I don't think I could love you more" },
      { time: 83, text: "It might not be long, but baby, I..." },
      { time: 90, text: "I'll love you 'til the day that I die" },
      { time: 98, text: "'Til the day that I die" },
      { time: 104, text: "'Til the light leaves my eyes" },
      { time: 110, text: "'Til the day that I die" },
    ],
  },

  // Die With A Smile - Lady Gaga & Bruno Mars
  'DlFXDl_ROAM': {
    id: 'DlFXDl_ROAM',
    themeColor: 'linear-gradient(180deg, #421820 0%, #1c0a0e 100%)',
    lines: [
      { time: 0, text: '♪ (Vintage electric guitar intro) ♪' },
      { time: 12, text: 'I, I just woke up from a dream' },
      { time: 17, text: 'Where you and I had to say goodbye' },
      { time: 23, text: 'And I don\'t know what it all means' },
      { time: 29, text: 'But since I survived, I realized' },
      { time: 35, text: 'Wherever you go, that\'s where I\'ll follow' },
      { time: 42, text: 'Nobody\'s promised tomorrow' },
      { time: 47, text: 'So I\'ma love you every night like it\'s the last night' },
      { time: 54, text: 'Like it\'s the last night' },
      { time: 58, text: 'If the world was ending, I\'d wanna be next to you' },
      { time: 67, text: 'If the party was over and our time on Earth was through' },
      { time: 76, text: 'I\'d wanna hold you just for a while' },
      { time: 82, text: 'And die with a smile' },
      { time: 88, text: 'If the world was ending, I\'d wanna be next to you' },
      { time: 98, text: 'Ooh, lost, lost in the words that we scream' },
      { time: 105, text: 'I don\'t even wanna fight no more' },
      { time: 112, text: '\'Cause some of them kind and some of them mean' },
      { time: 118, text: 'None of it matters when you walk out that door' },
      { time: 126, text: 'If the world was ending, I\'d wanna be next to you' },
    ],
  },

  // Gala bunga matahari - Sal Priadi
  'lABZ_-uhC0E': {
    id: 'lABZ_-uhC0E',
    themeColor: 'linear-gradient(180deg, #403215 0%, #1a1407 100%)',
    lines: [
      { time: 0, text: '♪ (Akustik petikan lembut) ♪' },
      { time: 10, text: 'Mungkinkah, mungkinkah kau mampir hari ini?' },
      { time: 20, text: 'Bila tidak mirip wajahmu' },
      { time: 26, text: 'Suaramu saja cukup bagiku' },
      { time: 34, text: 'Kuharap kabar burung itu benar' },
      { time: 42, text: 'Bahwa di sana kau tak kesepian' },
      { time: 50, text: 'Ada sungai jernih dan taman bunga mekar' },
      { time: 58, text: 'Dan kau bisa tertawa lepas tanpa beban' },
      { time: 68, text: 'Terbangkanlah salamku ini' },
      { time: 76, text: 'Lewat angin sore yang membelai' },
      { time: 84, text: 'Mekar mekar di sana' },
      { time: 90, text: 'Gala bunga matahari' },
      { time: 98, text: 'Bungaku yang indah di surga sana...' },
    ],
  },

  // Lantas - Juicy Luicy
  'M4YpWWj_IWs': {
    id: 'M4YpWWj_IWs',
    themeColor: 'linear-gradient(180deg, #38251e 0%, #170e0a 100%)',
    lines: [
      { time: 0, text: '♪ (Intro pop santai) ♪' },
      { time: 10, text: 'Kala cinta datang memanggil' },
      { time: 16, text: 'Mengapa kau masih saja ragu' },
      { time: 22, text: 'Melihat senyummu dari kejauhan' },
      { time: 30, text: 'Ku tahu ada luka yang kau simpan' },
      { time: 38, text: 'Lantas mengapa ku masih menaruh hati' },
      { time: 46, text: 'Pada dirimu yang sudah bersamanya' },
      { time: 54, text: 'Biar ku simpan rasa ini dalam hening' },
      { time: 64, text: 'Menjadi saksi bahagia yang kau pilih' },
    ],
  },

  // Dan... - Sheila On 7
  'k1BfsO0mxWQ': {
    id: 'k1BfsO0mxWQ',
    themeColor: 'linear-gradient(180deg, #2b1f3d 0%, #110c18 100%)',
    lines: [
      { time: 0, text: '♪ (Melodi gitar pop rock legendaris) ♪' },
      { time: 14, text: 'Dan... bila esok datang kembali' },
      { time: 23, text: 'Seperti sediakala di mana kau bisa bercanda' },
      { time: 32, text: 'Dan... perlahan kau pun lupakan aku' },
      { time: 41, text: 'Mimpi burukmu di mana t\'lah kutancapkan duri tajam' },
      { time: 50, text: 'Kau pungkiri semua kata manis yang kau ucap' },
      { time: 59, text: 'Caci maki saja diriku bila itu bisa membuatmu' },
      { time: 68, text: 'Kembali tersenyum seperti dulu lagi' },
      { time: 77, text: 'Dan... lupakanlah aku' },
      { time: 86, text: 'Relakanlah aku pergi jauh...' },
    ],
  },

  // Super Shy - NewJeans
  '0c7zGU2C2mM': {
    id: '0c7zGU2C2mM',
    themeColor: 'linear-gradient(180deg, #441732 0%, #1c0814 100%)',
    lines: [
      { time: 0, text: '♪ (Jersey club beat) ♪' },
      { time: 6, text: "I'm super shy, super shy" },
      { time: 11, text: "But wait a minute while I make you mine, make you mine" },
      { time: 16, text: "Tteollineun jigeumdo you're on my mind all the time" },
      { time: 21, text: "I wanna tell you but I'm super shy, super shy" },
      { time: 28, text: "And I wanna go out with you" },
      { time: 32, text: "Where you wanna go? Find a lil spot, just sit and talk" },
      { time: 38, text: "Looking for excuses just to say hello" },
      { time: 43, text: "'Cause I'm super shy, super shy" },
    ],
  },

  // Blinding Lights - The Weeknd
  'J7p4bzqLvCw': {
    id: 'J7p4bzqLvCw',
    themeColor: 'linear-gradient(180deg, #441416 0%, #1a0607 100%)',
    lines: [
      { time: 0, text: '♪ (80s Synthwave riff) ♪' },
      { time: 14, text: "Yeah..." },
      { time: 18, text: "I've been tryna call" },
      { time: 22, text: "I've been on my own for long enough" },
      { time: 27, text: "Maybe you can show me how to love, maybe" },
      { time: 34, text: "I'm going through withdrawals" },
      { time: 39, text: "You don't even have to do too much" },
      { time: 43, text: "You can turn me on with just a touch, baby" },
      { time: 50, text: "I look around and Sin City's cold and empty" },
      { time: 55, text: "No one's around to judge me" },
      { time: 59, text: "I can't see clearly when you're gone" },
      { time: 65, text: "I said, ooh, I'm blinded by the lights" },
      { time: 73, text: "No, I can't sleep until I feel your touch" },
      { time: 81, text: "I said, ooh, I'm drowning in the night" },
      { time: 89, text: "Oh, when I'm like this, you're the one I trust" },
    ],
  },
};

/**
 * Returns lyrics for any track ID. If not in curated database,
 * generates dynamic flowing rhythm verses so every song has full Spotify lyrics.
 */
export function getLyricsForTrack(trackId: string, trackTitle?: string, artistName?: string): SongLyrics {
  if (trackId && LYRICS_DATABASE[trackId]) {
    return LYRICS_DATABASE[trackId];
  }

  const title = trackTitle || 'Melodi Musik';
  const artist = artistName || 'Artis Terverifikasi';

  return {
    id: trackId || 'generic',
    themeColor: 'linear-gradient(180deg, #2b1f3d 0%, #0d0b13 100%)',
    lines: [
      { time: 0, text: `♪ (Memutar lagu "${title}") ♪` },
      { time: 12, text: `Alunan melodi khas dari ${artist}` },
      { time: 24, text: 'Mengalun lembut di keheningan malam' },
      { time: 36, text: `Setiap nada merangkai cerita dalam ${title}` },
      { time: 48, text: 'Membawa rasa dan nostalgia yang tak lekang waktu' },
      { time: 60, text: 'Hanyut dalam denting irama yang penuh makna' },
      { time: 75, text: `♪ Melodi indah oleh ${artist} ♪` },
      { time: 90, text: 'Terus berdendang menemani setiap langkah hari' },
      { time: 105, text: 'Kala ingatan kembali pada saat pertama mendengar' },
      { time: 120, text: 'Semua rasa bercampur menjadi satu harmoni' },
      { time: 138, text: `♪ ${title} - ${artist} ♪` },
      { time: 155, text: 'Menutup bait dengan kehangatan nada abadi' },
    ],
  };
}
