'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAudio } from '@/context/AudioContext';

export default function QueuePage() {
  const router = useRouter();
  const {
    currentTrack,
    isPlaying,
    queue,
    playTrack,
    clearQueue,
    removeFromQueue,
  } = useAudio();

  const formatTime = (secs: number) => {
    if (!secs || isNaN(secs) || secs <= 0) return '3:20';
    const safeSecs = Math.max(0, Math.floor(secs));
    const m = Math.floor(safeSecs / 60);
    const s = Math.floor(safeSecs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <section id="view-queue" className="view active queue-page-view" style={{ display: 'block' }}>
      {/* ─── Top Header Bar ─── */}
      <div className="queue-page-topbar">
        <div className="queue-topbar-left">
          <button
            className="queue-topbar-back-btn"
            onClick={() => router.back()}
            aria-label="Kembali"
            title="Kembali"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <span className="queue-back-label">Kembali</span>
          </button>
        </div>

        <div className="queue-topbar-center">
          <h1 className="queue-page-title">Antrean</h1>
          <span className="queue-page-badge">{queue.length} lagu</span>
        </div>

        <div className="queue-topbar-right">
          {queue.length > 0 && (
            <button
              className="btn-clear-queue"
              onClick={clearQueue}
              title="Kosongkan seluruh antrean"
              aria-label="Kosongkan Antrean"
            >
              Hapus Semua
            </button>
          )}
        </div>
      </div>

      <div className="queue-page-content">
        {/* ─── 1. Now Playing Section ─── */}
        <section className="queue-section-box">
          <h2 className="queue-section-title">Sedang Diputar</h2>
          {currentTrack ? (
            <div className="queue-current-card">
              <div className="queue-current-thumb">
                <img
                  src={currentTrack.thumbnail || currentTrack.thumb || '/logo.png'}
                  alt={currentTrack.title}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/logo.png';
                  }}
                />
                {isPlaying && (
                  <div className="queue-playing-badge">
                    <span className="eq-bar eq-bar-1" />
                    <span className="eq-bar eq-bar-2" />
                    <span className="eq-bar eq-bar-3" />
                  </div>
                )}
              </div>
              <div className="queue-current-info">
                <p className="queue-current-title">{currentTrack.title}</p>
                <p
                  className="queue-current-artist clickable-artist"
                  onClick={() => {
                    const artistId = currentTrack.artistId || encodeURIComponent(currentTrack.artist.toLowerCase().trim().replace(/[^a-z0-9]/g, '-'));
                    router.push(`/artist/${artistId}`);
                  }}
                >
                  {currentTrack.artist}
                </p>
                {currentTrack.album && (
                  <p className="queue-current-album">{currentTrack.album}</p>
                )}
              </div>
              <div className="queue-current-time">
                {formatTime(currentTrack.duration || 0)}
              </div>
            </div>
          ) : (
            <p className="queue-empty-text">Tidak ada lagu yang sedang diputar.</p>
          )}
        </section>

        {/* ─── 2. Next in Queue Section ─── */}
        <section className="queue-section-box" style={{ marginTop: 28 }}>
          <div className="queue-section-header">
            <h2 className="queue-section-title">Berikutnya dalam Antrean</h2>
            <span className="queue-count-badge">{queue.length} lagu</span>
          </div>

          {queue.length > 0 ? (
            <div className="queue-list-wrap">
              {queue.map((track, idx) => (
                <div
                  key={`${track.id}-${idx}`}
                  className="queue-item-row"
                  onClick={() => playTrack(track, queue.filter((_, i) => i !== idx))}
                  role="button"
                  tabIndex={0}
                  title={`Putar ${track.title}`}
                >
                  <span className="queue-item-idx">{idx + 1}</span>
                  <div className="queue-item-thumb">
                    <img
                      src={track.thumbnail || track.thumb || '/logo.png'}
                      alt={track.title}
                      loading="lazy"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/logo.png';
                      }}
                    />
                  </div>
                  <div className="queue-item-meta">
                    <p className="queue-item-title">{track.title}</p>
                    <p className="queue-item-artist">{track.artist}</p>
                  </div>
                  <span className="queue-item-duration">
                    {formatTime(track.duration || 0)}
                  </span>
                  <button
                    className="queue-item-remove-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromQueue(idx);
                    }}
                    title="Hapus dari antrean"
                    aria-label="Hapus dari antrean"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="queue-empty-state">
              <div className="queue-empty-icon-wrap">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <circle cx="3.5" cy="6" r="1.5" />
                  <circle cx="3.5" cy="12" r="1.5" />
                  <circle cx="3.5" cy="18" r="1.5" />
                </svg>
              </div>
              <h3>Antrean Kamu Masih Kosong</h3>
              <p>Tambahkan lagu dari pencarian, album, atau playlist untuk diputar otomatis berikutnya.</p>
              <div className="queue-empty-actions">
                <button
                  className="btn-pill-play"
                  onClick={() => router.push('/')}
                >
                  Jelajahi Beranda
                </button>
                <button
                  className="btn-pill-secondary"
                  onClick={() => router.push('/search')}
                >
                  Cari Lagu
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </section>
  );
}
