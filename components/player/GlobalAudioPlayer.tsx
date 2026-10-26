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
  const { onPlayerReady, onPlayerStateChange, onProgressUpdate, isPlaying } = useAudio();
  
  const audioEngineRef = useRef<HTMLAudioElement | null>(null);
  const ytPlayerRef = useRef<any>(null);
  const activeEngineRef = useRef<'native' | 'yt'>('native');
  const currentVideoIdRef = useRef<string | null>(null);
  const isPlayingRef = useRef(isPlaying);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Keep background audio active when app goes to background / screen locks
  useEffect(() => {
    const keepPlaying = () => {
      if (typeof document !== 'undefined' && document.hidden && isPlayingRef.current) {
        if (activeEngineRef.current === 'native' && audioEngineRef.current?.paused) {
          audioEngineRef.current.play().catch(() => {});
        } else if (activeEngineRef.current === 'yt' && ytPlayerRef.current?.playVideo) {
          ytPlayerRef.current.playVideo();
        }
      }
    };

    document.addEventListener('visibilitychange', keepPlaying);
    window.addEventListener('blur', keepPlaying);
    return () => {
      document.removeEventListener('visibilitychange', keepPlaying);
      window.removeEventListener('blur', keepPlaying);
    };
  }, []);

  // 1. Register Service Worker for PWA & Background Support
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .catch((err) => console.warn('SW registration:', err));
    }
  }, []);

  // 2. Fallback to YouTube Iframe Player when direct streaming isn't available
  const fallbackToYouTube = (videoId: string) => {
    console.warn(`[AudioEngine] Falling back to YouTube Iframe player for track ${videoId}`);
    activeEngineRef.current = 'yt';
    if (audioEngineRef.current) {
      audioEngineRef.current.pause();
      audioEngineRef.current.removeAttribute('src');
      audioEngineRef.current.load();
    }
    if (ytPlayerRef.current && typeof ytPlayerRef.current.loadVideoById === 'function') {
      ytPlayerRef.current.loadVideoById({
        videoId,
        suggestedQuality: 'small',
      });
      ytPlayerRef.current.playVideo();
    }
  };

  // 3. Initialize Unified Player Engine and YouTube Iframe fallback
  useEffect(() => {
    // A. Create the unified player engine facade
    const engine = {
      loadVideoById: ({ videoId }: { videoId: string }) => {
        currentVideoIdRef.current = videoId;
        activeEngineRef.current = 'native';

        if (audioEngineRef.current) {
          const streamUrl = `/api/stream?id=${encodeURIComponent(videoId)}`;
          audioEngineRef.current.src = streamUrl;
          audioEngineRef.current.currentTime = 0;
          
          const playPromise = audioEngineRef.current.play();
          if (playPromise !== undefined) {
            playPromise.catch((err) => {
              console.warn('[AudioEngine] Native play error, falling back to YouTube:', err);
              fallbackToYouTube(videoId);
            });
          }
        }
      },
      playVideo: () => {
        if (activeEngineRef.current === 'native' && audioEngineRef.current) {
          audioEngineRef.current.play().catch(() => {});
        } else if (ytPlayerRef.current?.playVideo) {
          ytPlayerRef.current.playVideo();
        }
      },
      pauseVideo: () => {
        if (activeEngineRef.current === 'native' && audioEngineRef.current) {
          audioEngineRef.current.pause();
        } else if (ytPlayerRef.current?.pauseVideo) {
          ytPlayerRef.current.pauseVideo();
        }
      },
      seekTo: (seconds: number) => {
        if (activeEngineRef.current === 'native' && audioEngineRef.current) {
          audioEngineRef.current.currentTime = seconds;
        } else if (ytPlayerRef.current?.seekTo) {
          ytPlayerRef.current.seekTo(seconds, true);
        }
      },
      setVolume: (percent: number) => {
        if (audioEngineRef.current) {
          audioEngineRef.current.volume = Math.max(0, Math.min(1, percent / 100));
        }
        if (ytPlayerRef.current?.setVolume) {
          ytPlayerRef.current.setVolume(percent);
        }
      },
      getDuration: () => {
        if (activeEngineRef.current === 'native' && audioEngineRef.current) {
          return audioEngineRef.current.duration || 0;
        }
        return ytPlayerRef.current?.getDuration?.() || 0;
      },
      getCurrentTime: () => {
        if (activeEngineRef.current === 'native' && audioEngineRef.current) {
          return audioEngineRef.current.currentTime || 0;
        }
        return ytPlayerRef.current?.getCurrentTime?.() || 0;
      },
    };

    onPlayerReady(engine);

    // B. Initialize YouTube fallback iframe
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }

    const initYt = () => {
      if (window.YT && window.YT.Player) {
        ytPlayerRef.current = new window.YT.Player('yt-player-engine', {
          height: '240',
          width: '320',
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
            onStateChange: (event: any) => {
              // Only propagate YouTube events when YouTube is the active engine
              if (activeEngineRef.current === 'yt') {
                if (event.data === 2) {
                  // If YouTube was paused while user wanted playback and app is minimized/hidden, auto-resume!
                  if (isPlayingRef.current && typeof document !== 'undefined' && document.hidden) {
                    ytPlayerRef.current?.playVideo();
                    return;
                  }
                }
                onPlayerStateChange(event.data);
              }
            },
          },
        });
      }
    };

    if (window.YT && window.YT.Player) {
      initYt();
    } else {
      window.onYouTubeIframeAPIReady = initYt;
    }

    // Interval updater for YouTube fallback playback position
    const interval = setInterval(() => {
      if (activeEngineRef.current === 'yt' && ytPlayerRef.current && typeof ytPlayerRef.current.getCurrentTime === 'function') {
        const curr = ytPlayerRef.current.getCurrentTime() || 0;
        const dur = ytPlayerRef.current.getDuration() || 0;
        onProgressUpdate(curr, dur);
      }
    }, 250);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        left: -9999,
        top: -9999,
        width: 320,
        height: 240,
        opacity: 0.05,
        pointerEvents: 'none',
        zIndex: -9999,
      }}
      aria-hidden="true"
    >
      {/* 
        Native HTML5 Audio element:
        Plays direct /api/stream audio chunks. Allows true background playback
        on mobile devices (iOS Safari, Android Chrome, PWA) without being killed
        by the OS when the screen is locked or tab is hidden.
      */}
      <audio
        ref={audioEngineRef}
        preload="auto"
        playsInline
        onPlay={() => {
          if (activeEngineRef.current === 'native') {
            onPlayerStateChange(1); // Playing
          }
        }}
        onPause={() => {
          if (activeEngineRef.current === 'native') {
            if (typeof document !== 'undefined' && document.hidden) {
              // Chromium throttled/paused HTML5 audio in background -> auto resume
              audioEngineRef.current?.play().catch(() => {});
              return;
            }
            onPlayerStateChange(2); // Paused
          }
        }}
        onEnded={() => {
          if (activeEngineRef.current === 'native') {
            onPlayerStateChange(0); // Ended -> auto plays next track in queue!
          }
        }}
        onTimeUpdate={() => {
          if (activeEngineRef.current === 'native' && audioEngineRef.current) {
            const curr = audioEngineRef.current.currentTime || 0;
            const dur = audioEngineRef.current.duration || 0;
            onProgressUpdate(curr, dur);
          }
        }}
        onLoadedMetadata={() => {
          if (activeEngineRef.current === 'native' && audioEngineRef.current) {
            const dur = audioEngineRef.current.duration;
            if (dur && !isNaN(dur) && isFinite(dur)) {
              onProgressUpdate(audioEngineRef.current.currentTime || 0, dur);
            }
          }
        }}
        onError={() => {
          if (currentVideoIdRef.current) {
            fallbackToYouTube(currentVideoIdRef.current);
          }
        }}
      />

      {/* Fallback YouTube iframe container */}
      <div id="yt-player-engine" />
    </div>
  );
}

export default GlobalAudioPlayer;
