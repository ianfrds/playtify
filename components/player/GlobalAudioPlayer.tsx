'use client';

import { useEffect, useRef } from 'react';
import { useAudio } from '@/context/AudioContext';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export function GlobalAudioPlayer() {
  const { onPlayerReady, onPlayerStateChange, onProgressUpdate } = useAudio();
  const playerRef = useRef<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
          height: '1',
          width: '1',
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            playsinline: 1,
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
    <div style={{ position: 'fixed', bottom: -100, left: -100, width: 1, height: 1, opacity: 0, pointerEvents: 'none', zIndex: -1 }}>
      <div id="yt-player-engine"></div>
    </div>
  );
}

export default GlobalAudioPlayer;
