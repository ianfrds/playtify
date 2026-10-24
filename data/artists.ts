import { ArtistProfile, Track } from '@/types';
import { ALL_RECOMMENDATIONS_POOL, RECOMMENDATIONS_DATA } from './recommendations';

export const ARTIST_DATABASE: Record<string, Omit<ArtistProfile, 'tracks'>> = {
  'bernadya': {
    id: 'bernadya',
    name: 'Bernadya',
    verified: true,
    monthlyListeners: '14.821.503',
    followers: '6.2M',
    rank: '#1 di Indonesia',
    banner: 'https://i.ytimg.com/vi/z-XHpftdXEE/hqdefault.jpg',
    coverImage: 'https://i.ytimg.com/vi/z-XHpftdXEE/hqdefault.jpg',
    avatar: 'https://i.ytimg.com/vi/z-XHpftdXEE/hqdefault.jpg',
    bio: 'Penyanyi dan penulis lagu muda berbakat asal Surabaya, Indonesia. Sukses memecahkan rekor streaming tertinggi di Indonesia lewat album debut "Sialnya, Hidup Harus Tetap Berjalan" dengan lagu-lagu patah hati yang jujur dan menyentuh kalbu jutaan pendengar.',
    writer: 'Bernadya Ribka',
    producer: 'Rendy Pandugo',
    albums: [
      { id: 'shhtb', title: 'Sialnya, Hidup Harus Tetap Berjalan', year: '2024', type: 'Album', thumb: 'https://i.ytimg.com/vi/z-XHpftdXEE/hqdefault.jpg', cover: 'https://i.ytimg.com/vi/z-XHpftdXEE/hqdefault.jpg' },
      { id: 'sb', title: 'Satu Bulan', year: '2024', type: 'Single', thumb: 'https://i.ytimg.com/vi/z-XHpftdXEE/hqdefault.jpg', cover: 'https://i.ytimg.com/vi/z-XHpftdXEE/hqdefault.jpg' },
      { id: 'terlintas', title: 'Terlintas', year: '2023', type: 'EP', thumb: 'https://i.ytimg.com/vi/z-XHpftdXEE/hqdefault.jpg', cover: 'https://i.ytimg.com/vi/z-XHpftdXEE/hqdefault.jpg' },
    ],
    related: ['Nadin Amizah', 'Sal Priadi', 'Hindia', 'Juicy Luicy', 'Mahalini', 'Tulus'],
    popularTracks: [
      {
        id: 'HB8vftGxsIc',
        title: 'Untungnya, Hidup Harus Tetap Berjalan',
        artist: 'Bernadya',
        duration: 184,
        thumb: 'https://i.ytimg.com/vi/HB8vftGxsIc/hqdefault.jpg',
        thumbnail: 'https://i.ytimg.com/vi/HB8vftGxsIc/hqdefault.jpg',
        badge: 'POP INDONESIA',
        artistId: 'bernadya',
        album: 'Sialnya, Hidup Harus Tetap Berjalan',
      },
      {
        id: 'z-XHpftdXEE',
        title: 'Satu Bulan',
        artist: 'Bernadya',
        duration: 201,
        thumb: 'https://i.ytimg.com/vi/z-XHpftdXEE/hqdefault.jpg',
        thumbnail: 'https://i.ytimg.com/vi/z-XHpftdXEE/hqdefault.jpg',
        badge: 'POP INDONESIA',
        artistId: 'bernadya',
        album: 'Sialnya, Hidup Harus Tetap Berjalan',
      },
      {
        id: '9hjMIOIysng',
        title: 'Kini Mereka Tahu',
        artist: 'Bernadya',
        duration: 219,
        thumb: 'https://i.ytimg.com/vi/9hjMIOIysng/hqdefault.jpg',
        thumbnail: 'https://i.ytimg.com/vi/9hjMIOIysng/hqdefault.jpg',
        badge: 'POP INDONESIA',
        artistId: 'bernadya',
        album: 'Sialnya, Hidup Harus Tetap Berjalan',
      },
    ],
  },
  'tulus': {
    id: 'tulus',
    name: 'Tulus',
    verified: true,
    monthlyListeners: '8.840.100',
    followers: '8.4M',
    rank: '#3 di Indonesia',
    banner: 'https://i.ytimg.com/vi/E7kHvjvU6JY/hqdefault.jpg',
    coverImage: 'https://i.ytimg.com/vi/E7kHvjvU6JY/hqdefault.jpg',
    avatar: 'https://i.ytimg.com/vi/E7kHvjvU6JY/hqdefault.jpg',
    bio: 'Solois dan pencipta lagu pop jazz legendaris asal Bukittinggi. Menghadirkan karya-karya orisinal dengan diksi bahasa Indonesia yang anggun, puitis, dan melodi yang abadi melintasi generasi.',
    writer: 'Muhammad Tulus',
    producer: 'Ari Renaldi',
    albums: [
      { id: 'manusia', title: 'Manusia', year: '2022', type: 'Album', thumb: 'https://i.ytimg.com/vi/E7kHvjvU6JY/hqdefault.jpg', cover: 'https://i.ytimg.com/vi/E7kHvjvU6JY/hqdefault.jpg' },
      { id: 'monokrom', title: 'Monokrom', year: '2016', type: 'Album', thumb: 'https://i.ytimg.com/vi/E7kHvjvU6JY/hqdefault.jpg', cover: 'https://i.ytimg.com/vi/E7kHvjvU6JY/hqdefault.jpg' },
      { id: 'gajah', title: 'Gajah', year: '2014', type: 'Album', thumb: 'https://i.ytimg.com/vi/E7kHvjvU6JY/hqdefault.jpg', cover: 'https://i.ytimg.com/vi/E7kHvjvU6JY/hqdefault.jpg' },
    ],
    related: ['Bernadya', 'Sal Priadi', 'Nadin Amizah', 'Mahalini', 'Juicy Luicy'],
    popularTracks: [
      {
        id: 'E7kHvjvU6JY',
        title: 'Hati-Hati di Jalan',
        artist: 'Tulus',
        duration: 242,
        thumb: 'https://i.ytimg.com/vi/E7kHvjvU6JY/hqdefault.jpg',
        thumbnail: 'https://i.ytimg.com/vi/E7kHvjvU6JY/hqdefault.jpg',
        badge: 'POP INDONESIA',
        artistId: 'tulus',
        album: 'Manusia',
      },
    ],
  },
  'billie-eilish': {
    id: 'billie-eilish',
    name: 'Billie Eilish',
    verified: true,
    monthlyListeners: '94.215.820',
    followers: '92.4M',
    rank: '#3 di Dunia',
    banner: 'https://i.ytimg.com/vi/WKZO-CWeOVA/hqdefault.jpg',
    coverImage: 'https://i.ytimg.com/vi/WKZO-CWeOVA/hqdefault.jpg',
    avatar: 'https://i.ytimg.com/vi/WKZO-CWeOVA/hqdefault.jpg',
    bio: 'Penyanyi dan penulis lagu pemenang multi-Grammy dan Academy Award asal Los Angeles. Terkenal lewat vokal bisik yang khas, aransemen bass mendalam, dan penulisan lagu eksperimental bersama kakaknya FINNEAS.',
    writer: "Billie Eilish O'Connell & FINNEAS",
    producer: 'FINNEAS',
    albums: [
      { id: 'hmhas', title: 'HIT ME HARD AND SOFT', year: '2024', type: 'Album', thumb: 'https://i.ytimg.com/vi/WKZO-CWeOVA/hqdefault.jpg', cover: 'https://i.ytimg.com/vi/WKZO-CWeOVA/hqdefault.jpg' },
      { id: 'hte', title: 'Happier Than Ever', year: '2021', type: 'Album', thumb: 'https://i.ytimg.com/vi/WKZO-CWeOVA/hqdefault.jpg', cover: 'https://i.ytimg.com/vi/WKZO-CWeOVA/hqdefault.jpg' },
      { id: 'wwafawdwg', title: 'WHEN WE ALL FALL ASLEEP, WHERE DO WE GO?', year: '2019', type: 'Album', thumb: 'https://i.ytimg.com/vi/WKZO-CWeOVA/hqdefault.jpg', cover: 'https://i.ytimg.com/vi/WKZO-CWeOVA/hqdefault.jpg' },
    ],
    related: ['Sabrina Carpenter', 'Lady Gaga', 'The Weeknd', 'Taylor Swift'],
    popularTracks: [
      {
        id: 'WKZO-CWeOVA',
        title: 'BIRDS OF A FEATHER',
        artist: 'Billie Eilish',
        duration: 211,
        thumb: 'https://i.ytimg.com/vi/WKZO-CWeOVA/hqdefault.jpg',
        thumbnail: 'https://i.ytimg.com/vi/WKZO-CWeOVA/hqdefault.jpg',
        badge: 'GLOBAL POP',
        artistId: 'billie-eilish',
        album: 'HIT ME HARD AND SOFT',
      },
    ],
  },
  'sal-priadi': {
    id: 'sal-priadi',
    name: 'Sal Priadi',
    verified: true,
    monthlyListeners: '7.890.400',
    followers: '3.9M',
    rank: '#6 di Indonesia',
    banner: 'https://i.ytimg.com/vi/lABZ_-uhC0E/hqdefault.jpg',
    coverImage: 'https://i.ytimg.com/vi/lABZ_-uhC0E/hqdefault.jpg',
    avatar: 'https://i.ytimg.com/vi/lABZ_-uhC0E/hqdefault.jpg',
    bio: 'Solois dan aktor asal Malang yang memadukan teaterikal dan lirik puitis menyentuh kalbu. Lagu "Gala bunga matahari" menjadi lagu refleksi duka dan kehangatan paling populer di Indonesia.',
    writer: 'Salmantyo Ashrizky Priadi',
    producer: 'Lafa Pratomo & Mahatattwa',
    albums: [
      { id: 'markers', title: 'MARKERS AND SUCH PENS FLASHDISKS', year: '2024', type: 'Album', thumb: 'https://i.ytimg.com/vi/lABZ_-uhC0E/hqdefault.jpg', cover: 'https://i.ytimg.com/vi/lABZ_-uhC0E/hqdefault.jpg' },
      { id: 'berhati', title: 'Berhati', year: '2020', type: 'Album', thumb: 'https://i.ytimg.com/vi/lABZ_-uhC0E/hqdefault.jpg', cover: 'https://i.ytimg.com/vi/lABZ_-uhC0E/hqdefault.jpg' },
    ],
    related: ['Bernadya', 'Nadin Amizah', 'Hindia', 'Juicy Luicy', 'Tulus'],
    popularTracks: [
      {
        id: 'lABZ_-uhC0E',
        title: 'Gala bunga matahari',
        artist: 'Sal Priadi',
        duration: 210,
        thumb: 'https://i.ytimg.com/vi/lABZ_-uhC0E/hqdefault.jpg',
        thumbnail: 'https://i.ytimg.com/vi/lABZ_-uhC0E/hqdefault.jpg',
        badge: 'POP INDONESIA',
        artistId: 'sal-priadi',
        album: 'MARKERS AND SUCH PENS FLASHDISKS',
      },
    ],
  },
  'juicy-luicy': {
    id: 'juicy-luicy',
    name: 'Juicy Luicy',
    verified: true,
    monthlyListeners: '9.340.800',
    followers: '4.2M',
    rank: '#4 di Indonesia',
    banner: 'https://i.ytimg.com/vi/M4YpWWj_IWs/hqdefault.jpg',
    coverImage: 'https://i.ytimg.com/vi/M4YpWWj_IWs/hqdefault.jpg',
    avatar: 'https://i.ytimg.com/vi/M4YpWWj_IWs/hqdefault.jpg',
    bio: 'Band pop asal Bandung beranggotakan Julian Kaisar, Denis Ligia, Zamzam Y.M, Dwi Nugroho, dan Bina Bagja. Menghadirkan lagu-lagu patah hati santai yang menemani keseharian jutaan pendengar.',
    writer: 'Denis Ligia & Julian Kaisar',
    producer: 'Juicy Luicy Productions',
    albums: [
      { id: 'sentimental', title: 'Sentimental', year: '2020', type: 'Album', thumb: 'https://i.ytimg.com/vi/M4YpWWj_IWs/hqdefault.jpg', cover: 'https://i.ytimg.com/vi/M4YpWWj_IWs/hqdefault.jpg' },
      { id: 'nonbar', title: 'Nonbar', year: '2024', type: 'Album', thumb: 'https://i.ytimg.com/vi/M4YpWWj_IWs/hqdefault.jpg', cover: 'https://i.ytimg.com/vi/M4YpWWj_IWs/hqdefault.jpg' },
    ],
    related: ['Bernadya', 'Mahalini', 'Sal Priadi', 'Sheila On 7', 'Tulus'],
    popularTracks: [
      {
        id: 'M4YpWWj_IWs',
        title: 'Lantas',
        artist: 'Juicy Luicy',
        duration: 235,
        thumb: 'https://i.ytimg.com/vi/M4YpWWj_IWs/hqdefault.jpg',
        thumbnail: 'https://i.ytimg.com/vi/M4YpWWj_IWs/hqdefault.jpg',
        badge: 'POP INDONESIA',
        artistId: 'juicy-luicy',
        album: 'Sentimental',
      },
    ],
  },
  'mahalini': {
    id: 'mahalini',
    name: 'Mahalini',
    verified: true,
    monthlyListeners: '8.120.400',
    followers: '5.4M',
    rank: '#5 di Indonesia',
    banner: 'https://i.ytimg.com/vi/2MyjWg7P00A/hqdefault.jpg',
    coverImage: 'https://i.ytimg.com/vi/2MyjWg7P00A/hqdefault.jpg',
    avatar: 'https://i.ytimg.com/vi/2MyjWg7P00A/hqdefault.jpg',
    bio: 'Penyanyi bervokal kuat dan berkarakter asal Denpasar, Bali. Album "Fábula" menorehkan rekor streaming luar biasa dengan balada cinta yang menyayat hati.',
    writer: 'Ni Luh Ketut Mahalini Ayu Raharja',
    producer: 'Koko Iryawansyah',
    albums: [
      { id: 'fabula', title: 'Fábula', year: '2023', type: 'Album', thumb: 'https://i.ytimg.com/vi/2MyjWg7P00A/hqdefault.jpg', cover: 'https://i.ytimg.com/vi/2MyjWg7P00A/hqdefault.jpg' },
    ],
    related: ['Bernadya', 'Sal Priadi', 'Juicy Luicy', 'Nadin Amizah'],
    popularTracks: [
      {
        id: '2MyjWg7P00A',
        title: 'Sial',
        artist: 'Mahalini',
        duration: 244,
        thumb: 'https://i.ytimg.com/vi/2MyjWg7P00A/hqdefault.jpg',
        thumbnail: 'https://i.ytimg.com/vi/2MyjWg7P00A/hqdefault.jpg',
        badge: 'POP INDONESIA',
        artistId: 'mahalini',
        album: 'Fábula',
      },
    ],
  },
  'nadhif-basalamah': {
    id: 'nadhif-basalamah',
    name: 'Nadhif Basalamah',
    verified: true,
    monthlyListeners: '6.450.200',
    followers: '3.1M',
    rank: '#8 di Indonesia',
    banner: 'https://i.ytimg.com/vi/g6iIVyRfiUk/hqdefault.jpg',
    coverImage: 'https://i.ytimg.com/vi/g6iIVyRfiUk/hqdefault.jpg',
    avatar: 'https://i.ytimg.com/vi/g6iIVyRfiUk/hqdefault.jpg',
    bio: 'Penyanyi dan penulis lagu pop indie asal Jakarta. Lagu "penjaga hati" menjadi viral nasional dan dinyanyikan oleh jutaan orang di Indonesia.',
    writer: 'Nadhif Basalamah',
    producer: 'Petra Sihombing',
    albums: [
      { id: 'penjagahati', title: 'penjaga hati', year: '2023', type: 'Single', thumb: 'https://i.ytimg.com/vi/g6iIVyRfiUk/hqdefault.jpg', cover: 'https://i.ytimg.com/vi/g6iIVyRfiUk/hqdefault.jpg' },
    ],
    related: ['Bernadya', 'Sal Priadi', 'Pamungkas', 'Nadin Amizah'],
    popularTracks: [
      {
        id: 'g6iIVyRfiUk',
        title: 'penjaga hati',
        artist: 'Nadhif Basalamah',
        duration: 261,
        thumb: 'https://i.ytimg.com/vi/g6iIVyRfiUk/hqdefault.jpg',
        thumbnail: 'https://i.ytimg.com/vi/g6iIVyRfiUk/hqdefault.jpg',
        badge: 'POP INDONESIA',
        artistId: 'nadhif-basalamah',
        album: 'penjaga hati',
      },
    ],
  },
  'nadin-amizah': {
    id: 'nadin-amizah',
    name: 'Nadin Amizah',
    verified: true,
    monthlyListeners: '7.120.300',
    followers: '5.1M',
    rank: '#7 di Indonesia',
    banner: 'https://i.ytimg.com/vi/2A9Atl2hUkg/hqdefault.jpg',
    coverImage: 'https://i.ytimg.com/vi/2A9Atl2hUkg/hqdefault.jpg',
    avatar: 'https://i.ytimg.com/vi/2A9Atl2hUkg/hqdefault.jpg',
    bio: 'Penyanyi dan penulis lagu beraliran folk-pop asal Bandung dengan lirik puitis sastra dan nuansa dongeng yang mendalam.',
    writer: 'Nadin Amizah',
    producer: 'Lafa Pratomo',
    albums: [
      { id: 'udck', title: 'Untuk Dunia, Cinta, dan Kotornya', year: '2023', type: 'Album', thumb: 'https://i.ytimg.com/vi/2A9Atl2hUkg/hqdefault.jpg', cover: 'https://i.ytimg.com/vi/2A9Atl2hUkg/hqdefault.jpg' },
      { id: 'sut', title: 'Selamat Ulang Tahun', year: '2020', type: 'Album', thumb: 'https://i.ytimg.com/vi/2A9Atl2hUkg/hqdefault.jpg', cover: 'https://i.ytimg.com/vi/2A9Atl2hUkg/hqdefault.jpg' },
    ],
    related: ['Bernadya', 'Sal Priadi', 'Hindia', 'Tulus'],
    popularTracks: [
      {
        id: '2A9Atl2hUkg',
        title: 'Rayuan Perempuan Gila',
        artist: 'Nadin Amizah',
        duration: 320,
        thumb: 'https://i.ytimg.com/vi/2A9Atl2hUkg/hqdefault.jpg',
        thumbnail: 'https://i.ytimg.com/vi/2A9Atl2hUkg/hqdefault.jpg',
        badge: 'POP INDONESIA',
        artistId: 'nadin-amizah',
        album: 'Untuk Dunia, Cinta, dan Kotornya',
      },
    ],
  },
  'hindia': {
    id: 'hindia',
    name: 'Hindia',
    verified: true,
    monthlyListeners: '8.450.900',
    followers: '4.8M',
    rank: '#5 di Indonesia',
    banner: 'https://i.ytimg.com/vi/_BJpBN9ZReQ/hqdefault.jpg',
    coverImage: 'https://i.ytimg.com/vi/_BJpBN9ZReQ/hqdefault.jpg',
    avatar: 'https://i.ytimg.com/vi/_BJpBN9ZReQ/hqdefault.jpg',
    bio: 'Proyek solo dari Baskara Putra, vokalis .Feast dan Lomba Sihir. Musik Hindia merekam quarter-life crisis, kritik sosial, dan refleksi kesehatan mental generasi urban Indonesia.',
    writer: 'Baskara Putra',
    producer: 'Enrico Octaviano & Kareem Soenharjo',
    albums: [
      { id: 'lhbe', title: 'Lagipula Hidup Akan Berakhir', year: '2023', type: 'Album', thumb: 'https://i.ytimg.com/vi/_BJpBN9ZReQ/hqdefault.jpg', cover: 'https://i.ytimg.com/vi/_BJpBN9ZReQ/hqdefault.jpg' },
      { id: 'mndb', title: 'Menari Dengan Bayangan', year: '2019', type: 'Album', thumb: 'https://i.ytimg.com/vi/_BJpBN9ZReQ/hqdefault.jpg', cover: 'https://i.ytimg.com/vi/_BJpBN9ZReQ/hqdefault.jpg' },
    ],
    related: ['Bernadya', 'Nadin Amizah', 'Sal Priadi', 'Tulus'],
    popularTracks: [
      {
        id: '_BJpBN9ZReQ',
        title: 'Evaluasi',
        artist: 'Hindia',
        duration: 197,
        thumb: 'https://i.ytimg.com/vi/_BJpBN9ZReQ/hqdefault.jpg',
        thumbnail: 'https://i.ytimg.com/vi/_BJpBN9ZReQ/hqdefault.jpg',
        badge: 'INDIE INDO',
        artistId: 'hindia',
        album: 'Menari Dengan Bayangan',
      },
    ],
  },
  'bruno-mars': {
    id: 'bruno-mars',
    name: 'Bruno Mars',
    verified: true,
    monthlyListeners: '118.490.120',
    followers: '56.8M',
    rank: '#1 di Dunia',
    banner: 'https://i.ytimg.com/vi/DlFXDl_ROAM/hqdefault.jpg',
    coverImage: 'https://i.ytimg.com/vi/DlFXDl_ROAM/hqdefault.jpg',
    avatar: 'https://i.ytimg.com/vi/DlFXDl_ROAM/hqdefault.jpg',
    bio: 'Penyanyi, penulis lagu, produser legendaris peraih 15 Grammy Awards asal Hawaii. Menghadirkan lagu-lagu pop, soul, funk pemuncak tangga lagu Billboard Hot 100.',
    writer: 'Bruno Mars, Dernst Emile II',
    producer: "D'Mile & Bruno Mars",
    albums: [
      { id: 'dwas', title: 'Die With A Smile (feat. Lady Gaga)', year: '2024', type: 'Single', thumb: 'https://i.ytimg.com/vi/DlFXDl_ROAM/hqdefault.jpg', cover: 'https://i.ytimg.com/vi/DlFXDl_ROAM/hqdefault.jpg' },
      { id: 'silk', title: 'An Evening with Silk Sonic', year: '2021', type: 'Album', thumb: 'https://i.ytimg.com/vi/DlFXDl_ROAM/hqdefault.jpg', cover: 'https://i.ytimg.com/vi/DlFXDl_ROAM/hqdefault.jpg' },
    ],
    related: ['Lady Gaga', 'The Weeknd', 'Coldplay', 'Taylor Swift'],
    popularTracks: [
      {
        id: 'DlFXDl_ROAM',
        title: 'Die With A Smile',
        artist: 'Lady Gaga & Bruno Mars',
        duration: 252,
        thumb: 'https://i.ytimg.com/vi/DlFXDl_ROAM/hqdefault.jpg',
        thumbnail: 'https://i.ytimg.com/vi/DlFXDl_ROAM/hqdefault.jpg',
        badge: 'GLOBAL POP',
        artistId: 'bruno-mars',
        album: 'Die With A Smile',
      },
    ],
  },
  'lady-gaga': {
    id: 'lady-gaga',
    name: 'Lady Gaga',
    verified: true,
    monthlyListeners: '106.820.400',
    followers: '31.2M',
    rank: '#2 di Dunia',
    banner: 'https://i.ytimg.com/vi/DlFXDl_ROAM/hqdefault.jpg',
    coverImage: 'https://i.ytimg.com/vi/DlFXDl_ROAM/hqdefault.jpg',
    avatar: 'https://i.ytimg.com/vi/DlFXDl_ROAM/hqdefault.jpg',
    bio: 'Ikon pop global, pemenang 13 Grammy Awards dan Academy Award. Dikenal karena musikalitas spektakuler mulai dari dance-pop teatrikal hingga jazz dan balada vokal emosional.',
    writer: 'Stefani Germanotta, Andrew Watt',
    producer: 'Andrew Watt & Lady Gaga',
    albums: [
      { id: 'dwas-gaga', title: 'Die With A Smile (with Bruno Mars)', year: '2024', type: 'Single', thumb: 'https://i.ytimg.com/vi/DlFXDl_ROAM/hqdefault.jpg', cover: 'https://i.ytimg.com/vi/DlFXDl_ROAM/hqdefault.jpg' },
    ],
    related: ['Bruno Mars', 'Billie Eilish', 'The Weeknd', 'Coldplay'],
    popularTracks: [
      {
        id: 'DlFXDl_ROAM',
        title: 'Die With A Smile',
        artist: 'Lady Gaga & Bruno Mars',
        duration: 252,
        thumb: 'https://i.ytimg.com/vi/DlFXDl_ROAM/hqdefault.jpg',
        thumbnail: 'https://i.ytimg.com/vi/DlFXDl_ROAM/hqdefault.jpg',
        badge: 'GLOBAL POP',
        artistId: 'lady-gaga',
        album: 'Die With A Smile',
      },
    ],
  },
  'the-weeknd': {
    id: 'the-weeknd',
    name: 'The Weeknd',
    verified: true,
    monthlyListeners: '108.920.000',
    followers: '85.2M',
    rank: '#2 di Dunia',
    banner: 'https://i.ytimg.com/vi/J7p4bzqLvCw/hqdefault.jpg',
    coverImage: 'https://i.ytimg.com/vi/J7p4bzqLvCw/hqdefault.jpg',
    avatar: 'https://i.ytimg.com/vi/J7p4bzqLvCw/hqdefault.jpg',
    bio: 'Penyanyi dan produser asal Kanada peraih 4 Grammy Awards. "Blinding Lights" tercatat sebagai lagu terbesar dalam sejarah Billboard Hot 100.',
    writer: 'Abel Tesfaye, Max Martin',
    producer: 'Max Martin & Oscar Holter',
    albums: [
      { id: 'afterhours', title: 'After Hours', year: '2020', type: 'Album', thumb: 'https://i.ytimg.com/vi/J7p4bzqLvCw/hqdefault.jpg', cover: 'https://i.ytimg.com/vi/J7p4bzqLvCw/hqdefault.jpg' },
      { id: 'dawnfm', title: 'Dawn FM', year: '2022', type: 'Album', thumb: 'https://i.ytimg.com/vi/J7p4bzqLvCw/hqdefault.jpg', cover: 'https://i.ytimg.com/vi/J7p4bzqLvCw/hqdefault.jpg' },
    ],
    related: ['Billie Eilish', 'Bruno Mars', 'Coldplay', 'Taylor Swift'],
    popularTracks: [
      {
        id: 'J7p4bzqLvCw',
        title: 'Blinding Lights',
        artist: 'The Weeknd',
        duration: 202,
        thumb: 'https://i.ytimg.com/vi/J7p4bzqLvCw/hqdefault.jpg',
        thumbnail: 'https://i.ytimg.com/vi/J7p4bzqLvCw/hqdefault.jpg',
        badge: 'GLOBAL POP',
        artistId: 'the-weeknd',
        album: 'After Hours',
      },
    ],
  },
  'sabrina-carpenter': {
    id: 'sabrina-carpenter',
    name: 'Sabrina Carpenter',
    verified: true,
    monthlyListeners: '88.340.000',
    followers: '28.5M',
    rank: '#6 di Dunia',
    banner: 'https://i.ytimg.com/vi/kIft-LUHHVA/hqdefault.jpg',
    coverImage: 'https://i.ytimg.com/vi/kIft-LUHHVA/hqdefault.jpg',
    avatar: 'https://i.ytimg.com/vi/kIft-LUHHVA/hqdefault.jpg',
    bio: 'Penyanyi pop sensasional peraih nominasi Grammy asal Pennsylvania. Merajai tangga lagu dunia dengan single hits "Espresso" dan "Taste".',
    writer: 'Sabrina Carpenter, Amy Allen, Julian Bunetta',
    producer: 'Julian Bunetta',
    albums: [
      { id: 'shortnsweet', title: "Short n' Sweet", year: '2024', type: 'Album', thumb: 'https://i.ytimg.com/vi/kIft-LUHHVA/hqdefault.jpg', cover: 'https://i.ytimg.com/vi/kIft-LUHHVA/hqdefault.jpg' },
    ],
    related: ['Billie Eilish', 'Taylor Swift', 'Dua Lipa', 'Bruno Mars'],
    popularTracks: [
      {
        id: 'kIft-LUHHVA',
        title: 'Espresso',
        artist: 'Sabrina Carpenter',
        duration: 176,
        thumb: 'https://i.ytimg.com/vi/kIft-LUHHVA/hqdefault.jpg',
        thumbnail: 'https://i.ytimg.com/vi/kIft-LUHHVA/hqdefault.jpg',
        badge: 'GLOBAL POP',
        artistId: 'sabrina-carpenter',
        album: "Short n' Sweet",
      },
    ],
  },
  'coldplay': {
    id: 'coldplay',
    name: 'Coldplay',
    verified: true,
    monthlyListeners: '89.100.000',
    followers: '52.3M',
    rank: '#5 di Dunia',
    banner: 'https://i.ytimg.com/vi/ALsvdSA9tOU/hqdefault.jpg',
    coverImage: 'https://i.ytimg.com/vi/ALsvdSA9tOU/hqdefault.jpg',
    avatar: 'https://i.ytimg.com/vi/ALsvdSA9tOU/hqdefault.jpg',
    bio: 'Band rock legendaris asal Inggris yang dibentuk oleh Chris Martin, Jonny Buckland, Guy Berryman, dan Will Champion. Telah menjual lebih dari 100 juta rekaman di seluruh dunia.',
    writer: 'Guy Berryman, Jonny Buckland, Will Champion, Chris Martin',
    producer: 'Brian Eno & Markus Dravs',
    albums: [
      { id: 'viva', title: 'Viva La Vida', year: '2008', type: 'Album', thumb: 'https://i.ytimg.com/vi/ALsvdSA9tOU/hqdefault.jpg', cover: 'https://i.ytimg.com/vi/ALsvdSA9tOU/hqdefault.jpg' },
      { id: 'musicofspheres', title: 'Music of the Spheres', year: '2021', type: 'Album', thumb: 'https://i.ytimg.com/vi/ALsvdSA9tOU/hqdefault.jpg', cover: 'https://i.ytimg.com/vi/ALsvdSA9tOU/hqdefault.jpg' },
    ],
    related: ['The Weeknd', 'Billie Eilish', 'Bruno Mars', 'Taylor Swift'],
    popularTracks: [
      {
        id: 'ALsvdSA9tOU',
        title: 'Viva La Vida',
        artist: 'Coldplay',
        duration: 243,
        thumb: 'https://i.ytimg.com/vi/ALsvdSA9tOU/hqdefault.jpg',
        thumbnail: 'https://i.ytimg.com/vi/ALsvdSA9tOU/hqdefault.jpg',
        badge: 'GLOBAL POP',
        artistId: 'coldplay',
        album: 'Viva La Vida',
      },
    ],
  },
  'sheila-on-7': {
    id: 'sheila-on-7',
    name: 'Sheila On 7',
    verified: true,
    monthlyListeners: '7.450.000',
    followers: '7.8M',
    rank: '#8 di Indonesia',
    banner: 'https://i.ytimg.com/vi/k1BfsO0mxWQ/hqdefault.jpg',
    coverImage: 'https://i.ytimg.com/vi/k1BfsO0mxWQ/hqdefault.jpg',
    avatar: 'https://i.ytimg.com/vi/k1BfsO0mxWQ/hqdefault.jpg',
    bio: 'Band pop rock legendaris asal Yogyakarta yang didirikan tahun 1996 oleh Duta, Eross, Adam. Pencetak hits abadi lintas generasi seperti "Dan", "Sephia", dan "Melompat Lebih Tinggi".',
    writer: 'Eross Candra',
    producer: 'Sony Music Indonesia',
    albums: [
      { id: 'kkh', title: 'Kisah Klasik Untuk Masa Depan', year: '2000', type: 'Album', thumb: 'https://i.ytimg.com/vi/k1BfsO0mxWQ/hqdefault.jpg', cover: 'https://i.ytimg.com/vi/k1BfsO0mxWQ/hqdefault.jpg' },
      { id: 'so7', title: 'Sheila On 7', year: '1999', type: 'Album', thumb: 'https://i.ytimg.com/vi/k1BfsO0mxWQ/hqdefault.jpg', cover: 'https://i.ytimg.com/vi/k1BfsO0mxWQ/hqdefault.jpg' },
    ],
    related: ['Dewa 19', 'Peterpan', 'Padi', 'Juicy Luicy'],
    popularTracks: [
      {
        id: 'k1BfsO0mxWQ',
        title: 'Dan...',
        artist: 'Sheila On 7',
        duration: 289,
        thumb: 'https://i.ytimg.com/vi/k1BfsO0mxWQ/hqdefault.jpg',
        thumbnail: 'https://i.ytimg.com/vi/k1BfsO0mxWQ/hqdefault.jpg',
        badge: 'NOSTALGIA INDO',
        artistId: 'sheila-on-7',
        album: 'Sheila On 7',
      },
    ],
  },
  'dewa-19': {
    id: 'dewa-19',
    name: 'Dewa 19',
    verified: true,
    monthlyListeners: '7.920.000',
    followers: '6.9M',
    rank: '#7 di Indonesia',
    banner: 'https://i.ytimg.com/vi/YKK5_OQiEa4/hqdefault.jpg',
    coverImage: 'https://i.ytimg.com/vi/YKK5_OQiEa4/hqdefault.jpg',
    avatar: 'https://i.ytimg.com/vi/YKK5_OQiEa4/hqdefault.jpg',
    bio: 'Grup musik rock legendaris Indonesia yang dipimpin Ahmad Dhani. Salah satu band paling berpengaruh dengan penjualan jutaan keping album fisik dan hits tak lekang oleh waktu.',
    writer: 'Ahmad Dhani & Andra Ramadhan',
    producer: 'Aquarius Musikindo',
    albums: [
      { id: 'bintanglima', title: 'Bintang Lima', year: '2000', type: 'Album', thumb: 'https://i.ytimg.com/vi/YKK5_OQiEa4/hqdefault.jpg', cover: 'https://i.ytimg.com/vi/YKK5_OQiEa4/hqdefault.jpg' },
      { id: 'terbaik', title: 'Terbaik Terbaik', year: '1995', type: 'Album', thumb: 'https://i.ytimg.com/vi/YKK5_OQiEa4/hqdefault.jpg', cover: 'https://i.ytimg.com/vi/YKK5_OQiEa4/hqdefault.jpg' },
    ],
    related: ['Sheila On 7', 'Peterpan', 'Padi', 'Andra And The Backbone'],
    popularTracks: [
      {
        id: 'YKK5_OQiEa4',
        title: 'Kangen',
        artist: 'Dewa 19',
        duration: 304,
        thumb: 'https://i.ytimg.com/vi/YKK5_OQiEa4/hqdefault.jpg',
        thumbnail: 'https://i.ytimg.com/vi/YKK5_OQiEa4/hqdefault.jpg',
        badge: 'NOSTALGIA INDO',
        artistId: 'dewa-19',
        album: 'Dewa 19',
      },
      {
        id: 'Vjp424-pA6A',
        title: 'Risalah Hati',
        artist: 'Dewa 19',
        duration: 293,
        thumb: 'https://i.ytimg.com/vi/Vjp424-pA6A/hqdefault.jpg',
        thumbnail: 'https://i.ytimg.com/vi/Vjp424-pA6A/hqdefault.jpg',
        badge: 'NOSTALGIA INDO',
        artistId: 'dewa-19',
        album: 'Bintang Lima',
      },
    ],
  },
  'newjeans': {
    id: 'newjeans',
    name: 'NewJeans',
    verified: true,
    monthlyListeners: '21.400.000',
    followers: '12.8M',
    rank: '#24 di Dunia',
    banner: 'https://i.ytimg.com/vi/0c7zGU2C2mM/hqdefault.jpg',
    coverImage: 'https://i.ytimg.com/vi/0c7zGU2C2mM/hqdefault.jpg',
    avatar: 'https://i.ytimg.com/vi/0c7zGU2C2mM/hqdefault.jpg',
    bio: 'Girl group K-Pop beranggotakan Minji, Hanni, Danielle, Haerin, dan Hyein. Merombak musik pop global dengan nuansa Y2K, R&B, dan UK garage yang segar.',
    writer: 'Minji, Hanni, Danielle, Gigi, Erika de Casier',
    producer: '250 & FRNK',
    albums: [
      { id: 'getup', title: 'Get Up', year: '2023', type: 'EP', thumb: 'https://i.ytimg.com/vi/0c7zGU2C2mM/hqdefault.jpg', cover: 'https://i.ytimg.com/vi/0c7zGU2C2mM/hqdefault.jpg' },
      { id: 'omg', title: 'OMG', year: '2023', type: 'Single', thumb: 'https://i.ytimg.com/vi/0c7zGU2C2mM/hqdefault.jpg', cover: 'https://i.ytimg.com/vi/0c7zGU2C2mM/hqdefault.jpg' },
    ],
    related: ['BLACKPINK', 'BTS', 'aespa', 'FIFTY FIFTY'],
    popularTracks: [
      {
        id: '0c7zGU2C2mM',
        title: 'Super Shy',
        artist: 'NewJeans',
        duration: 155,
        thumb: 'https://i.ytimg.com/vi/0c7zGU2C2mM/hqdefault.jpg',
        thumbnail: 'https://i.ytimg.com/vi/0c7zGU2C2mM/hqdefault.jpg',
        badge: 'K-POP',
        artistId: 'newjeans',
        album: 'Get Up',
      },
    ],
  },
  'payung-teduh': {
    id: 'payung-teduh',
    name: 'Payung Teduh',
    verified: true,
    monthlyListeners: '4.850.000',
    followers: '3.6M',
    rank: '#12 di Indonesia',
    banner: 'https://i.ytimg.com/vi/BRPaF-O-3rE/hqdefault.jpg',
    coverImage: 'https://i.ytimg.com/vi/BRPaF-O-3rE/hqdefault.jpg',
    avatar: 'https://i.ytimg.com/vi/BRPaF-O-3rE/hqdefault.jpg',
    bio: 'Grup musik alternatif folk jazz Indonesia yang didirikan tahun 2007. Hits legendaris "Akad" menjadi salah satu lagu pernikahan dan perayaan cinta terpopuler sepanjang sejarah Indonesia.',
    writer: 'Mohammad Istiqamah Djamad',
    producer: 'Payung Teduh',
    albums: [
      { id: 'ruangtunggu', title: 'Ruang Tunggu', year: '2017', type: 'Album', thumb: 'https://i.ytimg.com/vi/BRPaF-O-3rE/hqdefault.jpg', cover: 'https://i.ytimg.com/vi/BRPaF-O-3rE/hqdefault.jpg' },
    ],
    related: ['Fourtwnty', 'Danilla', 'Kunto Aji', 'Ardhito Pramono'],
    popularTracks: [
      {
        id: 'BRPaF-O-3rE',
        title: 'Akad',
        artist: 'Payung Teduh',
        duration: 259,
        thumb: 'https://i.ytimg.com/vi/BRPaF-O-3rE/hqdefault.jpg',
        thumbnail: 'https://i.ytimg.com/vi/BRPaF-O-3rE/hqdefault.jpg',
        badge: 'INDIE AKUSTIK',
        artistId: 'payung-teduh',
        album: 'Ruang Tunggu',
      },
    ],
  },
};

