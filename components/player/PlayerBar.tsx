'use client';

import React, { useRef } from 'react';
import { useAudio } from '@/context/AudioContext';
import { useRouter } from 'next/navigation';

export function PlayerBar() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isShuffle,
    repeatMode,
    togglePlayPause,
    playNext,
    playPrev,
    seekTo,
    setVolume,
    toggleShuffle,
    toggleRepeat,
    toggleLike,
    isLiked,
    toggleRecDrawer,
    toggleQueueSidebar,
    toggleLyricsModal,
    isLyricsModalOpen,
  } = useAudio();

  const router = useRouter();
  const progressBarRef = useRef<HTMLDivElement>(null);
  const volumeBarRef = useRef<HTMLDivElement>(null);

  const formatTime = (secs: number) => {
    if (!secs || isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration || !progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    seekTo(pct * duration);
  };

  const handleVolume = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!volumeBarRef.current) return;
    const rect = volumeBarRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setVolume(pct);
  };

  const handleArtistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentTrack) {
      const artistId = currentTrack.artistId || encodeURIComponent(currentTrack.artist.toLowerCase().trim().replace(/[^a-z0-9]/g, '-'));
      router.push(`/artist/${artistId}`);
    }
  };

  const liked = currentTrack ? isLiked(currentTrack.id) : false;
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const thumbUrl = currentTrack ? (currentTrack.thumbnail || currentTrack.thumb || '') : '';

  return (
    <footer id="player-bar" className="player-bar" aria-label="Pemutar Musik">
      {/* 1. Track Info (Left Grid Column) */}
      <div className="player-track-info">
        <div
          id="player-thumb-wrap"
          className="player-thumb"
          onClick={() => router.push('/now-playing')}
          style={{ cursor: 'pointer' }}
          title="Buka Sedang Diputar"
        >
          {thumbUrl ? (
            <img id="player-thumb" src={thumbUrl} alt={currentTrack?.title || ''} loading="lazy" />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3v9.28c-.47-.17-.97-.28-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z" />
              </svg>
            </div>
          )}
        </div>
        <div className="player-track-text" onClick={() => router.push('/now-playing')} style={{ cursor: 'pointer' }}>
          <p id="player-title" className="player-title">
            {currentTrack?.title || 'Belum ada lagu'}
          </p>
          <p id="player-artist" className="player-artist clickable-artist" onClick={handleArtistClick}>
            {currentTrack?.artist || 'Playtify Music'}
          </p>
        </div>
        {currentTrack && (
          <button
            id="btn-player-like"
            className={`icon-btn player-like-btn ${liked ? 'liked' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleLike(currentTrack);
            }}
            title={liked ? 'Hapus dari Disukai' : 'Suka lagu ini'}
            aria-label="Suka lagu ini"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill={liked ? 'var(--accent)' : 'none'}
              stroke={liked ? 'var(--accent)' : 'currentColor'}
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        )}
      </div>

      {/* 2. Controls & Progress (Center Grid Column) */}
      <div className="player-controls">
        <div className="player-buttons">
          <button
            id="btn-shuffle"
            className={`icon-btn control-btn ${isShuffle ? 'active' : ''}`}
            onClick={toggleShuffle}
            title={isShuffle ? 'Acak: Aktif' : 'Acak: Nonaktif'}
            aria-label="Acak"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="16,3 21,3 21,8" />
              <line x1="4" y1="20" x2="21" y2="3" />
              <polyline points="21,16 21,21 16,21" />
              <line x1="15" y1="15" x2="21" y2="21" />
              <line x1="4" y1="4" x2="9" y2="9" />
            </svg>
          </button>

          <button
            id="btn-prev"
            className="icon-btn control-btn"
            onClick={playPrev}
            title="Sebelumnya"
            aria-label="Lagu sebelumnya"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </button>

          <button
            id="btn-play-pause"
            className="play-pause-btn"
            onClick={togglePlayPause}
            title={isPlaying ? 'Jeda' : 'Putar'}
            aria-label={isPlaying ? 'Jeda' : 'Putar'}
          >
            {isPlaying ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <button
            id="btn-next"
            className="icon-btn control-btn"
            onClick={playNext}
            title="Selanjutnya"
            aria-label="Lagu selanjutnya"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 6h2v12h-2zm-10 0l8.5 6L6 18z" />
            </svg>
          </button>

          <button
            id="btn-repeat"
            className={`icon-btn control-btn ${repeatMode !== 'off' && repeatMode !== 0 ? 'active' : ''}`}
            onClick={toggleRepeat}
            title={repeatMode === 2 || repeatMode === 'one' ? 'Ulangi Satu' : repeatMode === 1 || repeatMode === 'all' ? 'Ulangi Semua' : 'Ulangi: Nonaktif'}
            aria-label="Ulangi"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="17 1 21 5 17 9" />
              <path d="M3 11V9a4 4 0 0 1 4-4h14" />
              <polyline points="7 23 3 19 7 15" />
              <path d="M21 13v2a4 4 0 0 1-4 4H3" />
            </svg>
          </button>
        </div>

        <div className="player-progress">
          <span id="player-current-time" className="time-label">
            {formatTime(currentTime)}
          </span>
          <div
            id="progress-bar"
            className="progress-bar"
            ref={progressBarRef}
            onClick={handleSeek}
            role="slider"
            aria-label="Posisi lagu"
            tabIndex={0}
          >
            <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
            <div className="progress-handle" style={{ left: `${progressPercent}%` }} />
          </div>
          <span id="player-duration" className="time-label">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* 3. Extra Tools & Volume (Right Grid Column) */}
      <div className="player-extra">
        <button
          id="btn-player-now-playing"
          className="icon-btn"
          onClick={() => router.push('/now-playing')}
          title="Tampilan Now Playing"
          aria-label="Tampilan Now Playing"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
          </svg>
        </button>

        <button
          id="btn-player-lyrics"
          className={`icon-btn ${isLyricsModalOpen ? 'active' : ''}`}
          onClick={() => toggleLyricsModal()}
          title="Lirik Lagu (Sinkron)"
          aria-label="Lirik Lagu"
          style={{ color: isLyricsModalOpen ? 'var(--accent)' : 'inherit' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zm5.3 7.7a1 1 0 0 0-2 .2c0 2.9-2.4 5.3-5.3 5.3s-5.3-2.4-5.3-5.3a1 1 0 1 0-2-.2C3 13.5 5.9 17 9.8 17.2V20H7a1 1 0 0 0 0 2h10a1 1 0 0 0 0-2h-2.8v-2.8c3.9-.2 6.8-3.7 3.1-7.5z" />
          </svg>
        </button>

        <button
          id="btn-player-rec"
          className="icon-btn"
          onClick={() => toggleRecDrawer()}
          title="Rekomendasi Cepat"
          aria-label="Rekomendasi Cepat"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
          </svg>
        </button>

        <button
          id="btn-player-queue"
          className="icon-btn"
          onClick={() => toggleQueueSidebar()}
          title="Queue / Antrian lagu"
          aria-label="Queue / Antrian lagu"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <circle cx="3.5" cy="6" r="1.5" />
            <circle cx="3.5" cy="12" r="1.5" />
            <circle cx="3.5" cy="18" r="1.5" />
          </svg>
        </button>

        <div className="volume-control">
          <button
            id="btn-volume"
            className="icon-btn"
            onClick={() => setVolume(volume > 0 ? 0 : 0.8)}
            title="Volume"
            aria-label="Volume"
          >
            {volume === 0 ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            ) : volume < 0.5 ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            )}
          </button>
          <div
            id="volume-bar"
            className="volume-bar"
            ref={volumeBarRef}
            onClick={handleVolume}
            role="slider"
            aria-label="Volume"
            tabIndex={0}
          >
            <div className="volume-fill" style={{ width: `${volume * 100}%` }} />
            <div className="volume-handle" style={{ left: `${volume * 100}%` }} />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default PlayerBar;
