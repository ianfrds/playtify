'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAudio } from '@/context/AudioContext';
import TrackRow from '@/components/tracks/TrackRow';

export default function LikedSongsPage() {
  const router = useRouter();
  const { likedTracks, playTrack } = useAudio();

  const handlePlayAll = () => {
    if (likedTracks.length > 0) {
      playTrack(likedTracks[0], likedTracks);
    }
  };

  return (
    <section id="view-liked" className="view active" style={{ display: 'block' }}>
      <div className="view-header liked-header">
        <div className="liked-gradient" />
        <div className="liked-info">
          <span className="label-small">PLAYLIST</span>
          <h1>Liked Songs</h1>
          <p id="liked-count" className="subtitle">{likedTracks.length} lagu</p>
          {likedTracks.length > 0 && (
            <div style={{ marginTop: 18 }}>
              <button
                className="btn-primary-round"
                onClick={handlePlayAll}
                title="Putar Semua Lagu Disukai"
                aria-label="Putar Semua"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {likedTracks.length > 0 ? (
        <div className="track-table-wrap">
          <div className="track-table-header">
            <div className="col-index">#</div>
            <div className="col-title">Judul</div>
            <div className="col-album">Album</div>
            <div className="col-duration">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
          </div>
          <div className="track-table-list" id="liked-list">
            {likedTracks.map((track, idx) => (
              <TrackRow
                key={track.id}
                track={track}
                index={idx}
                queueContext={likedTracks}
              />
            ))}
          </div>
        </div>
      ) : (
        <div id="liked-empty" className="empty-state" style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <h3 style={{ marginTop: 16 }}>Belum ada lagu yang disukai</h3>
          <p style={{ marginTop: 8 }}>Tekan tombol hati pada lagu untuk menambahkannya ke sini</p>
          <button
            className="btn-secondary"
            style={{ marginTop: 20, padding: '10px 20px', borderRadius: 9999, background: 'var(--bg-elevated)', border: '1px solid var(--border)', cursor: 'pointer', color: '#fff' }}
            onClick={() => router.push('/')}
          >
            Cari Lagu Favorit
          </button>
        </div>
      )}
    </section>
  );
}
