'use client';

import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAudio } from '@/context/AudioContext';

import SpotifyLyrics from '@/components/lyrics/SpotifyLyrics';

export default function ModalNowPlaying() {
  const router = useRouter();
  const progressBarRef = useRef<HTMLDivElement>(null);
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    playNext,
    playPrev,
    currentTime,
    duration,
    seekTo,
    isShuffle,
    toggleShuffle,
    repeatMode,
    toggleRepeat,
    isLiked,
    toggleLike,
    isNowPlayingModalOpen,
    setNowPlayingModalOpen,
    toggleLyricsModal,
  } = useAudio();

  if (!currentTrack) return null;

  const formatTime = (secs: number) => {
    if (!secs || isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;
  const liked = isLiked(currentTrack.id);
  const thumbUrl = currentTrack.thumbnail || currentTrack.thumb || '';

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration || !progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    seekTo(pct * duration);
  };

  const handleArtistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNowPlayingModalOpen(false);
    const artistId = currentTrack.artistId || encodeURIComponent(currentTrack.artist.toLowerCase().trim().replace(/[^a-z0-9]/g, '-'));
    router.push(`/artist/${artistId}`);
  };

  return (
    <div
      id="now-playing-modal"
      className={`now-playing-modal ${isNowPlayingModalOpen ? 'active' : ''}`}
      role="dialog"
      aria-label="Layar Sekarang Diputar"
    >
      {/* 1. Top Bar */}
      <div className="now-playing-topbar">
        <button
          className="icon-circle-btn"
          onClick={() => setNowPlayingModalOpen(false)}
          title="Tutup pemutar"
          aria-label="Tutup pemutar"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        <span className="now-playing-topbar-title">MEMUTAR MUSIK</span>

        <div className="now-playing-topbar-actions">
          <button
            className="icon-circle-btn"
            onClick={handleArtistClick}
            title="Lihat Profil Artis"
            aria-label="Profil Artis"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </button>
        </div>
      </div>

      {/* 2. Disc Artwork */}
      <div className="now-playing-disc-section">
        <div className="now-playing-disc-glow" />
        <div className={`now-playing-disc-wrap ${isPlaying ? 'spinning' : ''}`}>
          <img src={thumbUrl} alt={currentTrack.title} />
        </div>
      </div>

      {/* 3. Title & Artist Meta */}
      <div className="now-playing-meta">
        <h2 className="now-playing-title">{currentTrack.title}</h2>
        <p
          className="now-playing-artist clickable-artist"
          onClick={handleArtistClick}
          style={{ cursor: 'pointer' }}
        >
          {currentTrack.artist}
        </p>
      </div>

      {/* 4. Spotify Synced Lyrics Preview Card */}
      <SpotifyLyrics
        track={currentTrack}
        currentTime={currentTime}
        duration={duration}
        onSeek={seekTo}
        mode="preview"
        onExpand={() => toggleLyricsModal(true)}
      />

      {/* 5. Progress Scrubber */}
      <div className="now-playing-progress-wrap">
        <div
          className="modal-progress-bar"
          ref={progressBarRef}
          onClick={handleSeek}
          role="slider"
          aria-label="Posisi pemutaran"
          tabIndex={0}
        >
          <div className="modal-progress-fill" style={{ width: `${progressPct}%` }} />
          <div className="modal-progress-handle" style={{ left: `${progressPct}%` }} />
        </div>
        <div className="modal-time-labels">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* 6. Controls Bar */}
      <div className="now-playing-controls">
        <button
          className={`modal-ctrl-btn ${isShuffle ? 'active' : ''}`}
          onClick={toggleShuffle}
          title="Acak"
          aria-label="Acak"
          style={{ color: isShuffle ? 'var(--accent)' : 'inherit' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="16,3 21,3 21,8" />
            <line x1="4" y1="20" x2="21" y2="3" />
            <polyline points="21,16 21,21 16,21" />
            <line x1="15" y1="15" x2="21" y2="21" />
            <line x1="4" y1="4" x2="9" y2="9" />
          </svg>
        </button>

        <button
          className="modal-ctrl-btn"
          onClick={playPrev}
          title="Sebelumnya"
          aria-label="Sebelumnya"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
          </svg>
        </button>

        <button
          className="modal-play-btn"
          onClick={togglePlay}
          title={isPlaying ? 'Jeda' : 'Putar'}
          aria-label={isPlaying ? 'Jeda' : 'Putar'}
        >
          {isPlaying ? (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
            </svg>
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: 3 }}>
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <button
          className="modal-ctrl-btn"
          onClick={playNext}
          title="Berikutnya"
          aria-label="Berikutnya"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 6h2v12h-2zm-10 0l8.5 6L6 18z" />
          </svg>
        </button>

        <button
          className="modal-ctrl-btn"
          onClick={() => toggleLike(currentTrack)}
          title={liked ? 'Hapus dari Disukai' : 'Suka'}
          aria-label="Suka"
          style={{ color: liked ? 'var(--accent)' : 'inherit' }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill={liked ? 'var(--accent)' : 'none'}
            stroke={liked ? 'var(--accent)' : 'currentColor'}
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

