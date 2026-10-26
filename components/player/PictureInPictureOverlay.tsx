'use client';

import React from 'react';
import { Track } from '@/types';

interface PictureInPictureOverlayProps {
  track: Track | null;
  isPlaying: boolean;
}

export function PictureInPictureOverlay({ track, isPlaying }: PictureInPictureOverlayProps) {
  const handleAudioOnlyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== 'undefined') {
      const bridge = (window as any).AndroidAudioBridge;
      if (bridge && typeof bridge.minimizeToBackgroundAudio === 'function') {
        bridge.minimizeToBackgroundAudio();
        return;
      }
      const pip = (window as any).AndroidPiP;
      if (pip && typeof pip.moveToBack === 'function') {
        pip.moveToBack();
        return;
      }
    }
  };

  const coverUrl = track?.thumbnail || track?.thumb || '/logo.png';

  return (
    <div className="pip-overlay-container" aria-label="Picture in Picture Mode">
      <div className="pip-cover-box">
        {/* Gambar cover lagu saja di PiP */}
        <img
          src={coverUrl}
          alt={track?.title || 'Haytify Music'}
          className="pip-cover-img"
        />

        {/* Headphone action button: Klik untuk berjalan di latar belakang (audio saja) */}
        <button
          type="button"
          onClick={handleAudioOnlyClick}
          className="pip-headphone-btn"
          title="Lanjutkan di latar belakang (Audio saja)"
          aria-label="Latar belakang audio saja"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
            <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default PictureInPictureOverlay;
