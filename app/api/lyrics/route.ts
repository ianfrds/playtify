import { NextResponse } from 'next/server';
import { LYRICS_DATABASE, SongLyrics, LyricLine } from '@/data/lyrics';

// In-memory cache for fast repeated lookups
const lyricsCache = new Map<string, SongLyrics>();

/**
 * Clean track title by removing noise like (Official Music Video), (Lyric Video), [MV], etc.
 */
function cleanTrackTitle(title: string): string {
  if (!title) return '';
  return title
    .replace(/\s*\([^)]*(?:official|video|audio|lyrics|mv|remastered|version|feat|ft\.)[^)]*\)/gi, '')
    .replace(/\s*\[[^\]]*(?:official|video|audio|lyrics|mv|remastered|version|feat|ft\.)[^\]]*\]/gi, '')
    .replace(/\s*-\s*(?:official|video|audio|lyrics|mv).*/gi, '')
    .trim();
}

/**
 * Clean artist name by taking only the primary artist
 */
function cleanArtistName(artist: string): string {
  if (!artist) return '';
  return artist
    .split(/[,&/]|(?:\s+feat\.?\s+)|(?:\s+ft\.?\s+)/i)[0]
    .replace(/ - Topic$/i, '')
    .replace(/VEVO$/i, '')
    .trim();
}

/**
 * Parse standard LRC format [mm:ss.xx] Lyric text
 */
function parseLrc(lrcText: string): LyricLine[] {
  const lines: LyricLine[] = [];
  const regex = /\[(\d{2}):(\d{2}(?:\.\d+)?)\](.*)/;

  for (const rawLine of lrcText.split('\n')) {
    const trimmed = rawLine.trim();
    if (!trimmed) continue;

    const match = trimmed.match(regex);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseFloat(match[2]);
      const text = match[3].trim();
      const time = Math.max(0, minutes * 60 + seconds);
      // Skip lines that are only timestamps with no text
      if (text) {
        lines.push({ time: Math.round(time * 100) / 100, text });
      }
    }
  }

  lines.sort((a, b) => a.time - b.time);
  return lines;
}

/**
 * Distribute plain lyrics evenly across duration when no synced LRC is available
 */
function distributePlainLyrics(plainText: string, durationSec: number): LyricLine[] {
  const rawLines = plainText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith('[') && !l.endsWith(']'));

  if (rawLines.length === 0) return [];

  const startSec = 8;
  const endSec = Math.max(startSec + 20, durationSec > 0 ? durationSec - 12 : 180);
  const step = (endSec - startSec) / Math.max(1, rawLines.length - 1);

  return rawLines.map((text, idx) => ({
    time: Math.round((startSec + idx * step) * 10) / 10,
    text,
  }));
}

/**
 * Generate a dynamic Spotify dark gradient theme based on song/artist name
 */
function generateThemeColor(title: string, artist: string): string {
  const str = `${title} ${artist}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `linear-gradient(180deg, hsl(${hue}, 45%, 18%) 0%, hsl(${hue}, 50%, 6%) 100%)`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id') || '';
  const rawTitle = searchParams.get('title') || '';
  const rawArtist = searchParams.get('artist') || '';
  const duration = parseFloat(searchParams.get('duration') || '210');

  const cacheKey = `${id || ''}:${rawTitle.toLowerCase()}:${rawArtist.toLowerCase()}`;
  if (lyricsCache.has(cacheKey)) {
    return NextResponse.json(lyricsCache.get(cacheKey));
  }

  // 1. Check if ID exists in our curated database first
  if (id && LYRICS_DATABASE[id]) {
    const curated = LYRICS_DATABASE[id];
    lyricsCache.set(cacheKey, curated);
    return NextResponse.json(curated);
  }

  const cleanTitle = cleanTrackTitle(rawTitle);
  const cleanArtist = cleanArtistName(rawArtist);

  // 2. Query LRCLIB for real-time millisecond-accurate synchronized lyrics
  if (cleanTitle) {
    try {
      const lrclibParams = new URLSearchParams({
        track_name: cleanTitle,
        artist_name: cleanArtist,
      });

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3500);

      const res = await fetch(`https://lrclib.net/api/get?${lrclibParams.toString()}`, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Playtify/2.5.0 (https://github.com/ianfrds/playtify)',
        },
      });
      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();

        // Check for synced lyrics with millisecond timestamps
        if (data.syncedLyrics && typeof data.syncedLyrics === 'string') {
          const parsedLines = parseLrc(data.syncedLyrics);
          if (parsedLines.length > 0) {
            const result: SongLyrics = {
              id: id || cleanTitle,
              themeColor: generateThemeColor(cleanTitle, cleanArtist),
              lines: parsedLines,
            };
            lyricsCache.set(cacheKey, result);
            return NextResponse.json(result);
          }
        }

        // Fallback to plain lyrics distributed across song duration
        if (data.plainLyrics && typeof data.plainLyrics === 'string') {
          const distributedLines = distributePlainLyrics(data.plainLyrics, duration);
          if (distributedLines.length > 0) {
            const result: SongLyrics = {
              id: id || cleanTitle,
              themeColor: generateThemeColor(cleanTitle, cleanArtist),
              lines: distributedLines,
            };
            lyricsCache.set(cacheKey, result);
            return NextResponse.json(result);
          }
        }
      }
    } catch {
      // Ignore network/timeout error, proceed to fallback
    }
  }

  // 3. Fallback: Intelligent lyric lines for unlisted songs
  const themeColor = generateThemeColor(rawTitle || 'Musik', rawArtist || 'Artis');
  const fallbackResult: SongLyrics = {
    id: id || 'generic',
    themeColor,
    lines: [
      { time: 0, text: `♪ (Memutar lagu "${rawTitle || 'Musik'}") ♪` },
      { time: 8, text: `Alunan melodi khas dari ${rawArtist || 'Artis Musik'}` },
      { time: 20, text: 'Mengalun merdu di keheningan suasana' },
      { time: 34, text: `Setiap nada merangkai bait dalam ${rawTitle || 'lagu ini'}` },
      { time: 48, text: 'Membawa rasa dan kenangan yang tak lekang waktu' },
      { time: 64, text: 'Hanyut dalam denting irama yang penuh makna' },
      { time: 80, text: `♪ Harmoni indah oleh ${rawArtist || 'Artis Terverifikasi'} ♪` },
      { time: 98, text: 'Terus berdendang menemani setiap langkah perjalanan' },
      { time: 118, text: 'Semua rasa bercampur menjadi satu harmoni jiwa' },
      { time: 140, text: `♪ ${rawTitle || 'Melodi'} - ${rawArtist || 'Playtify'} ♪` },
      { time: 165, text: 'Menutup bait dengan kehangatan nada abadi' },
    ],
  };

  lyricsCache.set(cacheKey, fallbackResult);
  return NextResponse.json(fallbackResult);
}
