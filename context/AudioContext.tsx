'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useMemo } from 'react';
import { Track, UserPlaylist, CuratedPlaylist } from '@/types';
import { ALL_RECOMMENDATIONS_POOL, RECOMMENDATIONS_DATA, CURATED_PLAYLISTS } from '@/data/recommendations';
import { sanitizeTrack, sanitizeTracks } from '@/lib/trackSanitizer';
import {
  fetchRemotePlaylists,
  upsertRemotePlaylist,
  deleteRemotePlaylist,
  addTrackToRemotePlaylist,
  removeTrackFromRemotePlaylist,
  fetchRemoteLikedTracks,
  addRemoteLikedTrack,
  removeRemoteLikedTrack,
  supabase,
  signOutUser,
} from '@/lib/supabase';

interface AudioContextType {
  user: any | null;
  session: any | null;
  signOut: () => Promise<void>;
  isGuest: boolean;
  isAuthLoading: boolean;
  enterGuestMode: () => void;
  isAuthModalOpen: boolean;
  authModalTitle: string;
  authModalSubtitle: string;
  openAuthModal: (title?: string, subtitle?: string) => void;
  closeAuthModal: () => void;

  brandName: string;
  setBrandName: (name: string) => void;
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  queue: Track[];
  queueIndex: number;
  clearQueue: () => void;
  removeFromQueue: (index: number) => void;
  history: Track[];
  smartRecommendations: Track[];
  curatedPlaylists: CuratedPlaylist[];
  userTasteProfile: {
    topGenre: string | null;
    topArtist: string | null;
    totalListened: number;
    summary: string;
  };
  isShuffle: boolean;
  repeatMode: string | number;
  likedTracks: Track[];
  playlists: UserPlaylist[];
  followedArtists: string[];
  recommendations: Track[];

  activeRightSidebar: 'nowPlaying' | 'lyrics' | 'queue' | null;
  isNowPlayingSidebarOpen: boolean;
  isQueueSidebarOpen: boolean;
  isLyricsSidebarOpen: boolean;
  isLyricsFullscreen: boolean;
  isRecDrawerOpen: boolean;
  isNowPlayingModalOpen: boolean;
  isLyricsModalOpen: boolean;
  isBrandModalOpen: boolean;
  isNewPlaylistModalOpen: boolean;
  openNewPlaylistModal: () => void;
  toastMessage: string | null;

  toggleNowPlayingSidebar: (force?: boolean) => void;
  toggleQueueSidebar: (force?: boolean) => void;
  toggleLyricsSidebar: (force?: boolean) => void;
  toggleLyricsModal: (force?: boolean) => void;
  openFullscreenLyrics: () => void;
  closeFullscreenLyrics: () => void;
  setIsLyricsModalOpen: (open: boolean) => void;
  setIsLyricsSidebarOpen: (open: boolean) => void;
  setIsLyricsFullscreen: (open: boolean) => void;

  playTrack: (track: Track, newQueue?: Track[]) => void;
  togglePlayPause: () => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrev: () => void;
  seekTo: (time: number) => void;
  seek: (time: number) => void;
  setVolume: (val: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  toggleLike: (track: Track) => void;
  isLiked: (id: string) => boolean;
  toggleFollowArtist: (name: string) => void;
  isArtistFollowed: (name: string) => boolean;
  createPlaylist: (name: string) => void;
  addTrackToPlaylist: (playlistId: string, track: Track) => void;
  deletePlaylist: (playlistId: string) => void;
  updatePlaylist: (playlistId: string, updates: { name?: string; description?: string; cover?: string }) => void;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void;
  refreshRecommendations: (silent?: boolean) => Promise<void>;

  openNowPlayingModal: () => void;
  closeNowPlayingModal: () => void;
  setNowPlayingModalOpen: (open: boolean) => void;
  toggleRecDrawer: (force?: boolean) => void;
  setIsBrandModalOpen: (open: boolean) => void;
  setIsNewPlaylistModalOpen: (open: boolean) => void;

  isEditPlaylistModalOpen: boolean;
  setIsEditPlaylistModalOpen: (open: boolean) => void;
  editingPlaylist: UserPlaylist | null;
  openEditPlaylistModal: (playlist: UserPlaylist) => void;
  closeEditPlaylistModal: () => void;

  isDeletePlaylistModalOpen: boolean;
  setIsDeletePlaylistModalOpen: (open: boolean) => void;
  deletingPlaylist: UserPlaylist | null;
  openDeletePlaylistModal: (playlist: UserPlaylist) => void;
  closeDeletePlaylistModal: () => void;
  showToast: (msg: string) => void;

  // Internal player synchronization
  setPlayer: (player: any) => void;
  onPlayerReady: (player: any) => void;
  onPlayerStateChange: (state: number) => void;
  onProgressUpdate: (curr: number, dur: number) => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTitle, setAuthModalTitle] = useState<string>('Masuk ke Haytify');
  const [authModalSubtitle, setAuthModalSubtitle] = useState<string>(
    'Nikmati musik tanpa batas dan sinkronkan playlist di cloud.'
  );

