import { Track } from '@/types';

export const BROKEN_ID_MAP: Record<string, { id: string; thumb: string }> = {
  'yJ3V_m8R610': { id: 'HB8vftGxsIc', thumb: 'https://i.ytimg.com/vi/HB8vftGxsIc/hqdefault.jpg' },
  'q63Hk2RjZtE': { id: 'vl_3mZx88zw', thumb: 'https://i.ytimg.com/vi/vl_3mZx88zw/hqdefault.jpg' },
  'iHh9WqB3F1E': { id: 't9VWICGOD90', thumb: 'https://i.ytimg.com/vi/t9VWICGOD90/hqdefault.jpg' },
  'TakSegampangItu12': { id: '6NsiA6GFAbU', thumb: 'https://i.ytimg.com/vi/6NsiA6GFAbU/hqdefault.jpg' },
  'TamparJuicyLuicy1': { id: 'qmgA_WejI8w', thumb: 'https://i.ytimg.com/vi/qmgA_WejI8w/hqdefault.jpg' },
  'KupikirKitaRumah1': { id: 'nXOfv4-tT9o', thumb: 'https://i.ytimg.com/vi/nXOfv4-tT9o/hqdefault.jpg' },
  'RumahKeRumahHindia': { id: 'pjhOjHDX0A8', thumb: 'https://i.ytimg.com/vi/pjhOjHDX0A8/hqdefault.jpg' },
  'BohongiHatiMhl1': { id: 'Wh66ThpxvI4', thumb: 'https://i.ytimg.com/vi/Wh66ThpxvI4/hqdefault.jpg' },
  'TakDianggapNabila1': { id: 'sPVRp0Ahxco', thumb: 'https://i.ytimg.com/vi/sPVRp0Ahxco/hqdefault.jpg' },
  'BungaMaafSalPriadi': { id: 'KDQ2GAdldGI', thumb: 'https://i.ytimg.com/vi/KDQ2GAdldGI/hqdefault.jpg' },
  'BerdamaiBernadya22': { id: '9hjMIOIysng', thumb: 'https://i.ytimg.com/vi/9hjMIOIysng/hqdefault.jpg' },
  'SebujurBangkai123': { id: 'lv9dWjr9xjk', thumb: 'https://i.ytimg.com/vi/lv9dWjr9xjk/hqdefault.jpg' },
  'SoraiNadinAmizah1': { id: 'PF_VokiUndk', thumb: 'https://i.ytimg.com/vi/PF_VokiUndk/hqdefault.jpg' },
  'kTJczUoc56U': { id: 'kTJczUoc26U', thumb: 'https://i.ytimg.com/vi/kTJczUoc26U/hqdefault.jpg' },
  'tozb_H7Fv_k': { id: 'To4SWGZkEPk', thumb: 'https://i.ytimg.com/vi/To4SWGZkEPk/hqdefault.jpg' },
};

export const DEFAULT_FALLBACK_COVER = '/logo.png';

export function sanitizeTrack(track: Track): Track {
  if (!track) return track;
  let newId = track.id;
  let newThumb = track.thumbnail || track.thumb || '';

  // Check if track ID is in broken map
  if (BROKEN_ID_MAP[track.id]) {
    newId = BROKEN_ID_MAP[track.id].id;
    newThumb = BROKEN_ID_MAP[track.id].thumb;
  }

  // Check if thumbnail contains broken ID
  for (const [badId, replacement] of Object.entries(BROKEN_ID_MAP)) {
    if (newThumb.includes(badId)) {
      newId = replacement.id;
      newThumb = replacement.thumb;
      break;
    }
  }

  // Explicit check for "Untungnya, Hidup Harus Tetap Berjalan"
  if (track.title?.toLowerCase().includes('untungnya') && (newId === 'yJ3V_m8R610' || newThumb.includes('yJ3V_m8R610') || !newThumb)) {
    newId = 'HB8vftGxsIc';
    newThumb = 'https://i.ytimg.com/vi/HB8vftGxsIc/hqdefault.jpg';
  }

  return {
    ...track,
    id: newId,
    thumb: newThumb || DEFAULT_FALLBACK_COVER,
    thumbnail: newThumb || DEFAULT_FALLBACK_COVER,
  };
}

export function sanitizeTracks(tracks: Track[]): Track[] {
  if (!Array.isArray(tracks)) return [];
  return tracks.map(sanitizeTrack);
}
