'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Track, UserPlaylist } from '@/types';
import { ALL_RECOMMENDATIONS_POOL, RECOMMENDATIONS_DATA } from '@/data/recommendations';

interface AudioContextType {
  brandName: string;
  setBrandName: (name: string) => void;
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  queue: Track[];
  queueIndex: number;
  isShuffle: boolean;
  repeatMode: string | number;
  likedTracks: Track[];
  playlists: UserPlaylist[];
  followedArtists: string[];
  recommendations: Track[];

  isQueueSidebarOpen: boolean;
  isRecDrawerOpen: boolean;
  isNowPlayingModalOpen: boolean;
  isLyricsModalOpen: boolean;
  isBrandModalOpen: boolean;
  isNewPlaylistModalOpen: boolean;
  toastMessage: string | null;

  toggleLyricsModal: (force?: boolean) => void;
  setIsLyricsModalOpen: (open: boolean) => void;

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
  refreshRecommendations: () => Promise<void>;

  openNowPlayingModal: () => void;
  closeNowPlayingModal: () => void;
  setNowPlayingModalOpen: (open: boolean) => void;
  toggleQueueSidebar: (force?: boolean) => void;
  toggleRecDrawer: (force?: boolean) => void;
  setIsBrandModalOpen: (open: boolean) => void;
  setIsNewPlaylistModalOpen: (open: boolean) => void;
  showToast: (msg: string) => void;

  // Internal player synchronization
  setPlayer: (player: any) => void;
  onPlayerReady: (player: any) => void;
  onPlayerStateChange: (state: number) => void;
  onProgressUpdate: (curr: number, dur: number) => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [brandName, setBrandNameState] = useState<string>('Playtify');
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
  const [followedArtists, setFollowedArtists] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<Track[]>(ALL_RECOMMENDATIONS_POOL);

  // UI states
  const [isQueueSidebarOpen, setIsQueueSidebarOpen] = useState<boolean>(false);
  const [isRecDrawerOpen, setIsRecDrawerOpen] = useState<boolean>(false);
  const [isNowPlayingModalOpen, setIsNowPlayingModalOpen] = useState<boolean>(false);
  const [isLyricsModalOpen, setIsLyricsModalOpen] = useState<boolean>(false);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState<boolean>(false);
  const [isNewPlaylistModalOpen, setIsNewPlaylistModalOpen] = useState<boolean>(false);
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

