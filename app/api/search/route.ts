import { NextResponse } from 'next/server';
import { Track } from '@/types';
import { ALL_RECOMMENDATIONS_POOL } from '@/data/recommendations';
import { ytSearch } from '@/lib/ytmusic';

const PIPED_INSTANCES = [
  'https://api.piped.private.coffee',
  'https://piped.video',
  'https://pipedapi.kavin.rocks',
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  const filter = (searchParams.get('filter') || 'songs') as 'songs' | 'artists' | 'albums' | 'playlists';

  if (!q || !q.trim()) {
    return NextResponse.json({ results: [], filter });
  }

  const queryTrimmed = q.trim();

  // 1. Primary: Official YouTube Music metadata via native InnerTube API (Node.js/Vercel compatible)
  try {
    const ytmusicData = await ytSearch(queryTrimmed, filter, 20);
    if (ytmusicData) {
      if (filter === 'artists' && Array.isArray(ytmusicData.artists) && ytmusicData.artists.length > 0) {
        return NextResponse.json({
          artists: ytmusicData.artists,
          filter: 'artists',
          source: 'ytmusic-native',
        });
      }
      if (filter === 'albums' && Array.isArray(ytmusicData.albums) && ytmusicData.albums.length > 0) {
        return NextResponse.json({
          albums: ytmusicData.albums,
          filter: 'albums',
          source: 'ytmusic-native',
        });
      }
      if (filter === 'playlists' && Array.isArray(ytmusicData.playlists) && ytmusicData.playlists.length > 0) {
        return NextResponse.json({
          playlists: ytmusicData.playlists,
          filter: 'playlists',
          source: 'ytmusic-native',
        });
      }
      if (Array.isArray(ytmusicData.results) && ytmusicData.results.length > 0) {
        return NextResponse.json({
          results: ytmusicData.results,
          filter: 'songs',
          source: 'ytmusic-native',
        });
      }
    }
  } catch (err) {
    console.error('ytSearch native error:', err);
  }

  // 2. Secondary fallback: Piped instances (for songs)
  for (const base of PIPED_INSTANCES) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3200);
      const res = await fetch(`${base}/search?q=${encodeURIComponent(queryTrimmed)}&filter=music_songs`, {
        signal: controller.signal,
        headers: { 'Accept': 'application/json' },
      });
      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        const items = data.items || data;
        if (Array.isArray(items)) {
          const results: Track[] = items
            .filter((item: any) => item.type === 'stream' || !item.type)
            .slice(0, 15)
            .map((item: any) => {
              const rawId = item.url ? item.url.replace('/watch?v=', '').replace(/&.*/, '') : item.id;
              const cleanId = typeof rawId === 'string' ? rawId.trim() : '';
              const directThumb = cleanId
                ? `https://i.ytimg.com/vi/${cleanId}/hqdefault.jpg`
                : (item.thumbnail || 'https://i.ytimg.com/vi/WKZO-CWeOVA/hqdefault.jpg');

              return {
                id: cleanId || `piped-${Date.now()}`,
                title: item.title || 'Judul Lagu',
                artist: item.uploaderName || item.artist || 'Artis Musik',
                thumb: directThumb,
                thumbnail: directThumb,
                duration: typeof item.duration === 'number' ? item.duration : 210,
                source: 'piped-search',
              };
            })
            .filter((t: Track) => t.id && t.title);

          if (results.length > 0) {
            return NextResponse.json({ results, filter: 'songs', source: 'piped' });
          }
        }
      }
    } catch {
      // Continue to next instance
    }
  }

  // 3. Tertiary fallback: Local verified recommendation pool
  const qLower = queryTrimmed.toLowerCase();
  const localResults = ALL_RECOMMENDATIONS_POOL.filter(
    (t) => t.title.toLowerCase().includes(qLower) || t.artist.toLowerCase().includes(qLower)
  );

  return NextResponse.json({ results: localResults, filter: 'songs', source: 'local-pool' });
}
