'use client';

import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAudio } from '@/context/AudioContext';
import SpotifyLyrics from '@/components/lyrics/SpotifyLyrics';

const DEFAULT_COVER = '/logo.png';

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
  const thumbUrl = currentTrack.thumbnail || currentTrack.thumb || DEFAULT_COVER;

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
      {/* ─── Ambient Backdrop Glow ─── */}
      <div
        className="now-playing-modal-ambient"
        style={{ backgroundImage: `url(${thumbUrl})` }}
        aria-hidden="true"
      />

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

        <div className="now-playing-modal-header-text">
          <span className="now-playing-modal-subtitle">MEMUTAR DARI PLAYLIST</span>
          <span className="now-playing-modal-title-text">{currentTrack.album || currentTrack.badge || 'Haytify Music'}</span>
        </div>

        <div className="now-playing-topbar-actions">
          <button
            className="icon-circle-btn"
            onClick={() => {
              setNowPlayingModalOpen(false);
              router.push('/queue');
            }}
            title="Antrean Lagu"
            aria-label="Antrean Lagu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <circle cx="3.5" cy="6" r="1.5" />
              <circle cx="3.5" cy="12" r="1.5" />
              <circle cx="3.5" cy="18" r="1.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* 2. Modern Square Album Artwork (No spinning vinyl) */}
      <div className="now-playing-artwork-stage">
        <div
          className="now-playing-artwork-glow"
          style={{ backgroundImage: `url(${thumbUrl})` }}
          aria-hidden="true"
        />
        <div className="now-playing-artwork-box">
          <img
            src={thumbUrl}
            alt={currentTrack.title}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = DEFAULT_COVER;
            }}
          />
        </div>
      </div>

      {/* 3. Title & Artist Meta Row with Heart/Like */}
      <div className="now-playing-meta-row">
        <div className="now-playing-meta-info">
          <h2 className="now-playing-title">{currentTrack.title}</h2>
          <p
            className="now-playing-artist clickable-artist"
            onClick={handleArtistClick}
            style={{ cursor: 'pointer' }}
          >
            {currentTrack.artist}
          </p>
        </div>

        <button
          className={`now-playing-heart-btn ${liked ? 'liked' : ''}`}
          onClick={() => toggleLike(currentTrack)}
          title={liked ? 'Hapus dari Disukai' : 'Suka'}
          aria-label="Suka"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill={liked ? 'var(--accent)' : 'none'}
            stroke={liked ? 'var(--accent)' : 'currentColor'}
            strokeWidth="2.2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      {/* 4. Progress Scrubber */}
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

      {/* 5. Controls Bar */}
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
          className={`modal-ctrl-btn ${repeatMode !== 'off' ? 'active' : ''}`}
          onClick={toggleRepeat}
          title={`Ulangi (${repeatMode})`}
          aria-label={`Ulangi (${repeatMode})`}
          style={{ color: repeatMode !== 'off' ? 'var(--accent)' : 'inherit', position: 'relative' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="17 1 21 5 17 9" />
            <path d="M3 11V9a4 4 0 0 1 4-4h14" />
            <polyline points="7 23 3 19 7 15" />
            <path d="M21 13v2a4 4 0 0 1-4 4H3" />
          </svg>
          {repeatMode === 'one' && (
            <span style={{ position: 'absolute', top: -2, right: -2, fontSize: '0.62rem', fontWeight: 800 }}>1</span>
          )}
        </button>
      </div>

      {/* 6. Spotify Synced Lyrics Preview Card */}
      <div style={{ marginTop: 16 }}>
        <SpotifyLyrics
          track={currentTrack}
          currentTime={currentTime}
          duration={duration}
          onSeek={seekTo}
          mode="preview"
          onExpand={() => toggleLyricsModal(true)}
        />
      </div>
    </div>
  );
}
