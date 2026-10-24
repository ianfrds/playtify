-- ========================================================
-- PLAYTIFY SUPABASE DATABASE SCHEMA
-- Jalankan skrip ini di Supabase: Dashboard > SQL Editor > New Query
-- ========================================================

-- 1. Tabel Playlists
CREATE TABLE IF NOT EXISTS public.playlists (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  cover TEXT DEFAULT '',
  created_at BIGINT DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabel Playlist Tracks (Relasi Lagu ke Playlist)
CREATE TABLE IF NOT EXISTS public.playlist_tracks (
  id TEXT PRIMARY KEY,
  playlist_id TEXT NOT NULL REFERENCES public.playlists(id) ON DELETE CASCADE,
  track_id TEXT NOT NULL,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  album TEXT DEFAULT 'Single',
  thumb TEXT DEFAULT '',
  duration INTEGER DEFAULT 210,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabel Liked Tracks (Lagu yang Disukai)
CREATE TABLE IF NOT EXISTS public.liked_tracks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  album TEXT DEFAULT 'Single',
  thumb TEXT DEFAULT '',
  duration INTEGER DEFAULT 210,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Aktifkan Row Level Security (RLS)
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.liked_tracks ENABLE ROW LEVEL SECURITY;

-- 5. Kebijakan Akses (Policies) untuk Publishable API Key
-- Playlists Policies
DROP POLICY IF EXISTS "Allow public read playlists" ON public.playlists;
CREATE POLICY "Allow public read playlists" ON public.playlists FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert playlists" ON public.playlists;
CREATE POLICY "Allow public insert playlists" ON public.playlists FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update playlists" ON public.playlists;
CREATE POLICY "Allow public update playlists" ON public.playlists FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public delete playlists" ON public.playlists;
CREATE POLICY "Allow public delete playlists" ON public.playlists FOR DELETE USING (true);

-- Playlist Tracks Policies
DROP POLICY IF EXISTS "Allow public read playlist_tracks" ON public.playlist_tracks;
CREATE POLICY "Allow public read playlist_tracks" ON public.playlist_tracks FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert playlist_tracks" ON public.playlist_tracks;
CREATE POLICY "Allow public insert playlist_tracks" ON public.playlist_tracks FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update playlist_tracks" ON public.playlist_tracks;
CREATE POLICY "Allow public update playlist_tracks" ON public.playlist_tracks FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public delete playlist_tracks" ON public.playlist_tracks;
CREATE POLICY "Allow public delete playlist_tracks" ON public.playlist_tracks FOR DELETE USING (true);

-- Liked Tracks Policies
DROP POLICY IF EXISTS "Allow public read liked_tracks" ON public.liked_tracks;
CREATE POLICY "Allow public read liked_tracks" ON public.liked_tracks FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert liked_tracks" ON public.liked_tracks;
CREATE POLICY "Allow public insert liked_tracks" ON public.liked_tracks FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public delete liked_tracks" ON public.liked_tracks;
CREATE POLICY "Allow public delete liked_tracks" ON public.liked_tracks FOR DELETE USING (true);

-- Indeks untuk performa query cepat
CREATE INDEX IF NOT EXISTS idx_playlist_tracks_playlist ON public.playlist_tracks (playlist_id);
CREATE INDEX IF NOT EXISTS idx_playlist_tracks_position ON public.playlist_tracks (position);
CREATE INDEX IF NOT EXISTS idx_liked_tracks_created ON public.liked_tracks (created_at DESC);