  // Live Auto-Updating Recommendations logic
  const refreshRecommendations = async () => {
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
          setRecommendations(mapped);
          showToast('Playlist rekomendasi berhasil diperbarui');
          return;
        }
      }
    } catch (e) {
      console.warn('Live recommendation fetch failed, using fallback pool:', e);
    }
    setRecommendations(ALL_RECOMMENDATIONS_POOL);
    showToast('Playlist rekomendasi diperbarui');
  };

  // Load initial persistent state from localStorage
  useEffect(() => {
    try {
      const savedBrand = localStorage.getItem('playtify_brand');
      if (savedBrand) setBrandNameState(savedBrand);

      const savedVol = localStorage.getItem('playtify_volume');
      if (savedVol) setVolumeState(parseFloat(savedVol));

      const savedLiked = localStorage.getItem('playtify_liked');
      if (savedLiked) setLikedTracks(JSON.parse(savedLiked));

      const savedPlaylists = localStorage.getItem('playtify_playlists');
      if (savedPlaylists) setPlaylists(JSON.parse(savedPlaylists));

      const savedFollowed = localStorage.getItem('playtify_followed_artists');
      if (savedFollowed) setFollowedArtists(JSON.parse(savedFollowed));

      const initialPool = RECOMMENDATIONS_DATA.top_indo || [];
      if (initialPool.length > 0) {
        setQueue(initialPool.slice(1));
      }
    } catch (e) {
      // Ignore
    }

    // Auto-update recommendations every 30 minutes in background
    const timer = setInterval(() => {
      refreshRecommendations();
    }, 30 * 60 * 1000);

    return () => clearInterval(timer);
  }, []);

  const setBrandName = (name: string) => {
    setBrandNameState(name);
    localStorage.setItem('playtify_brand', name);
    document.title = `${name} - Web Music Streaming`;
    showToast(`Brand diubah menjadi "${name}"`);
  };

  const playTrack = (track: Track, newQueue?: Track[]) => {
    if (currentTrack) {
      setHistory((prev) => [currentTrack, ...prev.slice(0, 30)]);
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
    setLikedTracks((prev) => {
      const exists = prev.some((t) => t.id === track.id);
      let updated: Track[];
      if (exists) {
        updated = prev.filter((t) => t.id !== track.id);
        showToast('Dihapus dari Lagu Disukai');
      } else {
        updated = [track, ...prev];
        showToast('Ditambahkan ke Lagu Disukai');
      }
      localStorage.setItem('playtify_liked', JSON.stringify(updated));
      return updated;
    });
  };

  const isLiked = (id: string) => {
    return likedTracks.some((t) => t.id === id);
  };

  const toggleFollowArtist = (name: string) => {
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
      localStorage.setItem('playtify_followed_artists', JSON.stringify(updated));
      return updated;
    });
  };

  const isArtistFollowed = (name: string) => {
    return followedArtists.some((a) => a.toLowerCase() === name.toLowerCase());
  };

  const createPlaylist = (name: string) => {
    if (!name.trim()) return;
    const newPl: UserPlaylist = {
      id: 'pl-' + Date.now(),
      name: name.trim(),
      createdAt: Date.now(),
      tracks: [],
    };
    setPlaylists((prev) => {
      const updated = [newPl, ...prev];
      localStorage.setItem('playtify_playlists', JSON.stringify(updated));
      return updated;
    });
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
          return { ...pl, tracks: [...pl.tracks, track] };
        }
        return pl;
      });
      localStorage.setItem('playtify_playlists', JSON.stringify(updated));
      return updated;
    });
  };

  const deletePlaylist = (playlistId: string) => {
    setPlaylists((prev) => {
      const updated = prev.filter((pl) => pl.id !== playlistId);
      localStorage.setItem('playtify_playlists', JSON.stringify(updated));
      return updated;
    });
    showToast('Playlist dihapus');
  };

  const openNowPlayingModal = () => setIsNowPlayingModalOpen(true);
  const closeNowPlayingModal = () => setIsNowPlayingModalOpen(false);
  const setNowPlayingModalOpen = (open: boolean) => setIsNowPlayingModalOpen(open);
  const toggleQueueSidebar = (force?: boolean) => setIsQueueSidebarOpen((p) => (force !== undefined ? force : !p));
  const toggleRecDrawer = (force?: boolean) => setIsRecDrawerOpen((p) => (force !== undefined ? force : !p));
  const toggleLyricsModal = (force?: boolean) => setIsLyricsModalOpen((p) => (force !== undefined ? force : !p));

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

  return (
    <AudioContext.Provider
      value={{
        brandName,
        setBrandName,
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        queue,
        queueIndex: queueIndex >= 0 ? queueIndex : 0,
        isShuffle,
        repeatMode: repeatModeLabel,
        likedTracks,
        playlists,
        followedArtists,
        recommendations,
        isQueueSidebarOpen,
        isRecDrawerOpen,
        isNowPlayingModalOpen,
        isLyricsModalOpen,
        isBrandModalOpen,
        isNewPlaylistModalOpen,
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
        refreshRecommendations,

        openNowPlayingModal,
        closeNowPlayingModal,
        setNowPlayingModalOpen,
        toggleQueueSidebar,
        toggleRecDrawer,
        toggleLyricsModal,
        setIsLyricsModalOpen,
        setIsBrandModalOpen,
        setIsNewPlaylistModalOpen,
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
