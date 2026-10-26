'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAudio } from '@/context/AudioContext';

const DEFAULT_COVER = '/logo.png';

export default function MobileMiniPlayer() {
  const router = useRouter();
  const pathname = usePathname();
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    playNext,
    isLiked,
    toggleLike,
  } = useAudio();

  // Hide mini player if not playing or if already on dedicated Now Playing page
  if (!currentTrack || pathname === '/now-playing') return null;

  const liked = isLiked(currentTrack.id);
  const thumbUrl = currentTrack.thumbnail || currentTrack.thumb || DEFAULT_COVER;
  const progressPct = duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0;

  return (
    <div
      id="mobile-mini-player"
      className="mobile-mini-player visible"
      onClick={() => router.push('/now-playing')}
      role="button"
      tabIndex={0}
      aria-label="Buka Pemutar Musik Layar Penuh"
    >
      <div className={`mini-player-artwork-wrap ${isPlaying ? 'spinning' : ''}`}>
        <img
          src={thumbUrl}
          alt={currentTrack.title}
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = DEFAULT_COVER;
          }}
        />
      </div>

      <div className="mini-player-info">
        <p className="mini-player-title">{currentTrack.title}</p>
        <p className="mini-player-artist">{currentTrack.artist}</p>
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

      {/* Spotify Bottom Scrubber Line */}
      <div className="mini-player-progress-bar">
        <div
          className="mini-player-progress-fill"
          style={{ width: `${progressPct}%` }}
        />
      </div>
    </div>
  );
}
