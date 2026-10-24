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
    setIsLyricsModalOpen,
  } = useAudio();

  if (!isLyricsModalOpen || !currentTrack) return null;

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
      onClose={() => setIsLyricsModalOpen(false)}
    />
  );
}