// Helper to get real avatar for an artist without dummy fallback
export function getArtistAvatar(artistName: string): string {
  if (!artistName) return '/logo.png';
  const clean = artistName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

  for (const [key, val] of Object.entries(ARTIST_DATABASE)) {
    if (
      key === clean ||
      val.name.toLowerCase() === artistName.toLowerCase() ||
      clean.includes(key) ||
      key.includes(clean)
    ) {
      if (val.avatar) return val.avatar;
      if (val.banner) return val.banner;
    }
  }

  const trackMatch = ALL_RECOMMENDATIONS_POOL.find(
    (t) =>
      t.artist.toLowerCase().includes(artistName.toLowerCase()) ||
      artistName.toLowerCase().includes(t.artist.toLowerCase())
  );
  if (trackMatch?.thumb) return trackMatch.thumb;

  return '/logo.png';
}

export function getArtistData(nameOrId: string, optionalTrack?: Track | null): ArtistProfile {
  // If nameOrId is a YouTube channel ID (e.g. UC...), prioritize human artist name
  const isChannelId = (s?: string) =>
    !!s && (/^UC[a-zA-Z0-9_-]{18,}$/.test(s) || (s.startsWith('UC') && s.length >= 20));

  let effectiveName = nameOrId || '';
  if ((!effectiveName || isChannelId(effectiveName)) && optionalTrack?.artist && !isChannelId(optionalTrack.artist)) {
    effectiveName = optionalTrack.artist;
  }
  if (!effectiveName || isChannelId(effectiveName)) {
    effectiveName = optionalTrack?.artist || 'Artis';
  }

  const clean = effectiveName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

  // Look up by direct key, slug, or matching name
  let dbEntry: Omit<ArtistProfile, 'tracks'> | undefined;
  for (const [key, val] of Object.entries(ARTIST_DATABASE)) {
    if (
      key === clean ||
      key.replace(/-/g, ' ') === effectiveName.toLowerCase() ||
      val.name.toLowerCase() === effectiveName.toLowerCase() ||
      clean.includes(key) ||
      key.includes(clean)
    ) {
      dbEntry = val;
      break;
    }
  }

  // Find all truly matching tracks across the pool
  const pool = ALL_RECOMMENDATIONS_POOL;
  const searchKey = dbEntry ? dbEntry.name.toLowerCase() : effectiveName.toLowerCase().replace(/-/g, ' ');

  const matchingTracks: Track[] = [];
  const seenIds = new Set<string>();

  // If dbEntry has predefined popularTracks, seed them first
  if (dbEntry?.popularTracks) {
    dbEntry.popularTracks.forEach((t) => {
      if (t && t.id && !seenIds.has(t.id)) {
        seenIds.add(t.id);
        matchingTracks.push(t);
      }
    });
  }

  // If optionalTrack was passed and matches this artist, add it
  if (optionalTrack && optionalTrack.id && !seenIds.has(optionalTrack.id)) {
    const trackArtist = optionalTrack.artist.toLowerCase();
    if (trackArtist.includes(searchKey) || searchKey.includes(trackArtist)) {
      seenIds.add(optionalTrack.id);
      matchingTracks.unshift(optionalTrack);
    }
  }

  // Scan pool for any additional tracks truly performed by this artist
  pool.forEach((t) => {
    if (t && t.id && !seenIds.has(t.id)) {
      const trackArtist = t.artist.toLowerCase();
      if (trackArtist.includes(searchKey) || searchKey.includes(trackArtist)) {
        seenIds.add(t.id);
        matchingTracks.push(t);
      }
    }
  });

  if (dbEntry) {
    const heroThumb = optionalTrack?.thumb || dbEntry.banner || matchingTracks[0]?.thumb;
    return {
      ...dbEntry,
      tracks: matchingTracks,
      popularTracks: matchingTracks,
      banner: heroThumb,
      coverImage: heroThumb,
      avatar: heroThumb,
    };
  }

  // Procedural fallback for artists not in the database
  let hash = 0;
  for (let i = 0; i < effectiveName.length; i++) {
    hash = (hash << 5) - hash + effectiveName.charCodeAt(i);
    hash |= 0;
  }
  const seed = Math.abs(hash);
  const millions = (seed % 40) + 3;
  const thousands = (seed % 899) + 100;
  const hundreds = (seed % 899) + 100;
  const listenersFormatted = `${millions}.${thousands}.${hundreds}`;
  const rankNum = (seed % 80) + 10;
  const followersFormatted = `${(seed % 15) + 1}.${seed % 9}M`;

  let displayName = effectiveName;
  if (isChannelId(displayName) && optionalTrack?.artist && !isChannelId(optionalTrack.artist)) {
    displayName = optionalTrack.artist;
  }
  if (displayName.includes('-') && !displayName.includes(' ')) {
    displayName = displayName.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }

  // Use optionalTrack if available
  if (optionalTrack && !seenIds.has(optionalTrack.id)) {
    seenIds.add(optionalTrack.id);
    matchingTracks.push(optionalTrack);
  }

  const defaultBanner =
    optionalTrack?.thumb || matchingTracks[0]?.thumb || 'https://i.ytimg.com/vi/WKZO-CWeOVA/hqdefault.jpg';

  return {
    id: clean,
    name: displayName,
    verified: true,
    monthlyListeners: listenersFormatted,
    followers: followersFormatted,
    rank: `#${rankNum} di Dunia`,
    banner: defaultBanner,
    coverImage: defaultBanner,
    avatar: defaultBanner,
    bio: `${displayName} adalah musisi dengan karya lagu yang telah didengarkan jutaan kali di berbagai platform musik digital. Menghadirkan warna musik khas dengan aransemen orisinal.`,
    writer: displayName,
    producer: 'Haytify Music Production',
    albums: [
      { id: 'col1', title: `${displayName} (The Collection)`, year: '2024', type: 'Album', thumb: defaultBanner, cover: defaultBanner },
      { id: 'col2', title: 'Live Session & Akustik', year: '2023', type: 'EP', thumb: defaultBanner, cover: defaultBanner },
    ],
    related: ['Bernadya', 'Billie Eilish', 'Bruno Mars', 'Hindia', 'Juicy Luicy'],
    tracks: matchingTracks,
    popularTracks: matchingTracks,
  };
}
