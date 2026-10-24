'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAudio } from '@/context/AudioContext';

export default function MobileMiniPlayer() {
  const router = useRouter();
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    playNext,
    isLiked,
    toggleLike,
    setNowPlayingModalOpen,
  } = useAudio();

  if (!currentTrack) return null;

  const liked = isLiked(currentTrack.id);
  const thumbUrl = currentTrack.thumbnail || currentTrack.thumb || '';

  return (
    <div
      id="mobile-mini-player"
      className="mobile-mini-player visible"
      onClick={() => setNowPlayingModalOpen(true)}
      role="button"
      tabIndex={0}
      aria-label="Buka Pemutar Musik Layar Penuh"
    >
      <div className={`mini-player-artwork-wrap ${isPlaying ? 'spinning' : ''}`}>
        <img
          src={thumbUrl}
          alt={currentTrack.title}
          loading="lazy"
        />
      </div>

      <div className="mini-player-info">
        <p className="mini-player-title">{currentTrack.title}</p>
        <p
          className="mini-player-artist clickable-artist"
          onClick={(e) => {
            e.stopPropagation();
            const artistId = currentTrack.artistId || encodeURIComponent(currentTrack.artist.toLowerCase().trim().replace(/[^a-z0-9]/g, '-'));
            router.push(`/artist/${artistId}`);
          }}
        >
          {currentTrack.artist}
        </p>
      </div>

      <div className="mini-player-controls" onClick={(e) => e.stopPropagation()}>
        <button
          className={`mini-player-btn ${liked ? 'liked' : ''}`}
          onClick={() => toggleLike(currentTrack)}
          title={liked ? 'Hapus dari Disukai' : 'Suka'}
          aria-label="Suka lagu"
          style={{ color: liked ? 'var(--accent)' : 'inherit' }}
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

        <button
          className="mini-player-play-btn"
          onClick={togglePlay}
          title={isPlaying ? 'Jeda' : 'Putar'}
          aria-label={isPlaying ? 'Jeda' : 'Putar'}
        >
          {isPlaying ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <button
          className="mini-player-btn"
          onClick={playNext}
          title="Lagu Berikutnya"
          aria-label="Lagu Berikutnya"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 6h2v12h-2zm-10 0l8.5 6L6 18z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
