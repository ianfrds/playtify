'use client';

import React from 'react';
import { CuratedPlaylist } from '@/types';
import { useAudio } from '@/context/AudioContext';
import { useRouter } from 'next/navigation';

interface PlaylistCardProps {
  playlist: CuratedPlaylist;
}

export function PlaylistCard({ playlist }: PlaylistCardProps) {
  const { playTrack } = useAudio();
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/playlist/${playlist.id}`);
  };

  const handlePlayDirect = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (playlist.tracks && playlist.tracks.length > 0) {
      playTrack(playlist.tracks[0], playlist.tracks);
    }
  };

  const thumbUrl = playlist.cover || playlist.thumb || 'https://i.ytimg.com/vi/E7kHvjvU6JY/hqdefault.jpg';
  const displayName = playlist.title || playlist.name;
  const displayDesc = playlist.description || playlist.desc;

  return (
    <div
      className="playlist-card"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      aria-label={`Buka playlist ${displayName}`}
    >
      <div className="playlist-card-thumb">
        <img
          src={thumbUrl}
          alt={displayName}
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/logo.png';
          }}
        />
        <span className="playlist-card-badge">{playlist.badge}</span>
        <button
          className="playlist-card-play"
          title={`Putar ${displayName}`}
          onClick={handlePlayDirect}
          aria-label={`Putar semua lagu di ${displayName}`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      </div>
      <p className="playlist-card-title">{displayName}</p>
      <p className="playlist-card-desc">{displayDesc}</p>
    </div>
  );
}

export default PlaylistCard;
