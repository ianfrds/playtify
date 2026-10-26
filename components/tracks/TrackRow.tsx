'use client';

import React from 'react';
import { Track } from '@/types';
import { useAudio } from '@/context/AudioContext';
import { useRouter } from 'next/navigation';
import { sanitizeTrack, DEFAULT_FALLBACK_COVER } from '@/lib/trackSanitizer';

interface TrackRowProps {
  track: Track;
  index: number;
  playCount?: string;
  onPlay?: () => void;
  queueContext?: Track[];
  onRemove?: () => void;
}

export function TrackRow({ track: rawTrack, index, playCount, onPlay, queueContext, onRemove }: TrackRowProps) {
  const track = sanitizeTrack(rawTrack);
  const { currentTrack, isPlaying, playTrack, toggleLike, isLiked } = useAudio();
  const router = useRouter();

  const isCurrent = currentTrack?.id === track.id;
  const isThisPlaying = isCurrent && isPlaying;
  const thumbUrl = track.thumb || track.thumbnail || DEFAULT_FALLBACK_COVER;

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPlay) {
      onPlay();
    } else {
      playTrack(track, queueContext);
    }
  };

  const handleArtistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const artistId = track.artistId || encodeURIComponent(track.artist.toLowerCase().trim().replace(/[^a-z0-9]/g, '-'));
    router.push(`/artist/${artistId}`);
  };

  const formatTime = (secs: number) => {
    if (!secs || isNaN(secs) || secs <= 0) return '3:20';
    const safeSecs = Math.max(0, Math.floor(secs));
    const m = Math.floor(safeSecs / 60);
    const s = Math.floor(safeSecs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const liked = isLiked(track.id);

  return (
    <div
      className={`track-row track-table-row ${isCurrent ? 'playing' : ''}`}
      onClick={handlePlay}
      role="button"
      tabIndex={0}
      aria-label={`Putar lagu ${track.title} oleh ${track.artist}`}
    >
      <div className="row-index-wrap">
        {isThisPlaying ? (
          <div className="track-equalizer-anim" aria-label="Sedang berputar">
            <span className="track-equalizer-bar" />
            <span className="track-equalizer-bar" />
            <span className="track-equalizer-bar" />
          </div>
        ) : (
          <span className={`track-row-index ${isCurrent ? 'active' : ''}`}>{index + 1}</span>
        )}
        <button
          className="icon-btn row-play-btn"
          title={isThisPlaying ? 'Jeda' : 'Putar'}
          onClick={handlePlay}
          aria-label={isThisPlaying ? 'Jeda' : 'Putar'}
        >
          {isThisPlaying ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      </div>

      <div className="track-main-info">
        <div className="track-thumb">
          <img
            src={thumbUrl}
            alt={track.title}
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/logo.png';
            }}
          />
        </div>
        <div className="track-info">
          <p className="track-title" style={{ color: isCurrent ? 'var(--accent)' : '#fff' }}>
            {track.title}
          </p>
          <p className="track-artist clickable-artist" onClick={handleArtistClick}>
            {track.artist}
          </p>
        </div>
      </div>

      {playCount ? (
        <div className="track-play-count">{playCount}</div>
      ) : (
        <div className="track-album-col">{track.album || 'Single'}</div>
      )}

      <div className="track-actions">
        <button
          className={`icon-btn btn-like-track ${liked ? 'liked' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleLike(track);
          }}
          title={liked ? 'Hapus dari Disukai' : 'Suka'}
          aria-label={liked ? 'Hapus dari Disukai' : 'Suka'}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={liked ? 'var(--accent)' : 'none'}
            stroke={liked ? 'var(--accent)' : 'currentColor'}
            strokeWidth="2"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>
        {onRemove && (
          <button
            className="icon-btn btn-remove-track"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            title="Hapus dari playlist"
            aria-label="Hapus dari playlist"
            style={{ opacity: 0.6, transition: 'opacity 0.2s, color 0.2s', padding: 4 }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.color = '#ff4d4d';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0.6';
              e.currentTarget.style.color = '';
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        )}
        <span className="track-duration">{formatTime(track.duration)}</span>
      </div>
    </div>
  );
}

export default TrackRow;