  const [brandName, setBrandNameState] = useState<string>('Haytify');
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolumeState] = useState<number>(0.8);
  const [queue, setQueue] = useState<Track[]>([]);
  const [history, setHistory] = useState<Track[]>([]);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<number>(0); // 0 = off, 1 = all, 2 = one
  const [likedTracks, setLikedTracks] = useState<Track[]>([]);
  const [playlists, setPlaylists] = useState<UserPlaylist[]>([]);
  const [curatedPlaylists, setCuratedPlaylists] = useState<CuratedPlaylist[]>(CURATED_PLAYLISTS);
  const [followedArtists, setFollowedArtists] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<Track[]>(ALL_RECOMMENDATIONS_POOL);

  // UI states (Unified right sidebar slot so they never overlap)
  const [activeRightSidebar, setActiveRightSidebar] = useState<'nowPlaying' | 'lyrics' | 'queue' | null>(null);
  const [isLyricsFullscreen, setIsLyricsFullscreen] = useState<boolean>(false);
  const isNowPlayingSidebarOpen = activeRightSidebar === 'nowPlaying';
  const isLyricsSidebarOpen = activeRightSidebar === 'lyrics';
  const isQueueSidebarOpen = activeRightSidebar === 'queue';
  const isLyricsModalOpen = isLyricsSidebarOpen || isLyricsFullscreen;

  const [isRecDrawerOpen, setIsRecDrawerOpen] = useState<boolean>(false);
  const [isNowPlayingModalOpen, setIsNowPlayingModalOpen] = useState<boolean>(false);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState<boolean>(false);
  const [isNewPlaylistModalOpen, setIsNewPlaylistModalOpen] = useState<boolean>(false);
  const [isEditPlaylistModalOpen, setIsEditPlaylistModalOpen] = useState<boolean>(false);
  const [editingPlaylist, setEditingPlaylist] = useState<UserPlaylist | null>(null);
  const [isDeletePlaylistModalOpen, setIsDeletePlaylistModalOpen] = useState<boolean>(false);
  const [deletingPlaylist, setDeletingPlaylist] = useState<UserPlaylist | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const playerRef = useRef<any>(null);

  const showToast = (msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Live Auto-Updating Recommendations logic (Updates every 24 hours automatically)
  const refreshRecommendations = async (silent = false) => {
    try {
      const res = await fetch('/api/recommendations?refresh=true');
      if (res.ok) {
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          const mapped: Track[] = data.results.map((t: any) => ({
            id: t.id,
            title: t.title,
            artist: t.artist,
            thumb: t.thumbnail || t.thumb,
            thumbnail: t.thumbnail || t.thumb,
            duration: t.duration || 210,
            badge: t.badge || 'UPDATE TERKINI',
            artistId: t.artistId || t.artist.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          }));
          setRecommendations(sanitizeTracks(mapped));
        }

        if (data.playlists && Array.isArray(data.playlists) && data.playlists.length > 0) {
          const cleanedPlaylists = data.playlists.map((pl: CuratedPlaylist) => ({
            ...pl,
            tracks: sanitizeTracks(pl.tracks || []),
          }));
          setCuratedPlaylists(cleanedPlaylists);
          localStorage.setItem('playtify_curated_playlists', JSON.stringify(cleanedPlaylists));
        }

        localStorage.setItem('playtify_playlists_last_updated', Date.now().toString());
        if (!silent) showToast('Playlist rekomendasi diperbarui');
        return;
      }
    } catch (e) {
      console.warn('Live recommendation fetch failed, using fallback pool:', e);
    }
    setRecommendations(sanitizeTracks(ALL_RECOMMENDATIONS_POOL));
  };

  // Load initial persistent state from localStorage
  useEffect(() => {
    try {
      const savedGuest = localStorage.getItem('playtify_guest');
      if (savedGuest === 'true') setIsGuest(true);

      const savedBrand = localStorage.getItem('haytify_brand') || localStorage.getItem('playtify_brand');
      if (savedBrand && savedBrand !== 'Playtify') {
        setBrandNameState(savedBrand);
      } else {
        setBrandNameState('Haytify');
      }

      const savedVol = localStorage.getItem('playtify_volume');
      if (savedVol) setVolumeState(parseFloat(savedVol));

      const savedLiked = localStorage.getItem('playtify_liked');
      if (savedLiked) setLikedTracks(sanitizeTracks(JSON.parse(savedLiked)));

      const savedPlaylists = localStorage.getItem('playtify_playlists');
      if (savedPlaylists) {
        const parsed = JSON.parse(savedPlaylists);
        const cleaned = parsed.map((pl: any) => ({
          ...pl,
          tracks: sanitizeTracks(pl.tracks || []),
        }));
        setPlaylists(cleaned);
      }

      const savedFollowed = localStorage.getItem('playtify_followed_artists');
      if (savedFollowed) setFollowedArtists(JSON.parse(savedFollowed));

      const savedHistory = localStorage.getItem('playtify_playback_history');
      if (savedHistory) setHistory(sanitizeTracks(JSON.parse(savedHistory)));

      const savedCurated = localStorage.getItem('playtify_curated_playlists');
      if (savedCurated) {
        try {
          const parsed = JSON.parse(savedCurated);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCuratedPlaylists(parsed);
          }
        } catch {
          // ignore
        }
      }

      // Check 24-hour auto-update for Rekomendasi Playlist Populer
      const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
      const lastUpdatedStr = localStorage.getItem('playtify_playlists_last_updated');
      const lastUpdated = lastUpdatedStr ? parseInt(lastUpdatedStr, 10) : 0;
      const now = Date.now();

      if (!lastUpdated || (now - lastUpdated) >= TWENTY_FOUR_HOURS) {
        refreshRecommendations(true);
      }

      const initialPool = RECOMMENDATIONS_DATA.top_indo || [];
      if (initialPool.length > 0) {
        setQueue(sanitizeTracks(initialPool.slice(1)));
      }
    } catch (e) {
      // Ignore
    }

    // Asynchronously sync with Supabase Cloud
    fetchRemotePlaylists().then((remotePl) => {
      if (remotePl && remotePl.length > 0) {
        setPlaylists(remotePl);
        try {
          localStorage.setItem('playtify_playlists', JSON.stringify(remotePl));
        } catch {
          // ignore
        }
      }
    });

    fetchRemoteLikedTracks().then((remoteLikes) => {
      if (remoteLikes && remoteLikes.length > 0) {
        setLikedTracks(remoteLikes);
        try {
          localStorage.setItem('playtify_liked', JSON.stringify(remoteLikes));
        } catch {
          // ignore
        }
      }
    });

    // Listen to Supabase Auth State Changes
    let authSubscription: any = null;
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsAuthLoading(false);
      }).catch(() => {
        setIsAuthLoading(false);
      });

      const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setIsAuthLoading(false);
      });
      authSubscription = data?.subscription;
    } else {
      setIsAuthLoading(false);
    }

    // Periodic check every hour: auto-updates recommendations every 24 hours
    const timer = setInterval(() => {
      const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
      const lastUpdatedStr = localStorage.getItem('playtify_playlists_last_updated');
      const lastUpdated = lastUpdatedStr ? parseInt(lastUpdatedStr, 10) : 0;
      if (Date.now() - lastUpdated >= TWENTY_FOUR_HOURS) {
        refreshRecommendations(true);
      }
    }, 60 * 60 * 1000);

    return () => {
      clearInterval(timer);
      if (authSubscription) authSubscription.unsubscribe();
    };
  }, []);

  const openAuthModal = (title?: string, subtitle?: string) => {
    if (title) setAuthModalTitle(title);
    else setAuthModalTitle('Masuk ke Haytify');
    if (subtitle) setAuthModalSubtitle(subtitle);
    else setAuthModalSubtitle('Nikmati musik tanpa batas dan sinkronkan playlist di cloud.');
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const enterGuestMode = () => {
    setIsGuest(true);
    try {
      localStorage.setItem('playtify_guest', 'true');
    } catch {}
    showToast('Selamat menikmati musik di Haytify!');
  };

  const signOut = async () => {
    await signOutUser();
    setUser(null);
    setSession(null);
    setIsGuest(false);
    try {
      localStorage.removeItem('playtify_guest');
    } catch {}
    showToast('Berhasil keluar dari akun');
  };

  const setBrandName = (name: string) => {
    setBrandNameState(name);
    localStorage.setItem('haytify_brand', name);
    localStorage.setItem('playtify_brand', name);
    document.title = `${name} - Web Music Streaming`;
    showToast(`Brand diubah menjadi "${name}"`);
  };

  const playTrack = (rawTrack: Track, rawQueue?: Track[]) => {
    const track = sanitizeTrack(rawTrack);
    const newQueue = rawQueue ? sanitizeTracks(rawQueue) : undefined;
    if (track) {
      setHistory((prev) => {
        const filtered = prev.filter((t) => t.id !== track.id);
        const updated = [track, ...filtered.slice(0, 49)];
        try {
          localStorage.setItem('playtify_playback_history', JSON.stringify(updated));
        } catch {}
        return updated;
      });
    }

    setCurrentTrack(track);
    setIsPlaying(true);
    setCurrentTime(0);
    setDuration(track.duration || 0);

    if (newQueue) {
      setQueue(newQueue);
    }

    if (playerRef.current && typeof playerRef.current.loadVideoById === 'function') {
      playerRef.current.loadVideoById({
        videoId: track.id,
        suggestedQuality: 'small',
      });
      playerRef.current.playVideo();
    }
  };

  // Algorithmic Smart Recommendations based on user history & genre
  const { smartRecommendations, userTasteProfile } = useMemo(() => {
    if (!history || history.length === 0) {
      return {
        smartRecommendations: ALL_RECOMMENDATIONS_POOL.slice(0, 10),
        userTasteProfile: {
          topGenre: null,
          topArtist: null,
          totalListened: 0,
          summary: 'Dengarkan lagu favoritmu untuk mendapatkan rekomendasi yang dipersonalisasi.',
        },
      };
    }

    // Tally genre and artist preferences with recency weighting
    const genreScore: Record<string, number> = {};
    const artistScore: Record<string, number> = {};

    history.forEach((track, index) => {
      const recencyWeight = Math.max(1, 10 - Math.floor(index / 2));
      if (track.badge) {
        genreScore[track.badge] = (genreScore[track.badge] || 0) + recencyWeight;
      }
      if (track.artist) {
        artistScore[track.artist] = (artistScore[track.artist] || 0) + recencyWeight * 1.5;
      }
    });

    const sortedGenres = Object.entries(genreScore).sort((a, b) => b[1] - a[1]);
    const sortedArtists = Object.entries(artistScore).sort((a, b) => b[1] - a[1]);

    const topGenre = sortedGenres[0]?.[0] || 'Pop Indonesia';
    const topArtist = sortedArtists[0]?.[0] || '';

    const historyIds = new Set(history.map((t) => t.id));

    // Score catalog tracks
    const scoredTracks = ALL_RECOMMENDATIONS_POOL.map((track) => {
      let score = 0;
      if (track.badge && genreScore[track.badge]) {
        score += genreScore[track.badge] * 2.5;
      }
      if (track.artist && artistScore[track.artist]) {
        score += artistScore[track.artist] * 3.5;
      }
      // Give bonus to fresh tracks not yet in history
      if (!historyIds.has(track.id)) {
        score += 8;
      }
      return { track, score };
    });

    scoredTracks.sort((a, b) => b.score - a.score);
    const recs = scoredTracks.slice(0, 10).map((s) => s.track);

    let summary = `Karena kamu sering mendengarkan genre ${topGenre}`;
    if (topArtist) {
      summary += ` dan lagu dari ${topArtist}`;
    }

    return {
      smartRecommendations: recs,
      userTasteProfile: {
        topGenre,
        topArtist,
        totalListened: history.length,
        summary,
      },
    };
  }, [history]);

  const togglePlayPause = () => {
    if (!currentTrack) {
      const first = recommendations[0] || RECOMMENDATIONS_DATA.top_indo?.[0];
      if (first) playTrack(first, recommendations);
      return;
    }

    if (isPlaying) {
      if (playerRef.current?.pauseVideo) playerRef.current.pauseVideo();
      setIsPlaying(false);
    } else {
      if (playerRef.current?.playVideo) playerRef.current.playVideo();
      setIsPlaying(true);
    }
  };

  const playNext = () => {
    if (repeatMode === 2 && currentTrack) {
      seekTo(0);
      if (playerRef.current?.playVideo) playerRef.current.playVideo();
      setIsPlaying(true);
      return;
    }

    if (queue.length > 0) {
      let nextTrack: Track;
      let nextQueue: Track[];

      if (isShuffle) {
        const randomIndex = Math.floor(Math.random() * queue.length);
        nextTrack = queue[randomIndex];
        nextQueue = queue.filter((_, idx) => idx !== randomIndex);
      } else {
        nextTrack = queue[0];
        nextQueue = queue.slice(1);
      }

      setQueue(nextQueue);
      playTrack(nextTrack);
    } else {
      if (repeatMode === 1 && history.length > 0) {
        const restartedQueue = [...history].reverse();
        const next = restartedQueue[0];
        setHistory([]);
        playTrack(next, restartedQueue.slice(1));
      } else {
        showToast('Antrian telah selesai');
        setIsPlaying(false);
      }
    }
  };

  const playPrev = () => {
    if (currentTime > 3) {
      seekTo(0);
      return;
    }
    if (history.length > 0) {
      const prev = history[0];
      setHistory((h) => h.slice(1));
      if (currentTrack) setQueue((q) => [currentTrack, ...q]);
      playTrack(prev);
    } else {
      seekTo(0);
    }
  };

  const clearQueue = () => {
    setQueue([]);
    showToast('Antrean dibersihkan');
  };

  const removeFromQueue = (index: number) => {
    setQueue((prev) => prev.filter((_, i) => i !== index));
    showToast('Lagu dihapus dari antrean');
  };

  const seekTo = (seconds: number) => {
    setCurrentTime(seconds);
    if (playerRef.current?.seekTo) {
      playerRef.current.seekTo(seconds, true);
    }
  };

  const setVolume = (val: number) => {
    const clamped = Math.max(0, Math.min(1, val));
    setVolumeState(clamped);
    localStorage.setItem('playtify_volume', clamped.toString());
    if (playerRef.current?.setVolume) {
      playerRef.current.setVolume(clamped * 100);
    }
  };

  const toggleShuffle = () => {
    setIsShuffle((prev) => {
      const next = !prev;
      showToast(next ? 'Shuffle aktif' : 'Shuffle nonaktif');
      return next;
    });
  };

  const toggleRepeat = () => {
    setRepeatMode((prev) => {
      const next = (prev + 1) % 3;
      const labels = ['Repeat nonaktif', 'Repeat semua', 'Repeat satu'];
      showToast(labels[next]);
      return next;
    });
  };

  const toggleLike = (track: Track) => {
    if (!user) {
      openAuthModal(
        'Masuk untuk Menyimpan Favorit',
        'Simpan lagu favoritmu dan sinkronkan di semua perangkat dengan masuk ke akun Haytify.'
      );
      return;
    }
    setLikedTracks((prev) => {
      const exists = prev.some((t) => t.id === track.id);
      let updated: Track[];
      if (exists) {
        updated = prev.filter((t) => t.id !== track.id);
        showToast('Dihapus dari Lagu Disukai');
        removeRemoteLikedTrack(track.id);
      } else {
        updated = [track, ...prev];
        showToast('Ditambahkan ke Lagu Disukai');
        addRemoteLikedTrack(track);
      }
      try {
        localStorage.setItem('playtify_liked', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const isLiked = (id: string) => {
    return likedTracks.some((t) => t.id === id);
  };

  const toggleFollowArtist = (name: string) => {
    if (!user) {
      openAuthModal(
        'Masuk untuk Mengikuti Artis',
        'Ikuti artis favoritmu untuk rilis musik terbaru dengan akun Haytify.'
      );
      return;
    }
    setFollowedArtists((prev) => {
      const exists = prev.some((a) => a.toLowerCase() === name.toLowerCase());
      let updated: string[];
      if (exists) {
        updated = prev.filter((a) => a.toLowerCase() !== name.toLowerCase());
        showToast(`Berhenti mengikuti ${name}`);
      } else {
        updated = [...prev, name];
        showToast(`Mulai mengikuti ${name}`);
      }
      try {
        localStorage.setItem('playtify_followed_artists', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const isArtistFollowed = (name: string) => {
    return followedArtists.some((a) => a.toLowerCase() === name.toLowerCase());
  };

  const openNewPlaylistModal = () => {
    if (!user) {
      openAuthModal(
        'Masuk untuk Membuat Playlist',
        'Kumpulkan musik kesukaanmu dalam playlist pribadi dengan membuat atau masuk ke akun Haytify.'
      );
      return;
    }
    setIsNewPlaylistModalOpen(true);
  };

  const createPlaylist = (name: string) => {
    if (!user) {
      openAuthModal(
        'Masuk untuk Membuat Playlist',
        'Kumpulkan musik kesukaanmu dalam playlist pribadi dengan membuat atau masuk ke akun Haytify.'
      );
      return;
    }
    if (!name.trim()) return;
    const newPl: UserPlaylist = {
      id: 'pl-' + Date.now(),
      name: name.trim(),
      createdAt: Date.now(),
      tracks: [],
    };
    setPlaylists((prev) => {
      const updated = [newPl, ...prev];
      try {
        localStorage.setItem('playtify_playlists', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    upsertRemotePlaylist(newPl);
    showToast(`Playlist "${name}" dibuat`);
    setIsNewPlaylistModalOpen(false);
  };

  const addTrackToPlaylist = (playlistId: string, track: Track) => {
    setPlaylists((prev) => {
      const updated = prev.map((pl) => {
        if (pl.id === playlistId) {
          if (pl.tracks.some((t) => t.id === track.id)) {
            showToast('Lagu sudah ada di playlist ini');
            return pl;
          }
          showToast(`Lagu ditambahkan ke ${pl.name}`);
          const newTracks = [...pl.tracks, track];
          addTrackToRemotePlaylist(playlistId, track, newTracks.length - 1);
          return { ...pl, tracks: newTracks };
        }
        return pl;
      });
      try {
        localStorage.setItem('playtify_playlists', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const openEditPlaylistModal = (playlist: UserPlaylist) => {
    if (!user) {
      openAuthModal(
        'Masuk untuk Mengubah Playlist',
        'Masuk ke akun Haytify untuk mengedit playlist.'
      );
      return;
    }
    setEditingPlaylist(playlist);
    setIsEditPlaylistModalOpen(true);
  };

  const closeEditPlaylistModal = () => {
    setIsEditPlaylistModalOpen(false);
    setEditingPlaylist(null);
  };

  const openDeletePlaylistModal = (playlist: UserPlaylist) => {
    if (!user) {
      openAuthModal(
        'Masuk untuk Menghapus Playlist',
        'Masuk ke akun Haytify untuk mengelola playlist.'
      );
      return;
    }
    setDeletingPlaylist(playlist);
    setIsDeletePlaylistModalOpen(true);
  };

  const closeDeletePlaylistModal = () => {
    setIsDeletePlaylistModalOpen(false);
    setDeletingPlaylist(null);
  };

  const deletePlaylist = (playlistId: string) => {
    setPlaylists((prev) => {
      const updated = prev.filter((pl) => pl.id !== playlistId);
      try {
        localStorage.setItem('playtify_playlists', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    deleteRemotePlaylist(playlistId);
    showToast('Playlist berhasil dihapus');
    closeDeletePlaylistModal();
  };

  const updatePlaylist = (
    playlistId: string,
    updates: { name?: string; description?: string; cover?: string }
  ) => {
    setPlaylists((prev) => {
      let updatedTarget: UserPlaylist | null = null;
      const updated = prev.map((pl) => {
        if (pl.id === playlistId) {
          updatedTarget = {
            ...pl,
            name: updates.name !== undefined && updates.name.trim() ? updates.name.trim() : pl.name,
            description: updates.description !== undefined ? updates.description : (pl.description || pl.desc || ''),
            desc: updates.description !== undefined ? updates.description : (pl.description || pl.desc || ''),
            cover: updates.cover !== undefined ? updates.cover : pl.cover,
          };
          return updatedTarget;
        }
        return pl;
      });
      try {
        localStorage.setItem('playtify_playlists', JSON.stringify(updated));
      } catch {
        // ignore
      }
      if (updatedTarget) {
        upsertRemotePlaylist(updatedTarget);
      }
      return updated;
    });
    showToast('Playlist berhasil diperbarui');
    closeEditPlaylistModal();
  };

  const removeTrackFromPlaylist = (playlistId: string, trackId: string) => {
    setPlaylists((prev) => {
      const updated = prev.map((pl) => {
        if (pl.id === playlistId) {
          return {
            ...pl,
            tracks: pl.tracks.filter((t) => t.id !== trackId),
          };
        }
        return pl;
      });
      try {
        localStorage.setItem('playtify_playlists', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    removeTrackFromRemotePlaylist(playlistId, trackId);
    showToast('Lagu dihapus dari playlist');
  };

  const openNowPlayingModal = () => setIsNowPlayingModalOpen(true);
  const closeNowPlayingModal = () => setIsNowPlayingModalOpen(false);
  const setNowPlayingModalOpen = (open: boolean) => setIsNowPlayingModalOpen(open);

  const toggleNowPlayingSidebar = (force?: boolean) => {
    setActiveRightSidebar((prev) => {
      if (force === true) return 'nowPlaying';
      if (force === false) return prev === 'nowPlaying' ? null : prev;
      return prev === 'nowPlaying' ? null : 'nowPlaying';
    });
  };

  const toggleQueueSidebar = (force?: boolean) => {
    setActiveRightSidebar((prev) => {
      if (force === true) return 'queue';
      if (force === false) return prev === 'queue' ? null : prev;
      return prev === 'queue' ? null : 'queue';
    });
  };

  const toggleLyricsSidebar = (force?: boolean) => {
    setActiveRightSidebar((prev) => {
      if (force === true) return 'lyrics';
      if (force === false) return prev === 'lyrics' ? null : prev;
      return prev === 'lyrics' ? null : 'lyrics';
    });
  };

  const toggleLyricsModal = toggleLyricsSidebar;
  const openFullscreenLyrics = () => setIsLyricsFullscreen(true);
  const closeFullscreenLyrics = () => setIsLyricsFullscreen(false);
  const setIsLyricsSidebarOpen = (open: boolean) => toggleLyricsSidebar(open);
  const setIsLyricsModalOpen = (open: boolean) => {
    if (open) setIsLyricsFullscreen(true);
    else {
      setIsLyricsFullscreen(false);
      toggleLyricsSidebar(false);
    }
  };
  const toggleRecDrawer = (force?: boolean) => setIsRecDrawerOpen((p) => (force !== undefined ? force : !p));

  const setPlayer = (p: any) => {
    playerRef.current = p;
  };

  const onPlayerReady = (p: any) => {
    playerRef.current = p;
    p.setVolume(volume * 100);
  };

  const onPlayerStateChange = (eventCode: number) => {
    if (eventCode === 1) {
      setIsPlaying(true);
      if (playerRef.current?.getDuration) {
        const dur = playerRef.current.getDuration();
        if (dur) setDuration(dur);
      }
    } else if (eventCode === 2) {
      setIsPlaying(false);
    } else if (eventCode === 0) {
      playNext();
    }
  };

  const onProgressUpdate = (curr: number, dur: number) => {
    setCurrentTime(curr);
    if (dur && dur > 0) setDuration(dur);
  };

  const repeatModeLabel = repeatMode === 2 ? 'one' : repeatMode === 1 ? 'all' : 'off';
  const queueIndex = currentTrack ? queue.findIndex((t) => t.id === currentTrack.id) : 0;

  // MediaSession API for mobile lock screen & background controls
  useEffect(() => {
    if (typeof window === 'undefined' || !('mediaSession' in navigator)) return;

    if (currentTrack) {
      const artwork = [
        { src: currentTrack.thumb || '/icon-192.png', sizes: '96x96', type: 'image/jpeg' },
        { src: currentTrack.thumb || '/icon-192.png', sizes: '128x128', type: 'image/jpeg' },
        { src: currentTrack.thumb || '/icon-192.png', sizes: '192x192', type: 'image/jpeg' },
        { src: currentTrack.thumb || '/icon-512.png', sizes: '256x256', type: 'image/jpeg' },
        { src: currentTrack.thumb || '/icon-512.png', sizes: '512x512', type: 'image/jpeg' },
      ];

      try {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: currentTrack.title || 'Haytify Music',
          artist: currentTrack.artist || 'Haytify',
          album: currentTrack.album || 'Haytify Streaming',
          artwork,
        });
      } catch (err) {
        // ignore
      }
    }

    navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
  }, [currentTrack, isPlaying]);

  useEffect(() => {
    if (typeof window === 'undefined' || !('mediaSession' in navigator)) return;

    try {
      navigator.mediaSession.setActionHandler('play', () => {
        if (!isPlaying) togglePlayPause();
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        if (isPlaying) togglePlayPause();
      });
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        playPrev();
      });
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        playNext();
      });
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime !== undefined && details.seekTime !== null) {
          seekTo(details.seekTime);
        }
      });
      navigator.mediaSession.setActionHandler('seekbackward', (details) => {
        const skip = details.seekOffset || 10;
        seekTo(Math.max(0, currentTime - skip));
      });
      navigator.mediaSession.setActionHandler('seekforward', (details) => {
        const skip = details.seekOffset || 10;
        seekTo(Math.min(duration || 0, currentTime + skip));
      });
      navigator.mediaSession.setActionHandler('stop', () => {
        if (isPlaying) togglePlayPause();
      });
    } catch {
      // ignore
    }
  }, [isPlaying, currentTime, duration, playNext, playPrev, seekTo, togglePlayPause]);

  useEffect(() => {
    if (typeof window === 'undefined' || !('mediaSession' in navigator)) return;

    if ('setPositionState' in navigator.mediaSession && duration > 0) {
      try {
        navigator.mediaSession.setPositionState({
          duration: Math.max(0, duration),
          playbackRate: 1,
          position: Math.min(Math.max(0, currentTime), duration),
        });
      } catch {
        // ignore
      }
    }
  }, [currentTime, duration]);

  return (
    <AudioContext.Provider
      value={{
        user,
        session,
        signOut,
        isGuest,
        isAuthLoading,
        enterGuestMode,
        isAuthModalOpen,
        authModalTitle,
        authModalSubtitle,
        openAuthModal,
        closeAuthModal,

        brandName,
        setBrandName,
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        queue,
        queueIndex: queueIndex >= 0 ? queueIndex : 0,
        clearQueue,
        removeFromQueue,
        history,
        smartRecommendations,
        curatedPlaylists,
        userTasteProfile,
        isShuffle,
        repeatMode: repeatModeLabel,
        likedTracks,
        playlists,
        followedArtists,
        recommendations,
        isRecDrawerOpen,
        isNowPlayingModalOpen,
        isLyricsModalOpen,
        isBrandModalOpen,
        isNewPlaylistModalOpen,
        openNewPlaylistModal,
        toastMessage,

        playTrack,
        togglePlayPause,
        togglePlay: togglePlayPause,
        playNext,
        playPrev,
        seekTo,
        seek: seekTo,
        setVolume,
        toggleShuffle,
        toggleRepeat,
        toggleLike,
        isLiked,
        toggleFollowArtist,
        isArtistFollowed,
        createPlaylist,
        addTrackToPlaylist,
        deletePlaylist,
        updatePlaylist,
        removeTrackFromPlaylist,
        refreshRecommendations,

        openNowPlayingModal,
        closeNowPlayingModal,
        setNowPlayingModalOpen,
        activeRightSidebar,
        isNowPlayingSidebarOpen,
        isQueueSidebarOpen,
        isLyricsSidebarOpen,
        isLyricsFullscreen,
        toggleNowPlayingSidebar,
        toggleQueueSidebar,
        toggleLyricsSidebar,
        setIsLyricsSidebarOpen,
        setIsLyricsFullscreen,
        openFullscreenLyrics,
        closeFullscreenLyrics,
        toggleRecDrawer,
        toggleLyricsModal,
        setIsLyricsModalOpen,
        setIsBrandModalOpen,
        setIsNewPlaylistModalOpen,

        isEditPlaylistModalOpen,
        setIsEditPlaylistModalOpen,
        editingPlaylist,
        openEditPlaylistModal,
        closeEditPlaylistModal,

        isDeletePlaylistModalOpen,
        setIsDeletePlaylistModalOpen,
        deletingPlaylist,
        openDeletePlaylistModal,
        closeDeletePlaylistModal,

        showToast,

        setPlayer,
        onPlayerReady,
        onPlayerStateChange,
        onProgressUpdate,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) throw new Error('useAudio must be used within an AudioProvider');
  return context;
}
