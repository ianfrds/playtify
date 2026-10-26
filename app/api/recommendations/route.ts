import { NextResponse } from 'next/server';
import { CURATED_PLAYLISTS, RECOMMENDATIONS_DATA } from '@/data/recommendations';
import { Track } from '@/types';
import { sanitizeTracks } from '@/lib/trackSanitizer';

export const revalidate = 86400; // 24 hours (86,400 seconds)

const PIPED_INSTANCES = [
  'https://api.piped.private.coffee',
  'https://piped.video',
  'https://pipedapi.kavin.rocks',
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const refresh = searchParams.get('refresh') === 'true';

  let liveTrending: Track[] = [];

  if (refresh) {
    for (const base of PIPED_INSTANCES) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3500);
        const res = await fetch(`${base}/trending?region=ID`, {
          signal: controller.signal,
          headers: { 'Accept': 'application/json' },
          next: { revalidate: 86400 } // revalidate every 24 hours
        });
        clearTimeout(timeout);

        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            const rawTrending = data.slice(0, 10).map((item: any) => ({
              id: item.url ? item.url.replace('/watch?v=', '') : item.id,
              title: item.title || 'Lagu Trending',
              artist: item.uploaderName || item.artist || 'Artis Populer',
              thumb: item.thumbnail || item.uploaderAvatar || 'https://i.ytimg.com/vi/WKZO-CWeOVA/hqdefault.jpg',
              duration: item.duration || 210,
              source: 'piped-trending'
            })).filter((t: Track) => t.id && t.title);
            liveTrending = sanitizeTracks(rawTrending);
            if (liveTrending.length > 0) break;
          }
        }
      } catch (e) {
        // Continue to next instance or fallback
      }
    }
  }

  // Return pristine curated playlists without polluting them with non-music YouTube trending
  const playlists = CURATED_PLAYLISTS.map((pl) => ({
    ...pl,
    tracks: sanitizeTracks(pl.tracks || []),
  }));

  return NextResponse.json({
    updatedAt: new Date().toISOString(),
    isLive: false,
    results: sanitizeTracks(CURATED_PLAYLISTS[0]?.tracks || []),
    playlists,
    shelves: RECOMMENDATIONS_DATA,
  });
}
