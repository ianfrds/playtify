'use client';

import React from 'react';
import { useAudio } from '@/context/AudioContext';
import SpotifyLyrics from '@/components/lyrics/SpotifyLyrics';

export function LyricsSidebar() {
  const {
    isLyricsSidebarOpen,
    toggleLyricsSidebar,
    openFullscreenLyrics,
    currentTrack,
    currentTime,
    duration,
    isPlaying,
    seekTo,
  } = useAudio();

  return (
    <aside
      className={`lyrics-sidebar ${isLyricsSidebarOpen ? 'open' : ''}`}
      aria-label="Lirik Lagu Langsung"
    >
      <div className="lyrics-sidebar-header">
        <div className="lyrics-sidebar-title-wrap">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zm5.3 7.7a1 1 0 0 0-2 .2c0 2.9-2.4 5.3-5.3 5.3s-5.3-2.4-5.3-5.3a1 1 0 1 0-2-.2C3 13.5 5.9 17 9.8 17.2V20H7a1 1 0 0 0 0 2h10a1 1 0 0 0 0-2h-2.8v-2.8c3.9-.2 6.8-3.7 3.1-7.5z" />
          </svg>
          <h3>Lirik</h3>
          {currentTrack && (
            <span
              className="lyrics-sidebar-track-badge"
              title={`${currentTrack.title} - ${currentTrack.artist}`}
            >
              {currentTrack.title}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            className="icon-btn small"
            onClick={() => openFullscreenLyrics()}
            title="Perbesar Layar Penuh (Expand to Full)"
            aria-label="Perbesar Layar Penuh"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <polyline points="15 3 21 3 21 9" />
              <polyline points="9 21 3 21 3 15" />
              <line x1="21" y1="3" x2="14" y2="10" />
              <line x1="3" y1="21" x2="10" y2="14" />
            </svg>
          </button>
          <button
            className="icon-btn small"
            onClick={() => toggleLyricsSidebar(false)}
            title="Tutup lirik"
            aria-label="Tutup lirik"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      <div className="lyrics-sidebar-body">
        {currentTrack ? (
          <SpotifyLyrics
            track={currentTrack}
            currentTime={currentTime}
            duration={duration}
            isPlaying={isPlaying}
            onSeek={seekTo}
            mode="embedded"
            onExpand={() => openFullscreenLyrics()}
          />
        ) : (
          <div className="lyrics-sidebar-empty">
            <div className="lyrics-empty-icon">🎤</div>
            <p className="lyrics-empty-title">Belum Ada Lagu Diputar</p>
            <p className="lyrics-empty-sub">
              Putar lagu untuk melihat lirik sinkron secara langsung di sini.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}

export default LyricsSidebar;
