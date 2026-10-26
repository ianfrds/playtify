'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAudio } from '@/context/AudioContext';
import TrackCard from '@/components/tracks/TrackCard';
import PlaylistCard from '@/components/playlists/PlaylistCard';
import { RECOMMENDATIONS_DATA } from '@/data/recommendations';

export default function HomePage() {
  const router = useRouter();
  const {
    recommendations,
    smartRecommendations,
    curatedPlaylists,
    userTasteProfile,
    history,
    playTrack,
    currentTrack,
    isPlaying,
    brandName,
    toggleLike,
    isLiked,
    user,
    openAuthModal,
  } = useAudio();

  const [searchQuery, setSearchQuery] = useState('');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return 'Selamat pagi';
    if (hour < 15) return 'Selamat siang';
    if (hour < 19) return 'Selamat sore';
    return 'Selamat malam';
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/search');
    }
  };

  const mixes = [
    { name: 'Top Hits Indonesia', key: 'top_indo', playlistId: 'top-indo', tracks: RECOMMENDATIONS_DATA.top_indo },
    { name: "Today's Top Hits Dunia", key: 'global_hits', playlistId: 'global-hits', tracks: RECOMMENDATIONS_DATA.global_hits },
    { name: 'Santai & Akustik Sore', key: 'chill_vibes', playlistId: 'chill-vibes', tracks: RECOMMENDATIONS_DATA.chill_vibes },
    { name: 'Lofi Beats & Fokus', key: 'lofi', playlistId: 'lofi-beats', tracks: RECOMMENDATIONS_DATA.lofi },
    { name: 'K-Pop Terpopuler', key: 'kpop', playlistId: 'kpop-hits', tracks: RECOMMENDATIONS_DATA.kpop },
    { name: 'Nostalgia Pop Rock', key: 'nostalgia', playlistId: 'nostalgia-indo', tracks: RECOMMENDATIONS_DATA.nostalgia },
  ];

  const topIndoTracks = RECOMMENDATIONS_DATA.top_indo || [];
  const globalTracks = RECOMMENDATIONS_DATA.global_hits || [];
  const chillTracks = RECOMMENDATIONS_DATA.chill_vibes || [];
  const kpopTracks = RECOMMENDATIONS_DATA.kpop || [];
  const nostalgiaTracks = RECOMMENDATIONS_DATA.nostalgia || [];

  const featuredTrack = topIndoTracks[0];
  const featuredLiked = featuredTrack ? isLiked(featuredTrack.id) : false;

  return (
    <section id="view-home" className="view active" style={{ display: 'block' }}>
      {/* ─── Mobile Header Bar (Screen 1 style) ─── */}
      <div className="mobile-top-header">
        <div className="mobile-user-profile">
          <div
            className="mobile-avatar-wrap"
            onClick={() => {
              if (user) {
                router.push('/login');
              } else {
                openAuthModal('Masuk ke Haytify', 'Nikmati playlist tanpa batas dan sinkronkan lagu favoritmu.');
              }
            }}
            role="button"
            tabIndex={0}
            title={user ? 'Lihat Akun' : 'Masuk / Daftar'}
            aria-label={user ? 'Lihat Akun' : 'Masuk / Daftar'}
          >
            {user?.user_metadata?.avatar_url || user?.user_metadata?.picture ? (
              <img
                src={user.user_metadata.avatar_url || user.user_metadata.picture}
                alt="Avatar"
                className="mobile-avatar"
              />
            ) : (
              <div
                className="mobile-avatar"
                style={{
                  background: user ? '#1ed760' : 'rgba(255,255,255,0.1)',
                  color: user ? '#000' : '#fff',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.88rem',
                }}
              >
                {user ? (user.user_metadata?.full_name || user.email || 'U').charAt(0).toUpperCase() : '🎧'}
              </div>
            )}
            <span className="mobile-online-dot" />
          </div>
          <div className="mobile-user-text">
            <span className="mobile-greeting-label">{getGreeting()}!</span>
            <p className="mobile-user-name">
              {user ? (user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0]) : 'Tamu Haytify'}
            </p>
          </div>
        </div>
        <div className="mobile-top-actions">
          <button
            className="mobile-icon-circle"
            onClick={() => router.push('/liked')}
            title="Lagu Favorit"
            aria-label="Lagu Favorit"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>

          <button
            className="mobile-icon-circle"
            onClick={() => router.push('/settings')}
            title="Pengaturan & Unduh APK"
            aria-label="Pengaturan"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </div>
      </div>

      {/* ─── Top Greeting & Search Header (Desktop) ─── */}
      <div className="home-top-bar">
        <div className="home-greeting-wrap">
          <h1 id="home-greeting">{getGreeting()}</h1>
        </div>
        <div className="home-search-wrap">
          <form onSubmit={handleSearchSubmit} className="search-box-large">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              id="home-search-input"
              placeholder="Cari lagu, artis, atau album dari YouTube..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Cari musik"
              autoComplete="off"
            />
          </form>
        </div>
      </div>

      {/* ─── Mobile Curated & Trending Highlight Card ─── */}
      {featuredTrack && (
        <div className="mobile-curated-section">
          <div className="mobile-section-header">
            <h3>Curated & Trending</h3>
            <button
              className="btn-see-all"
              onClick={() => router.push('/playlist/top-indo')}
            >
              Lihat Semua
            </button>
          </div>
          <div className="mobile-curated-card">
            <div className="mobile-curated-content">
              <span className="mobile-curated-tag">DISCOVER WEEKLY</span>
              <h2 className="mobile-curated-title">{featuredTrack.title}</h2>
              <p className="mobile-curated-desc">{featuredTrack.artist} • Lagu pilihan paling populer saat ini</p>
              <div className="mobile-curated-controls">
                <button
                  className="mobile-curated-play"
                  onClick={() => playTrack(featuredTrack, recommendations)}
                  title="Putar"
                  aria-label="Putar"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
                <button
                  className={`mobile-curated-icon-btn ${featuredLiked ? 'liked' : ''}`}
                  onClick={() => toggleLike(featuredTrack)}
                  title="Suka"
                  aria-label="Suka"
                  style={{ color: featuredLiked ? 'var(--accent)' : 'inherit' }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill={featuredLiked ? 'var(--accent)' : 'none'}
                    stroke={featuredLiked ? 'var(--accent)' : 'currentColor'}
                    strokeWidth="2"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="mobile-curated-thumb-side">
              <img
                src={featuredTrack.thumbnail || featuredTrack.thumb || '/logo.png'}
                alt={featuredTrack.title}
                loading="lazy"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/logo.png';
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ─── Quick Access Top Grid (Spotify 6-card quick mix) ─── */}
      <div className="quick-mix-grid" id="quick-mix-grid">
        {mixes.map((m) => {
          const leadTrack = m.tracks[0];
          const isThisPlaying = currentTrack?.id === leadTrack?.id && isPlaying;
          const thumbUrl = leadTrack?.thumbnail || leadTrack?.thumb || '/logo.png';
          return (
            <div
              key={m.key}
              className={`quick-mix-card ${isThisPlaying ? 'playing' : ''}`}
              onClick={() => router.push(`/playlist/${m.playlistId}`)}
              role="button"
              tabIndex={0}
              title={`Buka playlist ${m.name}`}
            >
              <div className="quick-mix-thumb">
                <img
                  src={thumbUrl}
                  alt={m.name}
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/logo.png';
                  }}
                />
              </div>
              <span className="quick-mix-title">{m.name}</span>
              <button
                className="quick-mix-play"
                onClick={(e) => {
                  e.stopPropagation();
                  if (leadTrack) playTrack(leadTrack, m.tracks);
                }}
                title={`Putar ${m.name}`}
                aria-label={`Putar ${m.name}`}
              >
                {isThisPlaying ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* ─── Spotify Recommendation Shelves Container ─── */}
      <div className="recommendations-container" id="recommendations-container" style={{ marginTop: 32 }}>
        {/* Shelf: Rekomendasi Pintar Berdasarkan Selera Musik User */}
        <section className="shelf-section" id="shelf-smart-recommendations">
          <div className="shelf-header">
            <h2>Dibuat Khusus untuk Kamu</h2>
          </div>
          <div className="shelf-row-wrap">
            <div className="shelf-row" id="shelf-row-smart">
              {smartRecommendations.map((track) => (
                <TrackCard
                  key={`smart-${track.id}`}
                  track={track}
                  queueContext={smartRecommendations}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Shelf: Baru Saja Diputar (Recently Played) */}
        {history.length > 0 && (
          <section className="shelf-section" id="shelf-recently-played">
            <div className="shelf-header">
              <h2>Baru Saja Diputar</h2>
            </div>
            <div className="shelf-row-wrap">
              <div className="shelf-row" id="shelf-row-history">
                {history.slice(0, 10).map((track) => (
                  <TrackCard
                    key={`hist-${track.id}`}
                    track={track}
                    queueContext={history}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Shelf: Rekomendasi Playlist Populer */}
        <section className="shelf-section" id="shelf-playlists">
          <div className="shelf-header">
            <h2>Rekomendasi Playlist Populer</h2>
          </div>
          <div className="shelf-row-wrap">
            <div className="shelf-row playlist-shelf-row" id="shelf-row-playlists">
              {curatedPlaylists.map((p) => (
                <PlaylistCard key={p.id} playlist={p} />
              ))}
            </div>
          </div>
        </section>

        {/* Shelf: Tangga Lagu Terpopuler Indonesia */}
        <section className="shelf-section" id="shelf-top_indo">
          <div className="shelf-header">
            <h2>Tangga Lagu Terpopuler Indonesia</h2>
          </div>
          <div className="shelf-row-wrap">
            <div className="shelf-row" id="shelf-row-top_indo">
              {topIndoTracks.map((track) => (
                <TrackCard
                  key={track.id}
                  track={track}
                  queueContext={topIndoTracks}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Shelf: Today's Top Hits Mancanegara */}
        <section className="shelf-section" id="shelf-global_hits">
          <div className="shelf-header">
            <h2>Today&apos;s Top Hits Mancanegara</h2>
          </div>
          <div className="shelf-row-wrap">
            <div className="shelf-row" id="shelf-row-global_hits">
              {globalTracks.map((track) => (
                <TrackCard
                  key={track.id}
                  track={track}
                  queueContext={globalTracks}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Shelf: Santai & Akustik Sore */}
        <section className="shelf-section" id="shelf-chill_vibes">
          <div className="shelf-header">
            <h2>Santai & Akustik Sore</h2>
          </div>
          <div className="shelf-row-wrap">
            <div className="shelf-row" id="shelf-row-chill_vibes">
              {chillTracks.map((track) => (
                <TrackCard
                  key={track.id}
                  track={track}
                  queueContext={chillTracks}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Shelf: Nostalgia Pop Rock Indo */}
        <section className="shelf-section" id="shelf-nostalgia">
          <div className="shelf-header">
            <h2>Nostalgia Pop Rock Indonesia</h2>
          </div>
          <div className="shelf-row-wrap">
            <div className="shelf-row" id="shelf-row-nostalgia">
              {nostalgiaTracks.map((track) => (
                <TrackCard
                  key={track.id}
                  track={track}
                  queueContext={nostalgiaTracks}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Shelf: K-Pop & Asian Hits */}
        <section className="shelf-section" id="shelf-kpop">
          <div className="shelf-header">
            <h2>K-Pop & Asian Super Hits</h2>
          </div>
          <div className="shelf-row-wrap">
            <div className="shelf-row" id="shelf-row-kpop">
              {kpopTracks.map((track) => (
                <TrackCard
                  key={track.id}
                  track={track}
                  queueContext={kpopTracks}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
