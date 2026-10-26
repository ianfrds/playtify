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
  const { onPlayerReady, onPlayerStateChange, onProgressUpdate, isPlaying, currentTrack } = useAudio();
  
  const audioEngineRef = useRef<HTMLAudioElement | null>(null);
  const ytPlayerRef = useRef<any>(null);
  const activeEngineRef = useRef<'native' | 'yt' | 'android_native'>('native');
  const currentVideoIdRef = useRef<string | null>(null);
  const isPlayingRef = useRef(isPlaying);
  const currentTrackRef = useRef(currentTrack);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    currentTrackRef.current = currentTrack;
  }, [currentTrack]);

  // Handle native Android progress and state callbacks
  useEffect(() => {
    if (typeof window === 'undefined') return;

    (window as any).handleNativeProgress = (curr: number, dur: number) => {
      if (activeEngineRef.current === 'android_native') {
        onProgressUpdate(curr, dur);
      }
    };

    (window as any).handleNativeStateChange = (playing: boolean) => {
      if (activeEngineRef.current === 'android_native') {
        onPlayerStateChange(playing ? 1 : 2);
      }
    };

    return () => {
      delete (window as any).handleNativeProgress;
      delete (window as any).handleNativeStateChange;
    };
  }, [onProgressUpdate, onPlayerStateChange]);

  // Keep background audio active when app goes to background / screen locks
  useEffect(() => {
    const keepPlaying = () => {
      if (typeof document !== 'undefined' && document.hidden && isPlayingRef.current) {
        if (activeEngineRef.current === 'native' && audioEngineRef.current?.paused) {
          audioEngineRef.current.play().catch(() => {});
        } else if (activeEngineRef.current === 'yt' && ytPlayerRef.current?.playVideo) {
          ytPlayerRef.current.playVideo();
        } else if (activeEngineRef.current === 'android_native') {
          const bridge = (window as any).AndroidAudioBridge;
          if (bridge?.resumeAudio) {
            bridge.resumeAudio();
          }
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

        const bridge = typeof window !== 'undefined' ? (window as any).AndroidAudioBridge : null;
        if (bridge && typeof bridge.playTrack === 'function') {
          activeEngineRef.current = 'android_native';

          // Pause web audio and youtube iframe so no duplicate playback
          if (audioEngineRef.current) {
            audioEngineRef.current.pause();
            audioEngineRef.current.removeAttribute('src');
          }
          if (ytPlayerRef.current?.pauseVideo) {
            ytPlayerRef.current.pauseVideo();
          }

          const track = currentTrackRef.current;
          const origin = window.location.origin;
          const streamUrl = `${origin}/api/stream?id=${encodeURIComponent(videoId)}`;
          const title = track?.title || 'Haytify Music';
          const artist = track?.artist || 'Haytify';
          const cover = track?.thumbnail || track?.thumb || '';

          bridge.playTrack(videoId, title, artist, cover, streamUrl);
          return;
        }

        // Web / iOS standard HTML5 audio engine
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
        const bridge = typeof window !== 'undefined' ? (window as any).AndroidAudioBridge : null;
        if (activeEngineRef.current === 'android_native' && bridge?.resumeAudio) {
          bridge.resumeAudio();
        } else if (activeEngineRef.current === 'native' && audioEngineRef.current) {
          audioEngineRef.current.play().catch(() => {});
        } else if (ytPlayerRef.current?.playVideo) {
          ytPlayerRef.current.playVideo();
        }
      },
      pauseVideo: () => {
        const bridge = typeof window !== 'undefined' ? (window as any).AndroidAudioBridge : null;
        if (activeEngineRef.current === 'android_native' && bridge?.pauseAudio) {
          bridge.pauseAudio();
        } else if (activeEngineRef.current === 'native' && audioEngineRef.current) {
          audioEngineRef.current.pause();
        } else if (ytPlayerRef.current?.pauseVideo) {
          ytPlayerRef.current.pauseVideo();
        }
      },
      seekTo: (seconds: number) => {
        const bridge = typeof window !== 'undefined' ? (window as any).AndroidAudioBridge : null;
        if (activeEngineRef.current === 'android_native' && bridge?.seekTo) {
          bridge.seekTo(seconds);
        } else if (activeEngineRef.current === 'native' && audioEngineRef.current) {
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
              if (activeEngineRef.current === 'yt') {
                if (event.data === 2) {
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
      <audio
        ref={audioEngineRef}
        preload="auto"
        playsInline
        onPlay={() => {
          if (activeEngineRef.current === 'native') {
            onPlayerStateChange(1);
          }
        }}
        onPause={() => {
          if (activeEngineRef.current === 'native') {
            if (typeof document !== 'undefined' && document.hidden) {
              audioEngineRef.current?.play().catch(() => {});
              return;
            }
            onPlayerStateChange(2);
          }
        }}
        onEnded={() => {
          if (activeEngineRef.current === 'native') {
            onPlayerStateChange(0);
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
          if (activeEngineRef.current === 'native' && currentVideoIdRef.current) {
            fallbackToYouTube(currentVideoIdRef.current);
          }
        }}
      />

      <div id="yt-player-engine" />
    </div>
  );
}

export default GlobalAudioPlayer;
