'use client';

import { useEffect, useRef } from 'react';
import { useAudio } from '@/context/AudioContext';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

// 1-second silent WAV loop to keep audio context & session active on mobile OS
const SILENT_WAV_LOOP =
  'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';

export function GlobalAudioPlayer() {
  const { isPlaying, onPlayerReady, onPlayerStateChange, onProgressUpdate } = useAudio();
  const playerRef = useRef<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const silentAudioRef = useRef<HTMLAudioElement | null>(null);

  // 1. Register Service Worker for PWA & Background Support
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .catch((err) => console.warn('SW registration:', err));
    }
  }, []);

  // 2. Mobile Silent Audio Keeper: keep background audio session alive
  useEffect(() => {
    if (!silentAudioRef.current) return;

    if (isPlaying) {
      silentAudioRef.current.play().catch(() => {
        // May fail if user hasn't interacted yet
      });
    } else {
      silentAudioRef.current.pause();
    }
  }, [isPlaying]);

  // 3. Handle mobile background / visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        if (isPlaying) {
          silentAudioRef.current?.play().catch(() => {});
          // If mobile browser forced YouTube pause on tab hide, resume
          setTimeout(() => {
            if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
              const state = playerRef.current.getPlayerState?.();
              if (state === 2) {
                playerRef.current.playVideo();
              }
            }
          }, 150);
        }
      } else if (document.visibilityState === 'visible') {
        if (isPlaying && playerRef.current && typeof playerRef.current.playVideo === 'function') {
          const state = playerRef.current.getPlayerState?.();
          if (state === 2) {
            playerRef.current.playVideo();
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isPlaying]);

  // 4. Initialize YouTube Iframe Player
  useEffect(() => {
    // Check if script already loaded
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }

    const initPlayer = () => {
      if (window.YT && window.YT.Player) {
        playerRef.current = new window.YT.Player('yt-player-engine', {
          height: '2',
          width: '2',
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            playsinline: 1,
            enablejsapi: 1,
            rel: 0,
          },
          events: {
            onReady: (event: any) => {
              onPlayerReady(event.target);
            },
            onStateChange: (event: any) => {
              onPlayerStateChange(event.data);
            },
          },
        });
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    // Interval updater for playback position
    intervalRef.current = setInterval(() => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
        const curr = playerRef.current.getCurrentTime() || 0;
        const dur = playerRef.current.getDuration() || 0;
        onProgressUpdate(curr, dur);
      }
    }, 250);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        right: 0,
        width: 2,
        height: 2,
        opacity: 0.01,
        pointerEvents: 'none',
        zIndex: -1,
        overflow: 'hidden',
      }}
      aria-hidden="true"
    >
      <div id="yt-player-engine"></div>
      <audio
        ref={silentAudioRef}
        src={SILENT_WAV_LOOP}
        loop
        preload="auto"
        playsInline
      />
    </div>
  );
}

export default GlobalAudioPlayer;
