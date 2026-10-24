'use client';

import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAudio } from '@/context/AudioContext';
import { getArtistData } from '@/data/artists';
import TrackRow from '@/components/tracks/TrackRow';
import SpotifyLyrics from '@/components/lyrics/SpotifyLyrics';

export default function WebNowPlayingPage() {
  const router = useRouter();
  const progressBarRef = useRef<HTMLDivElement>(null);
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    playNext,
    playPrev,
    currentTime,
    duration,
    seekTo,
    isShuffle,
    toggleShuffle,
    isLiked,
    toggleLike,
    queue,
    queueIndex,
    toggleLyricsModal,
  } = useAudio();

  if (!currentTrack) {
    return (
      <section className="view active now-playing-web-view" style={{ display: 'block', textAlign: 'center', padding: '100px 32px' }}>
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--text-muted)' }}>
            <path d="M12 3v9.28c-.47-.17-.97-.28-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z" />
          </svg>
          <h2 style={{ fontSize: '1.5rem', marginTop: 16 }}>Belum Ada Lagu Diputar</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>
            Pilih lagu dari Beranda atau Cari lagu favoritmu untuk mendengarkan.
          </p>
          <button
            className="btn-primary-round"
            style={{ margin: '24px auto 0', width: 56, height: 56 }}
            onClick={() => router.push('/')}
            title="Buka Beranda"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>
      </section>
    );
  }

  const formatTime = (secs: number) => {
    if (!secs || isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;
  const liked = isLiked(currentTrack.id);
  const artistData = getArtistData(currentTrack.artistId || currentTrack.artist.toLowerCase(), currentTrack);
  const upcomingQueue = queue.slice(queueIndex + 1, queueIndex + 5);
  const thumbUrl = currentTrack.thumbnail || currentTrack.thumb || '';

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration || !progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    seekTo(pct * duration);
  };

  const handleArtistClick = () => {
    const artistId = currentTrack.artistId || encodeURIComponent(currentTrack.artist.toLowerCase().trim().replace(/[^a-z0-9]/g, '-'));
    router.push(`/artist/${artistId}`);
  };

  return (
    <section id="view-now-playing" className="view active now-playing-web-view" style={{ display: 'block' }}>
      {/* ─── Navigation Bar ─── */}
      <div className="view-nav-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <button
          className="btn-back-pill"
          onClick={() => router.back()}
          title="Kembali"
          aria-label="Kembali"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 16px',
            borderRadius: 9999,
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: 700,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>Kembali</span>
        </button>

        <span
          className="view-tag-badge"
          style={{
            background: 'rgba(30, 215, 96, 0.15)',
            color: 'var(--accent)',
            fontSize: '0.72rem',
            fontWeight: 800,
            padding: '4px 12px',
            borderRadius: 9999,
            letterSpacing: '0.08em',
          }}
        >
          SEDANG DIPUTAR
        </span>
      </div>

      <div className="now-playing-web-layout">
        {/* ─── Left Hero: Glowing Spinning Vinyl & Meta & Controls ─── */}
        <div className="now-playing-web-left">
          <div className="now-playing-web-disc-section">
            <div className="now-playing-disc-glow" />
            <div className={`now-playing-disc-wrap ${isPlaying ? 'spinning' : ''}`}>
              <img src={thumbUrl} alt={currentTrack.title} loading="lazy" />
            </div>
          </div>

          <div className="now-playing-web-meta">
            <h1 id="web-np-title" className="now-playing-web-title">
              {currentTrack.title}
            </h1>
            <div className="now-playing-web-artist-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 4 }}>
              <button
                id="web-np-artist"
                className="now-playing-web-artist-btn"
                onClick={handleArtistClick}
                title="Lihat Profil Artis"
                aria-label="Lihat Profil Artis"
              >
                <span>{currentTrack.artist}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#3d91f4">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </button>
              <span className="now-playing-album-tag" style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                • Audio Resmi YouTube
              </span>
            </div>
          </div>

          {/* Interactive Controls */}
          <div className="now-playing-web-controls">
            <button
              className={`icon-btn control-btn ${isShuffle ? 'active' : ''}`}
              onClick={toggleShuffle}
              title="Acak"
              aria-label="Acak"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="16,3 21,3 21,8" />
                <line x1="4" y1="20" x2="21" y2="3" />
                <polyline points="21,16 21,21 16,21" />
                <line x1="15" y1="15" x2="21" y2="21" />
                <line x1="4" y1="4" x2="9" y2="9" />
              </svg>
            </button>

            <button
              className="icon-btn control-btn"
              onClick={playPrev}
              title="Sebelumnya"
              aria-label="Lagu sebelumnya"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
              </svg>
            </button>

            <button
              className="web-np-play-btn"
              onClick={togglePlay}
              title={isPlaying ? 'Jeda' : 'Putar'}
              aria-label={isPlaying ? 'Jeda' : 'Putar'}
            >
              {isPlaying ? (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
                </svg>
              ) : (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: 3 }}>
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <button
              className="icon-btn control-btn"
              onClick={playNext}
              title="Selanjutnya"
              aria-label="Lagu selanjutnya"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 6h2v12h-2zm-10 0l8.5 6L6 18z" />
              </svg>
            </button>

            <button
              className={`icon-btn player-like-btn ${liked ? 'liked' : ''}`}
              onClick={() => toggleLike(currentTrack)}
              title={liked ? 'Hapus dari Disukai' : 'Suka lagu ini'}
              aria-label="Suka lagu ini"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill={liked ? 'var(--accent)' : 'none'}
                stroke={liked ? 'var(--accent)' : 'currentColor'}
                strokeWidth="2"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>

          {/* Progress Scrubber */}
          <div className="now-playing-web-progress-wrap">
            <div
              className="modal-progress-bar"
              ref={progressBarRef}
              onClick={handleSeek}
              role="slider"
              aria-label="Posisi lagu"
              tabIndex={0}
            >
              <div className="modal-progress-fill" style={{ width: `${progressPct}%` }} />
              <div className="modal-progress-handle" style={{ left: `${progressPct}%` }} />
            </div>
            <div className="modal-time-labels">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div
            className="now-playing-audio-badge"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              marginTop: 18,
              letterSpacing: '0.06em',
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'var(--accent)',
                display: 'inline-block',
                boxShadow: '0 0 8px var(--accent)',
              }}
            />
            <span>HQ AUDIO • 320 KBPS • YOUTUBE STREAMING</span>
          </div>
        </div>

        {/* ─── Right Companion: Lyrics, Artist Card, Up Next Queue ─── */}
        <div className="now-playing-web-right">
          {/* Card 1: Spotify Realtime Lyrics */}
          <SpotifyLyrics
            track={currentTrack}
            currentTime={currentTime}
            duration={duration}
            onSeek={seekTo}
            mode="embedded"
            onExpand={() => toggleLyricsModal(true)}
          />

          {/* Card 2: Tentang Artis Card */}
          <div
            className="now-playing-web-card artist-card"
            onClick={handleArtistClick}
            style={{ cursor: 'pointer' }}
          >
            <div className="card-header-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>TENTANG ARTIS</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <img
                src={artistData.avatar}
                alt={artistData.name}
                style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover' }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff' }}>{artistData.name}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {artistData.monthlyListeners} pendengar bulanan
                </p>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--text-muted)' }}>
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </div>

          {/* Card 3: Antrian Selanjutnya */}
          {upcomingQueue.length > 0 && (
            <div className="now-playing-web-card queue-card">
              <div className="card-header-between">
                <div className="card-header-badge" style={{ marginBottom: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="8" y1="6" x2="21" y2="6" />
                    <line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" />
                    <circle cx="3.5" cy="6" r="1.5" />
                    <circle cx="3.5" cy="12" r="1.5" />
                    <circle cx="3.5" cy="18" r="1.5" />
                  </svg>
                  <span>ANTRIAN SELANJUTNYA</span>
                </div>
              </div>
              <div className="track-list" style={{ marginTop: 12 }}>
                {upcomingQueue.map((track, idx) => (
                  <TrackRow
                    key={track.id}
                    track={track}
                    index={idx}
                    queueContext={queue}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
