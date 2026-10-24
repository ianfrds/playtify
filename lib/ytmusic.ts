/**
 * Native YouTube Music InnerTube Client
 * Direct HTTP calls to YouTube Music WEB_REMIX API.
 * 100% native Node.js / TypeScript - 0 Python dependencies, fully compatible with Vercel Serverless.
 */

import { Track } from '@/types';

export interface YtArtistResult {
  id: string;
  name: string;
  avatar: string;
  subscribers: string;
  type: 'artist';
}

export interface YtAlbumResult {
  id: string;
  title: string;
  artist: string;
  year: string;
  thumb: string;
  type: string;
}

export interface YtPlaylistResult {
  id: string;
  title: string;
  author: string;
  itemCount: string;
  thumb: string;
}

export interface YtArtistDetails {
  name: string;
  id: string;
  description: string;
  subscribers: string;
  avatar: string;
  popularTracks: Track[];
  albums: { id: string; title: string; type: string; year: string; thumb: string }[];
  singles: { id: string; title: string; type: string; year: string; thumb: string }[];
}

const INNERTUBE_API_BASE = 'https://music.youtube.com/youtubei/v1';

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'X-YouTube-Client-Name': '67',
  'X-YouTube-Client-Version': '1.20240101.01.00',
  Origin: 'https://music.youtube.com',
  Referer: 'https://music.youtube.com/',
};

const DEFAULT_CONTEXT = {
  client: {
    clientName: 'WEB_REMIX',
    clientVersion: '1.20240101.01.00',
    hl: 'id',
    gl: 'ID',
  },
};

const FILTER_PARAMS: Record<string, string> = {
  songs: 'EgWKAQIIAWoMEA4QChADEAQQCRAF',
  artists: 'EgWKAQIgAWoMEA4QChADEAQQCRAF',
  albums: 'EgWKAQIYAWoMEA4QChADEAQQCRAF',
  playlists: 'Eg-KAQwIABAAGAAgACgBMABqChAEEAMQCRAFEAo%3D',
};

function parseDuration(durStr?: string): number {
  if (!durStr) return 210;
  try {
    const cleaned = durStr.trim().replace('.', ':');
    const parts = cleaned.split(':');
    if (parts.length === 2) {
      const min = parseInt(parts[0], 10);
      const sec = parseInt(parts[1], 10);
      if (!isNaN(min) && !isNaN(sec)) return min * 60 + sec;
    } else if (parts.length === 3) {
      const hr = parseInt(parts[0], 10);
      const min = parseInt(parts[1], 10);
      const sec = parseInt(parts[2], 10);
      if (!isNaN(hr) && !isNaN(min) && !isNaN(sec)) return hr * 3600 + min * 60 + sec;
    }
  } catch {
    // ignore
  }
  return 210;
}

function getBestThumbnail(thumbnails?: { url: string; width?: number; height?: number }[]): string {
  if (!thumbnails || !thumbnails.length) return '';
  return thumbnails[thumbnails.length - 1].url;
}

/**
 * Search YouTube Music directly via InnerTube WEB_REMIX API
 */
