'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAudio } from '@/context/AudioContext';
import { CURATED_PLAYLISTS } from '@/data/recommendations';
import TrackRow from '@/components/tracks/TrackRow';
import { Track } from '@/types';

export default function PlaylistDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { playlists, playTrack, recommendations } = useAudio();

  const playlistId = params?.id as string;

  // Search curated playlists first
  const curated = CURATED_PLAYLISTS.find((p) => p.id === playlistId);
  // Search user playlists
  const userPlaylist = playlists.find((p) => p.id === playlistId);

  let title = 'Playlist';
  let description = '';
  let badge = 'PLAYLIST';
  let cover = '';
  let gradient = 'linear-gradient(135deg, #006450, #1ed760)';
  let tracks: Track[] = [];

  if (curated) {
    title = curated.title || curated.name;
    description = curated.description || curated.desc;
    badge = curated.badge;
    cover = curated.cover || curated.thumb;
    gradient = curated.gradient || 'linear-gradient(135deg, #006450, #1ed760)';

    tracks = curated.tracks && curated.tracks.length > 0 ? curated.tracks : [];
  } else if (userPlaylist) {
    title = userPlaylist.name;
    description = userPlaylist.description || userPlaylist.desc || 'Dibuat oleh Kamu';
    badge = 'PLAYLIST SAYA';
    cover = userPlaylist.cover || (userPlaylist.tracks[0]?.thumbnail || userPlaylist.tracks[0]?.thumb || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=600&auto=format&fit=crop&q=80');
    tracks = userPlaylist.tracks;
  } else {
    title = 'Daftar Putar';
    description = 'Koleksi musik pilihan';
    cover = recommendations[0]?.thumbnail || recommendations[0]?.thumb || '';
    tracks = recommendations.slice(0, 8);
  }

  const handlePlayAll = () => {
    if (tracks.length > 0) {
      playTrack(tracks[0], tracks);
    }
  };

  return (
    <section id="view-playlist" className="view active playlist-detail-view" style={{ display: 'block' }}>
      {/* ─── Spotify Playlist Header with Dynamic Gradient ─── */}
      <div className="playlist-detail-header">
        <div className="playlist-detail-gradient" style={{ background: gradient }} />

        {/* Topbar: Overlapping back button */}
        <div className="playlist-detail-topbar">
          <button className="btn-back" onClick={() => router.back()} aria-label="Kembali">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <span>Kembali</span>
          </button>
        </div>

        {/* Hero: Artwork & Title */}
        <div className="playlist-detail-hero">
          <div className="playlist-detail-thumb-wrap">
            <img src={cover} alt={title} loading="lazy" />
          </div>

          <div className="playlist-detail-info">
            <span className="label-small">{badge}</span>
            <h1>{title}</h1>
            <p className="playlist-desc">{description}</p>
            <div className="playlist-meta" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginTop: 8 }}>
              <span style={{ color: '#fff', fontWeight: 700 }}>Playtify</span> • <span>{tracks.length} Lagu</span> • Rekomendasi Terkini
            </div>

            <div className="playlist-detail-actions">
              <button
                className="btn-primary-round"
                onClick={handlePlayAll}
                title="Putar Semua"
                aria-label="Putar Semua Lagu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Track List Table ─── */}
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

        {tracks.length > 0 ? (
          <div className="track-table-list">
            {tracks.map((track, idx) => (
              <TrackRow
                key={track.id}
                track={track}
                index={idx}
                queueContext={tracks}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state" style={{ textAlign: 'center', padding: '60px 20px', color: '#888' }}>
            <h3>Playlist ini masih kosong</h3>
            <p>Pilih lagu dari beranda untuk mulai mendengarkan.</p>
          </div>
        )}
      </div>
    </section>
  );
}
