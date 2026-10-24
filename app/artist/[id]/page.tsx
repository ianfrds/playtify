'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAudio } from '@/context/AudioContext';
import { getArtistData } from '@/data/artists';
import TrackRow from '@/components/tracks/TrackRow';

export default function ArtistProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { playTrack, followedArtists, toggleFollowArtist, currentTrack } = useAudio();
  const [activeTab, setActiveTab] = useState<'all' | 'album' | 'single'>('all');

  const artistId = (params?.id as string) || 'bernadya';
  const artist = getArtistData(artistId, currentTrack);

  const isFollowed = followedArtists.some(
    (a) => a.toLowerCase() === artist.name.toLowerCase() || a.toLowerCase() === artist.id?.toLowerCase()
  );

  const handlePlayPopular = () => {
    const list = artist.popularTracks || artist.tracks;
    if (list.length > 0) {
      playTrack(list[0], list);
    }
  };

  const filteredAlbums = artist.albums.filter((a) => {
    if (activeTab === 'album') return a.type.toLowerCase() === 'album';
    if (activeTab === 'single') return a.type.toLowerCase() === 'single' || a.type.toLowerCase() === 'ep';
    return true;
  });

  const popularList = artist.popularTracks || artist.tracks;

  return (
    <section id="view-artist" className="view active artist-view" style={{ display: 'block' }}>
      {/* ─── Top Nav Bar ─── */}
      <div className="artist-topbar">
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
        <div className="artist-topbar-sticky-name visible">{artist.name}</div>
      </div>

      {/* ─── Hero Header with Full Background Art ─── */}
      <div className="artist-hero" id="artist-hero-banner">
        <div
          className="artist-hero-bg"
          style={{ backgroundImage: `url(${artist.coverImage || artist.banner})` }}
        />
        <div className="artist-hero-overlay" />
        <div className="artist-hero-content">
          <div className="artist-verified-badge">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#3d91f4">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            <span>Artis Terverifikasi</span>
          </div>
          <h1 className="artist-hero-name" id="artist-name">
            {artist.name}
          </h1>
          <p className="artist-monthly-listeners">
            {artist.monthlyListeners} pendengar bulanan
          </p>
        </div>
      </div>

      {/* ─── Action Bar ─── */}
      <div className="artist-action-bar">
        <button
          className="artist-play-btn"
          onClick={handlePlayPopular}
          title="Putar Semua Lagu Populer"
          aria-label="Putar Semua"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>

        <button
          className="btn-follow-pill"
          onClick={() => toggleFollowArtist(artist.name)}
          style={{
            background: isFollowed ? 'var(--accent)' : 'transparent',
            color: isFollowed ? '#000' : '#fff',
            borderColor: isFollowed ? 'var(--accent)' : 'rgba(255,255,255,0.35)',
            fontWeight: 800,
          }}
        >
          <span>{isFollowed ? 'MENGIKUTI' : 'IKUTI'}</span>
        </button>
      </div>

      {/* ─── Content Layout: Main column + Side column ─── */}
      <div className="artist-content-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: 32, padding: '0 36px' }}>
        <div className="artist-main-col">
          {/* Section: Populer */}
          <div className="artist-section" style={{ marginBottom: 36 }}>
            <h2 className="artist-section-title">Populer</h2>
            <div className="track-table-list">
              {popularList.map((track, idx) => (
                <TrackRow
                  key={track.id}
                  track={track}
                  index={idx}
                  queueContext={popularList}
                />
              ))}
            </div>
          </div>

          {/* Section: Diskografi */}
          <div className="artist-section" style={{ marginBottom: 36 }}>
            <div className="discography-header">
              <h2 className="artist-section-title">Diskografi</h2>
              <div className="discography-tabs">
                <button
                  className={`disco-tab ${activeTab === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveTab('all')}
                >
                  Rilis Populer
                </button>
                <button
                  className={`disco-tab ${activeTab === 'album' ? 'active' : ''}`}
                  onClick={() => setActiveTab('album')}
                >
                  Album
                </button>
                <button
                  className={`disco-tab ${activeTab === 'single' ? 'active' : ''}`}
                  onClick={() => setActiveTab('single')}
                >
                  Single & EP
                </button>
              </div>
            </div>

            <div
              className="shelf-grid"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 18 }}
            >
              {filteredAlbums.map((alb) => (
                <div key={alb.id || alb.title} className="track-card">
                  <div className="track-card-thumb" style={{ borderRadius: 8 }}>
                    <img src={alb.cover || alb.thumb} alt={alb.title} loading="lazy" />
                  </div>
                  <p className="track-card-title">{alb.title}</p>
                  <p className="track-card-artist">{alb.year} • {alb.type}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Penggemar Juga Menyukai */}
          <div className="artist-section">
            <h2 className="artist-section-title">Penggemar Juga Menyukai</h2>
            <div className="artist-circles-grid">
              {artist.related.map((relName) => (
                <div
                  key={relName}
                  className="artist-circle-card"
                  onClick={() => {
                    const slug = relName.toLowerCase().replace(/[^a-z0-9]/g, '-');
                    router.push(`/artist/${slug}`);
                  }}
                >
                  <div className="artist-circle-avatar">
                    <img
                      src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&auto=format&fit=crop&q=80"
                      alt={relName}
                      loading="lazy"
                    />
                  </div>
                  <span className="artist-circle-name">{relName}</span>
                  <span className="artist-circle-role">Artis</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Side Column: Tentang Artis Card */}
        <div className="artist-side-col">
          <div className="artist-about-card" id="artist-about-card">
            <div
              className="artist-about-bg"
              style={{ backgroundImage: `url(${artist.avatar || artist.banner})` }}
            />
            <div className="artist-about-overlay" />
            <div className="artist-about-content">
              <div className="artist-about-rank-badge">{artist.rank}</div>
              <h3 className="artist-about-title">{artist.name}</h3>
              <p className="artist-about-bio-text">{artist.bio}</p>
              <div className="artist-about-stats">
                <div className="stat-box">
                  <span className="stat-number">{artist.followers}</span>
                  <span className="stat-label">Pengikut</span>
                </div>
                <div className="stat-box">
                  <span className="stat-number">{artist.monthlyListeners}</span>
                  <span className="stat-label">Pendengar Bulanan</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
