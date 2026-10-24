import { NextResponse } from 'next/server';
import { Track } from '@/types';
import { ALL_RECOMMENDATIONS_POOL } from '@/data/recommendations';

const PIPED_INSTANCES = [
  'https://api.piped.private.coffee',
  'https://piped.video',
  'https://pipedapi.kavin.rocks',
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q || !q.trim()) {
    return NextResponse.json({ results: [] });
  }

  for (const base of PIPED_INSTANCES) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3500);
      const res = await fetch(`${base}/search?q=${encodeURIComponent(q)}&filter=music_songs`, {
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
            return NextResponse.json({ results });
          }
        }
      }
    } catch (e) {
      // Continue to next instance
    }
  }

  // Local fallback from verified recommendation pool
  const qLower = q.toLowerCase();
  const localResults = ALL_RECOMMENDATIONS_POOL.filter(
    (t) => t.title.toLowerCase().includes(qLower) || t.artist.toLowerCase().includes(qLower)
  );

  return NextResponse.json({ results: localResults });
}
