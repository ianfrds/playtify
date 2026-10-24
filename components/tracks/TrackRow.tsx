'use client';

import React from 'react';
import { Track } from '@/types';
import { useAudio } from '@/context/AudioContext';
import { useRouter } from 'next/navigation';

interface TrackRowProps {
  track: Track;
  index: number;
  playCount?: string;
  onPlay?: () => void;
  queueContext?: Track[];
}

export function TrackRow({ track, index, playCount, onPlay, queueContext }: TrackRowProps) {
  const { currentTrack, isPlaying, playTrack, toggleLike, isLiked } = useAudio();
  const router = useRouter();

  const isCurrent = currentTrack?.id === track.id;
  const isThisPlaying = isCurrent && isPlaying;
  const thumbUrl =
    track.thumb ||
    track.thumbnail ||
    (track.id && !track.id.startsWith('http')
      ? `https://i.ytimg.com/vi/${track.id}/hqdefault.jpg`
      : 'https://i.ytimg.com/vi/WKZO-CWeOVA/hqdefault.jpg');

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
    if (!secs || isNaN(secs)) return '3:20';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
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
              const target = e.currentTarget;
              if (track.id && !target.src.includes(track.id)) {
                target.src = `https://i.ytimg.com/vi/${track.id}/hqdefault.jpg`;
              } else {
                target.src = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=120&h=120&fit=crop';
              }
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
        <span className="track-duration">{formatTime(track.duration)}</span>
      </div>
    </div>
  );
}

export default TrackRow;
