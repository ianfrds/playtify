'use client';

import React from 'react';
import { useAudio } from '@/context/AudioContext';
import SpotifyLyrics from '@/components/lyrics/SpotifyLyrics';

export default function FullscreenLyricsModal() {
  const {
    currentTrack,
    currentTime,
    duration,
    isPlaying,
    seekTo,
    togglePlay,
    playNext,
    playPrev,
    isLyricsModalOpen,
    isLyricsFullscreen,
    closeFullscreenLyrics,
    setIsLyricsModalOpen,
  } = useAudio();

  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const shouldShow = currentTrack && (isLyricsFullscreen || (isLyricsModalOpen && isMobile));
  if (!shouldShow) return null;

  return (
    <SpotifyLyrics
      track={currentTrack}
      currentTime={currentTime}
      duration={duration}
      isPlaying={isPlaying}
      onSeek={seekTo}
      onTogglePlay={togglePlay}
      onNext={playNext}
      onPrev={playPrev}
      mode="fullscreen"
      onClose={() => {
        closeFullscreenLyrics();
        setIsLyricsModalOpen(false);
      }}
    />
  );
}