export async function ytSearch(
  query: string,
  filter: 'songs' | 'artists' | 'albums' | 'playlists' = 'songs',
  limit = 20
): Promise<{
  results?: Track[];
  artists?: YtArtistResult[];
  albums?: YtAlbumResult[];
  playlists?: YtPlaylistResult[];
  filter: string;
}> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4500);

    const body: Record<string, any> = {
      context: DEFAULT_CONTEXT,
      query: query.trim(),
    };

    if (FILTER_PARAMS[filter]) {
      body.params = FILTER_PARAMS[filter];
    }

    const res = await fetch(`${INNERTUBE_API_BASE}/search?prettyPrint=false`, {
      method: 'POST',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return { filter, results: [] };
    }

    const data = await res.json();
    const tabs = data?.contents?.tabbedSearchResultsRenderer?.tabs;
    const sectionList = tabs?.[0]?.tabRenderer?.content?.sectionListRenderer?.contents || [];

    if (!sectionList.length) {
      return { filter, results: [] };
    }

    const shelf = sectionList[0]?.musicShelfRenderer;
    const rawItems = shelf?.contents || [];

    if (filter === 'artists') {
      const artists: YtArtistResult[] = [];
      for (const raw of rawItems.slice(0, limit)) {
        const item = raw.musicResponsiveListItemRenderer;
        if (!item) continue;

        const name =
          item.flexColumns?.[0]?.musicResponsiveListItemFlexColumnRenderer?.title?.runs?.[0]?.text ||
          item.flexColumns?.[0]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs?.[0]?.text ||
          'Artis';

        const browseId =
          item.navigationEndpoint?.browseEndpoint?.browseId ||
          item.flexColumns?.[0]?.musicResponsiveListItemFlexColumnRenderer?.title?.runs?.[0]?.navigationEndpoint?.browseEndpoint?.browseId ||
          '';

        const runs1 =
          item.flexColumns?.[1]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs ||
          item.flexColumns?.[1]?.musicResponsiveListItemFlexColumnRenderer?.title?.runs ||
          [];
        const subscribers = runs1.map((r: any) => r.text).join('') || '';

        const thumbs = item.thumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails;
        const avatar = getBestThumbnail(thumbs);

        artists.push({
          id: browseId,
          name,
          avatar,
          subscribers,
          type: 'artist',
        });
      }
      return { artists, filter: 'artists' };
    }

    if (filter === 'albums') {
      const albums: YtAlbumResult[] = [];
      for (const raw of rawItems.slice(0, limit)) {
        const item = raw.musicResponsiveListItemRenderer;
        if (!item) continue;

        const title =
          item.flexColumns?.[0]?.musicResponsiveListItemFlexColumnRenderer?.title?.runs?.[0]?.text ||
          item.flexColumns?.[0]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs?.[0]?.text ||
          'Album';

        const browseId =
          item.navigationEndpoint?.browseEndpoint?.browseId ||
          item.flexColumns?.[0]?.musicResponsiveListItemFlexColumnRenderer?.title?.runs?.[0]?.navigationEndpoint?.browseEndpoint?.browseId ||
          '';

        const runs1 =
          item.flexColumns?.[1]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs ||
          item.flexColumns?.[1]?.musicResponsiveListItemFlexColumnRenderer?.title?.runs ||
          [];
        const cleanRuns = runs1.filter((r: any) => r.text && r.text !== ' • ');

        const albumType = cleanRuns[0]?.text || 'Album';
        const artist = cleanRuns[1]?.text || 'Artis';
        const year = cleanRuns[2]?.text || '';

        const thumbs = item.thumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails;
        const thumb = getBestThumbnail(thumbs);

        albums.push({
          id: browseId,
          title,
          artist,
          year,
          thumb,
          type: albumType,
        });
      }
      return { albums, filter: 'albums' };
    }

    if (filter === 'playlists') {
      const playlists: YtPlaylistResult[] = [];
      for (const raw of rawItems.slice(0, limit)) {
        const item = raw.musicResponsiveListItemRenderer;
        if (!item) continue;

        const title =
          item.flexColumns?.[0]?.musicResponsiveListItemFlexColumnRenderer?.title?.runs?.[0]?.text ||
          item.flexColumns?.[0]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs?.[0]?.text ||
          'Playlist';

        const browseId =
          item.navigationEndpoint?.browseEndpoint?.browseId ||
          item.flexColumns?.[0]?.musicResponsiveListItemFlexColumnRenderer?.title?.runs?.[0]?.navigationEndpoint?.browseEndpoint?.browseId ||
          '';

        const runs1 =
          item.flexColumns?.[1]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs ||
          item.flexColumns?.[1]?.musicResponsiveListItemFlexColumnRenderer?.title?.runs ||
          [];
        const cleanRuns = runs1.filter((r: any) => r.text && r.text !== ' • ');
        const author = cleanRuns[1]?.text || 'YouTube Music';
        const itemCount = cleanRuns[2]?.text || '';

        const thumbs = item.thumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails;
        const thumb = getBestThumbnail(thumbs);

        playlists.push({
          id: browseId,
          title,
          author,
          itemCount,
          thumb,
        });
      }
      return { playlists, filter: 'playlists' };
    }

    // Default: songs
    const tracks: Track[] = [];
    for (const raw of rawItems.slice(0, limit)) {
      const item = raw.musicResponsiveListItemRenderer;
      if (!item) continue;

      const videoId =
        item.playlistItemData?.videoId ||
        item.navigationEndpoint?.watchEndpoint?.videoId ||
        item.overlay?.musicItemThumbnailOverlayRenderer?.content?.musicPlayButtonRenderer?.playNavigationEndpoint?.watchEndpoint?.videoId;

      if (!videoId) continue;

      const col0 = item.flexColumns?.[0]?.musicResponsiveListItemFlexColumnRenderer;
      const title = col0?.title?.runs?.[0]?.text || col0?.text?.runs?.[0]?.text || 'Judul Lagu';

      const col1 = item.flexColumns?.[1]?.musicResponsiveListItemFlexColumnRenderer;
      const runs1 = (col1?.title?.runs || col1?.text?.runs || []).filter(
        (r: any) => r.text && r.text !== ' • '
      );

      let artistName = 'Artis';
      let artistId = '';
      let albumName = 'Single';
      let durationStr = '';

      if (runs1.length > 0) {
        artistName = runs1[0].text;
        artistId = runs1[0].navigationEndpoint?.browseEndpoint?.browseId || '';
      }

      if (runs1.length > 1) {
        if (runs1.length === 2) {
          if (/^\d+[:.]\d+$/.test(runs1[1].text.trim())) {
            durationStr = runs1[1].text;
          } else {
            albumName = runs1[1].text;
          }
        } else {
          albumName = runs1[1].text;
          durationStr = runs1[runs1.length - 1].text;
        }
      }

      const thumbs = item.thumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails;
      const thumb =
        getBestThumbnail(thumbs) || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

      const duration = parseDuration(durationStr);

      tracks.push({
        id: videoId,
        title,
        artist: artistName,
        artistId,
        album: albumName,
        thumb,
        thumbnail: thumb,
        duration,
        source: 'ytmusic-native',
      });
    }

    return { results: tracks, filter: 'songs' };
  } catch (error) {
    console.error('ytSearch native error:', error);
    return { filter, results: [] };
  }
}

