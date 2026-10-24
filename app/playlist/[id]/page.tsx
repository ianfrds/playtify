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
  const {
    playlists,
    curatedPlaylists,
    playTrack,
    recommendations,
    openEditPlaylistModal,
    openDeletePlaylistModal,
    removeTrackFromPlaylist,
  } = useAudio();

  const playlistId = params?.id as string;

  // Search curated playlists first
  const curated = (curatedPlaylists || CURATED_PLAYLISTS).find((p) => p.id === playlistId);
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
    cover =
      userPlaylist.cover ||
      userPlaylist.tracks[0]?.thumbnail ||
      userPlaylist.tracks[0]?.thumb ||
      'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=600&auto=format&fit=crop&q=80';
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
          <div
            className={`playlist-detail-thumb-wrap ${userPlaylist ? 'clickable-cover' : ''}`}
            onClick={() => userPlaylist && openEditPlaylistModal(userPlaylist)}
            title={userPlaylist ? 'Klik untuk edit rincian playlist' : undefined}
            style={{ position: 'relative', cursor: userPlaylist ? 'pointer' : 'default' }}
          >
            <img src={cover} alt={title} loading="lazy" />
            {userPlaylist && (
              <div
                className="cover-edit-overlay"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0,0,0,0.6)',
                  opacity: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  color: '#fff',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  transition: 'opacity 0.2s ease',
                  borderRadius: 8,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                <span>Edit rincian</span>
              </div>
            )}
          </div>

          <div className="playlist-detail-info">
            <span className="label-small">{badge}</span>
            <h1
              onClick={() => userPlaylist && openEditPlaylistModal(userPlaylist)}
              style={{ cursor: userPlaylist ? 'pointer' : 'default' }}
              title={userPlaylist ? 'Klik untuk edit nama' : undefined}
            >
              {title}
            </h1>
            <p className="playlist-desc">{description}</p>
            <div className="playlist-meta" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginTop: 8 }}>
              <span style={{ color: '#fff', fontWeight: 700 }}>Haytify</span> • <span>{tracks.length} Lagu</span> •{' '}
              {userPlaylist ? 'Koleksi Kamu' : 'Rekomendasi Terkini'}
            </div>

            <div className="playlist-detail-actions" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
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

              {userPlaylist && (
                <>
                  <button
                    className="btn-playlist-edit"
                    onClick={() => openEditPlaylistModal(userPlaylist)}
                    title="Edit rincian playlist"
                    aria-label="Edit rincian playlist"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '10px 18px',
                      borderRadius: 24,
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#fff',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'background-color 0.2s, transform 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                      e.currentTarget.style.transform = 'scale(1.03)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    <span>Edit</span>
                  </button>

                  <button
                    className="btn-playlist-delete"
                    onClick={() => openDeletePlaylistModal(userPlaylist)}
                    title="Hapus playlist"
                    aria-label="Hapus playlist"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '10px 18px',
                      borderRadius: 24,
                      background: 'rgba(233, 20, 41, 0.12)',
                      border: '1px solid rgba(233, 20, 41, 0.3)',
                      color: '#ff4d4d',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'background-color 0.2s, transform 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(233, 20, 41, 0.25)';
                      e.currentTarget.style.transform = 'scale(1.03)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(233, 20, 41, 0.12)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                    <span>Hapus</span>
                  </button>
                </>
              )}
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
                onRemove={userPlaylist ? () => removeTrackFromPlaylist(userPlaylist.id, track.id) : undefined}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state" style={{ textAlign: 'center', padding: '60px 20px', color: '#888' }}>
            <h3>Playlist ini masih kosong</h3>
            <p>Cari lagu favoritmu dan tambahkan ke playlist ini untuk mulai mendengarkan.</p>
          </div>
        )}
      </div>
    </section>
  );
}
