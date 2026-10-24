'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Track } from '@/types';
import { getLyricsForTrack, LyricLine } from '@/data/lyrics';

interface SpotifyLyricsProps {
  track: Track;
  currentTime: number;
  duration?: number;
  isPlaying?: boolean;
  onSeek: (time: number) => void;
  onTogglePlay?: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  mode?: 'embedded' | 'fullscreen' | 'preview';
  onExpand?: () => void;
  onClose?: () => void;
}

export default function SpotifyLyrics({
  track,
  currentTime,
  duration = 0,
  isPlaying = false,
  onSeek,
  onTogglePlay,
  onNext,
  onPrev,
  mode = 'embedded',
  onExpand,
  onClose,
}: SpotifyLyricsProps) {
  const lyrics = getLyricsForTrack(track.id, track.title, track.artist);
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const isUserScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Compute active lyric line index based on current playback time
  const activeIndex = lyrics.lines.reduce((acc, line, idx) => {
    if (currentTime >= line.time) return idx;
    return acc;
  }, 0);

  // Smooth auto-scroll active lyric into center of view
  useEffect(() => {
    if (mode === 'preview') return;
    if (isUserScrollingRef.current) return;

    const el = lineRefs.current[activeIndex];
    if (el && containerRef.current) {
      el.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });
    }
  }, [activeIndex, mode]);

  const handleScroll = () => {
    isUserScrollingRef.current = true;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      isUserScrollingRef.current = false;
    }, 3200);
  };

  const formatTime = (secs: number) => {
    if (!secs || isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  // ─────────────────────────────────────────────────────────────
  // 1. PREVIEW MODE (For Mobile Now Playing Modal)
  // ─────────────────────────────────────────────────────────────
  if (mode === 'preview') {
    const currentLine = lyrics.lines[activeIndex]?.text || `♪ ${track.title} ♪`;
    const nextLine = lyrics.lines[activeIndex + 1]?.text || `Karya dari ${track.artist}`;

    return (
      <div
        className="spotify-lyrics-preview-card"
        style={{
          background: lyrics.themeColor || 'linear-gradient(135deg, #2b1f3d, #140d1f)',
        }}
        onClick={onExpand}
        role="button"
        tabIndex={0}
        aria-label="Buka Lirik Penuh"
      >
        <div className="preview-top-row">
          <div className="preview-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zm5.3 7.7a1 1 0 0 0-2 .2c0 2.9-2.4 5.3-5.3 5.3s-5.3-2.4-5.3-5.3a1 1 0 1 0-2-.2C3 13.5 5.9 17 9.8 17.2V20H7a1 1 0 0 0 0 2h10a1 1 0 0 0 0-2h-2.8v-2.8c3.9-.2 6.8-3.7 3.1-7.5z" />
            </svg>
            <span>LIRIK</span>
          </div>

          <button
            className="preview-expand-btn"
            onClick={(e) => {
              e.stopPropagation();
              if (onExpand) onExpand();
            }}
            title="Layar Penuh"
            aria-label="Layar Penuh"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 3 21 3 21 9" />
              <polyline points="9 21 3 21 3 15" />
              <line x1="21" y1="3" x2="14" y2="10" />
              <line x1="3" y1="21" x2="10" y2="14" />
            </svg>
          </button>
        </div>

        <div className="preview-lines">
          <p className="preview-active-line">{currentLine}</p>
          <p className="preview-next-line">{nextLine}</p>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 2. EMBEDDED MODE (For /now-playing Companion Column)
  // ─────────────────────────────────────────────────────────────
  if (mode === 'embedded') {
    return (
      <div
        className="spotify-lyrics-embedded-container"
        style={{
          background: lyrics.themeColor || 'linear-gradient(180deg, #1f1b2e 0%, #0d0a14 100%)',
        }}
      >
        {/* Header */}
        <div className="lyrics-embedded-header">
          <div className="lyrics-title-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zm5.3 7.7a1 1 0 0 0-2 .2c0 2.9-2.4 5.3-5.3 5.3s-5.3-2.4-5.3-5.3a1 1 0 1 0-2-.2C3 13.5 5.9 17 9.8 17.2V20H7a1 1 0 0 0 0 2h10a1 1 0 0 0 0-2h-2.8v-2.8c3.9-.2 6.8-3.7 3.1-7.5z" />
            </svg>
            <span>LIRIK LAGU</span>
          </div>

          {onExpand && (
            <button
              className="lyrics-action-btn"
              onClick={onExpand}
              title="Buka Layar Penuh"
              aria-label="Buka Layar Penuh"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 3 21 3 21 9" />
                <polyline points="9 21 3 21 3 15" />
                <line x1="21" y1="3" x2="14" y2="10" />
                <line x1="3" y1="21" x2="10" y2="14" />
              </svg>
              <span>Layar Penuh</span>
            </button>
          )}
        </div>

        {/* Scrollable Karaoke Lines */}
        <div
          className="lyrics-scroll-stage"
          ref={containerRef}
          onScroll={handleScroll}
        >
          <div className="lyrics-stage-padding-top" />
          {lyrics.lines.map((line, idx) => {
            const isActive = idx === activeIndex;
            const isPast = idx < activeIndex;
            const statusClass = isActive ? 'active' : isPast ? 'past' : 'upcoming';

            return (
              <p
                key={idx}
                ref={(el) => {
                  lineRefs.current[idx] = el;
                }}
                className={`spotify-lyric-line ${statusClass}`}
                onClick={() => onSeek(line.time)}
                title={`Lompat ke ${formatTime(line.time)}`}
              >
                {line.text}
              </p>
            );
          })}
          <div className="lyrics-stage-padding-bottom" />
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 3. FULLSCREEN MODE (Spotify Immersive Karaoke View)
  // ─────────────────────────────────────────────────────────────
  return (
    <div
      className="spotify-lyrics-fullscreen-modal"
      style={{
        background: lyrics.themeColor || 'linear-gradient(180deg, #1b172a 0%, #07050a 100%)',
      }}
      role="dialog"
      aria-label="Lirik Lagu Spotify Layar Penuh"
    >
      {/* Background ambient glow effect */}
      <div className="fullscreen-lyrics-glow" />

      {/* Top bar with back button & track title */}
      <div className="fullscreen-lyrics-topbar">
        <button
          className="fullscreen-back-btn"
          onClick={onClose}
          title="Tutup lirik"
          aria-label="Tutup lirik"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        <div className="fullscreen-topbar-info">
          <span className="fullscreen-badge">LIRIK SINKRON</span>
          <p className="fullscreen-song-title">{track.title}</p>
          <p className="fullscreen-song-artist">{track.artist}</p>
        </div>

        <button
          className="fullscreen-close-pill"
          onClick={onClose}
          title="Keluar"
          aria-label="Keluar dari layar penuh"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Main Lyrics Karaoke Canvas */}
      <div
        className="fullscreen-lyrics-canvas"
        ref={containerRef}
        onScroll={handleScroll}
      >
        <div className="fullscreen-stage-spacer-top" />
        {lyrics.lines.map((line, idx) => {
          const isActive = idx === activeIndex;
          const isPast = idx < activeIndex;
          const statusClass = isActive ? 'active' : isPast ? 'past' : 'upcoming';

          return (
            <p
              key={idx}
              ref={(el) => {
                lineRefs.current[idx] = el;
              }}
              className={`spotify-fullscreen-lyric-line ${statusClass}`}
              onClick={() => onSeek(line.time)}
              title={`Lompat ke menit ${formatTime(line.time)}`}
            >
              {line.text}
            </p>
          );
        })}
        <div className="fullscreen-stage-spacer-bottom" />
      </div>

      {/* Bottom Floating Control Bar */}
      <div className="fullscreen-lyrics-controls-bar">
        <div className="fullscreen-progress-row">
          <span className="time-code">{formatTime(currentTime)}</span>
          <div
            className="fullscreen-progress-track"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
              if (duration > 0) onSeek(pct * duration);
            }}
            role="slider"
            aria-label="Durasi lirik"
            tabIndex={0}
          >
            <div className="fullscreen-progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
          <span className="time-code">{formatTime(duration)}</span>
        </div>

        <div className="fullscreen-buttons-row">
          {onPrev && (
            <button className="icon-btn control-btn" onClick={onPrev} title="Sebelumnya" aria-label="Sebelumnya">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
              </svg>
            </button>
          )}

          {onTogglePlay && (
            <button
              className="btn-primary-round fullscreen-play-btn"
              onClick={onTogglePlay}
              title={isPlaying ? 'Jeda' : 'Putar'}
              aria-label={isPlaying ? 'Jeda' : 'Putar'}
            >
              {isPlaying ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
          )}

          {onNext && (
            <button className="icon-btn control-btn" onClick={onNext} title="Selanjutnya" aria-label="Selanjutnya">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 6h2v12h-2zm-10 0l8.5 6L6 18z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