/**
 * Fetch live search suggestions (autocomplete) from YouTube Music
 */
export async function ytGetSearchSuggestions(query: string): Promise<string[]> {
  if (!query || query.trim().length < 2) return [];

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(`${INNERTUBE_API_BASE}/music/get_search_suggestions?prettyPrint=false`, {
      method: 'POST',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify({
        context: DEFAULT_CONTEXT,
        input: query.trim(),
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) return [];

    const data = await res.json();
    const rawSuggestions =
      data?.contents?.[0]?.searchSuggestionsSectionRenderer?.contents || [];

    const suggestions: string[] = [];
    for (const s of rawSuggestions) {
      const item = s.searchSuggestionRenderer || s.historySuggestionRenderer;
      if (!item) continue;
      const text =
        item.navigationEndpoint?.searchEndpoint?.query ||
        item.suggestion?.runs?.map((r: any) => r.text).join('');
      if (text && !suggestions.includes(text)) {
        suggestions.push(text);
      }
    }

    return suggestions;
  } catch (error) {
    console.error('ytGetSearchSuggestions error:', error);
    return [];
  }
}

/**
 * Fetch full artist profile, top tracks, albums, and singles
 */
export async function ytGetArtist(artistNameOrId: string): Promise<YtArtistDetails | null> {
  const query = artistNameOrId.trim();
  if (!query) return null;

  try {
    let browseId = query;

    // If query is an artist name rather than a browseId (e.g. UC...), search for it first
    if (!query.startsWith('UC') && !query.startsWith('FEmusic_library_privately_owned_artist_detail')) {
      const searchRes = await ytSearch(query, 'artists', 1);
      if (searchRes.artists && searchRes.artists.length > 0 && searchRes.artists[0].id) {
        browseId = searchRes.artists[0].id;
      } else {
        return null;
      }
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(`${INNERTUBE_API_BASE}/browse?prettyPrint=false`, {
      method: 'POST',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify({
        context: DEFAULT_CONTEXT,
        browseId,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) return null;

    const data = await res.json();
    const header =
      data.header?.musicImmersiveHeaderRenderer || data.header?.musicVisualHeaderRenderer;

    const name = header?.title?.runs?.[0]?.text || query;
    const subscribers =
      header?.subscriptionButton?.subscribeButtonRenderer?.subscriberCountText?.runs?.[0]?.text ||
      '';

    const headerThumbs =
      header?.thumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails ||
      header?.foregroundThumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails;
    const avatar = getBestThumbnail(headerThumbs);

    const sections =
      data.contents?.singleColumnBrowseResultsRenderer?.tabs?.[0]?.tabRenderer?.content
        ?.sectionListRenderer?.contents || [];

    // 1. Top Popular Tracks
    const topShelf = sections[0]?.musicShelfRenderer;
    const popularTracks: Track[] = [];

    for (const raw of topShelf?.contents || []) {
      const item = raw.musicResponsiveListItemRenderer;
      if (!item) continue;

      const videoId =
        item.playlistItemData?.videoId || item.navigationEndpoint?.watchEndpoint?.videoId;
      if (!videoId) continue;

      const title =
        item.flexColumns?.[0]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs?.[0]?.text ||
        item.flexColumns?.[0]?.musicResponsiveListItemFlexColumnRenderer?.title?.runs?.[0]?.text ||
        'Lagu';

      const artist =
        item.flexColumns?.[1]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs?.[0]?.text ||
        name;

      const album =
        item.flexColumns?.[3]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs?.[0]?.text ||
        'Single';

      const thumbs = item.thumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails;
      const thumb =
        getBestThumbnail(thumbs) || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

      popularTracks.push({
        id: videoId,
        title,
        artist,
        album,
        thumb,
        thumbnail: thumb,
        duration: 210,
        source: 'ytmusic-native-artist',
      });
    }

    // 2. Albums & Singles from carousels
    const albums: { id: string; title: string; type: string; year: string; thumb: string }[] = [];
    const singles: { id: string; title: string; type: string; year: string; thumb: string }[] = [];

    for (let i = 1; i < sections.length; i++) {
      const cs = sections[i]?.musicCarouselShelfRenderer;
      if (!cs) continue;

      const sectionTitle = (
        cs.header?.musicCarouselShelfBasicHeaderRenderer?.title?.runs?.[0]?.text || ''
      ).toLowerCase();

      const items = cs.contents || [];

      for (const raw of items) {
        const card = raw.musicTwoRowItemRenderer;
        if (!card) continue;

        const cardTitle = card.title?.runs?.[0]?.text || '';
        const cardBrowseId = card.navigationEndpoint?.browseEndpoint?.browseId || '';
        const year = card.subtitle?.runs?.map((r: any) => r.text).join('') || '';
        const thumbs =
          card.thumbnailRenderer?.musicThumbnailRenderer?.thumbnail?.thumbnails ||
          card.thumbnailRenderer?.croppedSquareThumbnailRenderer?.thumbnail?.thumbnails ||
          card.thumbnail?.thumbnails ||
          card.thumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails;
        const thumb = getBestThumbnail(thumbs) || avatar || '';

        if (sectionTitle.includes('album')) {
          albums.push({ id: cardBrowseId, title: cardTitle, type: 'Album', year, thumb });
        } else if (sectionTitle.includes('single') || sectionTitle.includes('ep')) {
          singles.push({ id: cardBrowseId, title: cardTitle, type: 'Single', year, thumb });
        }
      }
    }

    return {
      name,
      id: browseId,
      description: '',
      subscribers,
      avatar,
      popularTracks,
      albums,
      singles,
    };
  } catch (error) {
    console.error('ytGetArtist error:', error);
    return null;
  }
}
