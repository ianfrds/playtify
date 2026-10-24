'use client';

import React from 'react';
import { Track } from '@/types';
import { useAudio } from '@/context/AudioContext';
import { useRouter } from 'next/navigation';

interface TrackCardProps {
  track: Track;
  onPlay?: () => void;
  queueContext?: Track[];
}

export function TrackCard({ track, onPlay, queueContext }: TrackCardProps) {
  const { currentTrack, isPlaying, playTrack } = useAudio();
  const router = useRouter();

  const isCurrent = currentTrack?.id === track.id;
  const isThisPlaying = isCurrent && isPlaying;
  const thumbUrl = track.thumbnail || track.thumb || 'https://i.ytimg.com/vi/WKZO-CWeOVA/hqdefault.jpg';

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

  return (
    <div
      className={`track-card ${isCurrent ? 'playing' : ''}`}
      onClick={handlePlay}
      role="button"
      tabIndex={0}
      aria-label={`Putar ${track.title}`}
    >
      <div className="track-card-thumb">
        <img src={thumbUrl} alt={track.title} loading="lazy" />
        <button
          className="track-card-play"
          title={isThisPlaying ? 'Jeda' : 'Putar'}
          onClick={handlePlay}
          aria-label={isThisPlaying ? 'Jeda' : 'Putar'}
        >
          {isThisPlaying ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      </div>
      <p className="track-card-title">{track.title}</p>
      <p className="track-card-artist clickable-artist" onClick={handleArtistClick}>
        {track.artist}
      </p>
    </div>
  );
}

export default TrackCard;
