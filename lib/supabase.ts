import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Track, UserPlaylist } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ekcawdfrbjkfctnsnnea.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_NOYBRVBmKzvu4sTTg9i2BQ_ePkqPeS4';

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      })
    : null;

/**
 * Sign in with Google OAuth via Supabase
 */
export async function signInWithGoogle(redirectTo?: string) {
  if (!supabase) return { data: null, error: new Error('Supabase client belum terhubung') };
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const redirect = redirectTo || `${origin}/auth/callback`;
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirect,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });
}

/**
 * Sign in with Email and Password
 */
export async function signInWithEmail(email: string, password: string) {
  if (!supabase) return { data: null, error: new Error('Supabase client belum terhubung') };
  return supabase.auth.signInWithPassword({ email: email.trim(), password });
}

/**
 * Sign up with Email and Password + Full Name
 */
export async function signUpWithEmail(email: string, password: string, fullName?: string) {
  if (!supabase) return { data: null, error: new Error('Supabase client belum terhubung') };
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: {
        full_name: fullName?.trim(),
        name: fullName?.trim(),
      },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });
}

/**
 * Sign out current user
 */
export async function signOutUser() {
  if (!supabase) return { error: null };
  return supabase.auth.signOut();
}

/**
 * Get current session and user
 */
export async function getSessionAndUser() {
  if (!supabase) return { session: null, user: null };
  const { data: { session } } = await supabase.auth.getSession();
  return { session, user: session?.user ?? null };
}

/**
 * Fetch all user playlists and their tracks from Supabase
 */
export async function fetchRemotePlaylists(): Promise<UserPlaylist[] | null> {
  if (!supabase) return null;

  try {
    const { data: playlistsData, error: plError } = await supabase
      .from('playlists')
      .select('*')
      .order('created_at', { ascending: false });

    if (plError || !playlistsData) {
      return null;
    }

    const { data: tracksData, error: trError } = await supabase
      .from('playlist_tracks')
      .select('*')
      .order('position', { ascending: true });

    if (trError) {
      console.warn('Error fetching playlist_tracks:', trError.message);
    }

    const allTracks = tracksData || [];

    const result: UserPlaylist[] = playlistsData.map((pl: any) => {
      const plTracks: Track[] = allTracks
        .filter((t: any) => t.playlist_id === pl.id)
        .map((t: any) => ({
          id: t.track_id,
          title: t.title,
          artist: t.artist,
          album: t.album,
          thumb: t.thumb,
          thumbnail: t.thumb,
          duration: t.duration || 210,
        }));

      return {
        id: pl.id,
        name: pl.name,
        desc: pl.description || '',
        description: pl.description || '',
        cover: pl.cover || '',
        createdAt: Number(pl.created_at) || Date.now(),
        tracks: plTracks,
      };
    });

    return result;
  } catch (err) {
    console.warn('fetchRemotePlaylists error:', err);
    return null;
  }
}

/**
 * Upsert (create or update) a playlist in Supabase
 */
export async function upsertRemotePlaylist(playlist: UserPlaylist): Promise<void> {
  if (!supabase) return;

  try {
    await supabase.from('playlists').upsert({
      id: playlist.id,
      name: playlist.name,
      description: playlist.description || playlist.desc || '',
      cover: playlist.cover || '',
      created_at: playlist.createdAt || Date.now(),
      updated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('upsertRemotePlaylist error:', err);
  }
}

/**
 * Delete a playlist from Supabase (cascades to tracks)
 */
export async function deleteRemotePlaylist(playlistId: string): Promise<void> {
  if (!supabase) return;

  try {
    await supabase.from('playlists').delete().eq('id', playlistId);
  } catch (err) {
    console.warn('deleteRemotePlaylist error:', err);
  }
}

/**
 * Add a track to a playlist in Supabase
 */
export async function addTrackToRemotePlaylist(
  playlistId: string,
  track: Track,
  position: number = 0
): Promise<void> {
  if (!supabase) return;

  try {
    const recordId = `${playlistId}_${track.id}`;
    await supabase.from('playlist_tracks').upsert({
      id: recordId,
      playlist_id: playlistId,
      track_id: track.id,
      title: track.title,
      artist: track.artist,
      album: track.album || 'Single',
      thumb: track.thumbnail || track.thumb || '',
      duration: track.duration || 210,
      position,
    });
  } catch (err) {
    console.warn('addTrackToRemotePlaylist error:', err);
  }
}

/**
 * Remove a track from a playlist in Supabase
 */
export async function removeTrackFromRemotePlaylist(
  playlistId: string,
  trackId: string
): Promise<void> {
  if (!supabase) return;

  try {
    await supabase
      .from('playlist_tracks')
      .delete()
      .eq('playlist_id', playlistId)
      .eq('track_id', trackId);
  } catch (err) {
    console.warn('removeTrackFromRemotePlaylist error:', err);
  }
}

/**
 * Fetch liked tracks from Supabase
 */
export async function fetchRemoteLikedTracks(): Promise<Track[] | null> {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('liked_tracks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return null;

    return data.map((t: any) => ({
      id: t.id,
      title: t.title,
      artist: t.artist,
      album: t.album,
      thumb: t.thumb,
      thumbnail: t.thumb,
      duration: t.duration || 210,
    }));
  } catch (err) {
    console.warn('fetchRemoteLikedTracks error:', err);
    return null;
  }
}

/**
 * Add track to liked_tracks table in Supabase
 */
export async function addRemoteLikedTrack(track: Track): Promise<void> {
  if (!supabase) return;

  try {
    await supabase.from('liked_tracks').upsert({
      id: track.id,
      title: track.title,
      artist: track.artist,
      album: track.album || 'Single',
      thumb: track.thumbnail || track.thumb || '',
      duration: track.duration || 210,
    });
  } catch (err) {
    console.warn('addRemoteLikedTrack error:', err);
  }
}

/**
 * Remove track from liked_tracks table in Supabase
 */
export async function removeRemoteLikedTrack(trackId: string): Promise<void> {
  if (!supabase) return;

  try {
    await supabase.from('liked_tracks').delete().eq('id', trackId);
  } catch (err) {
    console.warn('removeRemoteLikedTrack error:', err);
  }
}
