'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAudio } from '@/context/AudioContext';
import TrackCard from '@/components/tracks/TrackCard';
import PlaylistCard from '@/components/playlists/PlaylistCard';
import { CURATED_PLAYLISTS, RECOMMENDATIONS_DATA } from '@/data/recommendations';

export default function HomePage() {
  const router = useRouter();
  const {
    recommendations,
    refreshRecommendations,
    playTrack,
    currentTrack,
    isPlaying,
    brandName,
    toggleLike,
    isLiked,
    user,
    openAuthModal,
  } = useAudio();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return 'Selamat pagi';
    if (hour < 15) return 'Selamat siang';
    if (hour < 19) return 'Selamat sore';
    return 'Selamat malam';
  };

  const handleManualRefresh = async () => {
    try {
      setIsRefreshing(true);
      await refreshRecommendations();
    } finally {
      setIsRefreshing(false);
    }
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
    { name: 'Top Hits Indonesia', key: 'top_indo', tracks: RECOMMENDATIONS_DATA.top_indo },
    { name: "Today's Top Hits Dunia", key: 'global_hits', tracks: RECOMMENDATIONS_DATA.global_hits },
    { name: 'Santai & Akustik Sore', key: 'chill_vibes', tracks: RECOMMENDATIONS_DATA.chill_vibes },
    { name: 'Lofi Beats & Fokus', key: 'lofi', tracks: RECOMMENDATIONS_DATA.lofi },
    { name: 'K-Pop Terpopuler', key: 'kpop', tracks: RECOMMENDATIONS_DATA.kpop },
    { name: 'Nostalgia Pop Rock', key: 'nostalgia', tracks: RECOMMENDATIONS_DATA.nostalgia },
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
                openAuthModal('Masuk ke Playtify', 'Nikmati playlist tanpa batas dan sinkronkan lagu favoritmu.');
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
              {user ? (user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0]) : 'Tamu Playtify'}
            </p>
          </div>
        </div>
        <div className="mobile-top-actions">
          <button
            className="mobile-notification-pill"
            onClick={handleManualRefresh}
            title="Update Rekomendasi"
            aria-label="Update Rekomendasi"
          >
            <span className="mobile-pill-badge">{recommendations.length}</span>
            <svg
              className={isRefreshing ? 'spin' : ''}
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
          </button>
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
        </div>
      </div>

      {/* ─── Mobile Hero Headline (Screen 1 style) ─── */}
      <div className="mobile-hero-wrap">
        <h1 className="mobile-hero-title">SoundGroove Your Music, Anytime</h1>
      </div>

      {/* ─── Top Greeting & Search Header (Desktop) ─── */}
      <div className="home-top-bar">
        <div className="home-greeting-wrap">
          <h1 id="home-greeting">{getGreeting()}</h1>
          <p className="subtitle" id="home-greeting-sub">
            Rekomendasi musik pilihan dari YouTube khusus untukmu (Auto-update tiap 30 menit)
          </p>
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
                src={featuredTrack.thumbnail || featuredTrack.thumb}
                alt={featuredTrack.title}
                loading="lazy"
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
          return (
            <div
              key={m.key}
              className={`quick-mix-card ${isThisPlaying ? 'playing' : ''}`}
              onClick={() => leadTrack && playTrack(leadTrack, m.tracks)}
              role="button"
              tabIndex={0}
            >
              <div className="quick-mix-thumb">
                <img
                  src={leadTrack?.thumbnail || leadTrack?.thumb}
                  alt={m.name}
                  loading="lazy"
                />
              </div>
              <span className="quick-mix-title">{m.name}</span>
              <button
                className="quick-mix-play"
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
        {/* Shelf: Rekomendasi Playlist Populer */}
        <section className="shelf-section" id="shelf-playlists">
          <div className="shelf-header">
            <div>
              <h2>Rekomendasi Playlist Populer</h2>
              <p className="subtitle">Kumpulan playlist pilihan Spotify-style dengan daftar lagu lengkap</p>
            </div>
            <div className="shelf-nav-actions">
              <button
                className={`btn-pill-play ${isRefreshing ? 'loading' : ''}`}
                onClick={handleManualRefresh}
                title="Update rekomendasi dari YouTube sekarang"
              >
                <svg
                  className={isRefreshing ? 'spin' : ''}
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="23 4 23 10 17 10" />
                  <polyline points="1 20 1 14 7 14" />
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                </svg>
                <span>{isRefreshing ? 'Memperbarui...' : 'Update Rekomendasi'}</span>
              </button>
            </div>
          </div>
          <div className="shelf-row-wrap">
            <div className="shelf-row playlist-shelf-row" id="shelf-row-playlists">
              {CURATED_PLAYLISTS.map((p) => (
                <PlaylistCard key={p.id} playlist={p} />
              ))}
            </div>
          </div>
        </section>

        {/* Shelf: Tangga Lagu Terpopuler Indonesia */}
        <section className="shelf-section" id="shelf-top_indo">
          <div className="shelf-header">
            <div>
              <h2>Tangga Lagu Terpopuler Indonesia</h2>
              <p className="subtitle">Lagu-lagu yang paling banyak didengar dan hits di Indonesia</p>
            </div>
            <div className="shelf-nav-actions">
              <button
                className="btn-pill-play shelf-play-all"
                onClick={() => {
                  const list = topIndoTracks.length > 0 ? topIndoTracks : recommendations.slice(0, 8);
                  if (list.length > 0) playTrack(list[0], list);
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Putar Semua
              </button>
            </div>
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
            <div>
              <h2>Today&apos;s Top Hits Mancanegara</h2>
              <p className="subtitle">Deretan hits internasional paling populer di dunia saat ini</p>
            </div>
            <div className="shelf-nav-actions">
              <button
                className="btn-pill-play shelf-play-all"
                onClick={() => {
                  if (globalTracks.length > 0) playTrack(globalTracks[0], globalTracks);
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Putar Semua
              </button>
            </div>
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
            <div>
              <h2>Santai & Akustik Sore</h2>
              <p className="subtitle">Lagu indie dan akustik syahdu menemani waktu rehat</p>
            </div>
            <div className="shelf-nav-actions">
              <button
                className="btn-pill-play shelf-play-all"
                onClick={() => {
                  if (chillTracks.length > 0) playTrack(chillTracks[0], chillTracks);
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Putar Semua
              </button>
            </div>
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
            <div>
              <h2>Nostalgia Pop Rock Indonesia</h2>
              <p className="subtitle">Karya legendaris Sheila On 7, Dewa 19, Peterpan, dan Padi</p>
            </div>
            <div className="shelf-nav-actions">
              <button
                className="btn-pill-play shelf-play-all"
                onClick={() => {
                  if (nostalgiaTracks.length > 0) playTrack(nostalgiaTracks[0], nostalgiaTracks);
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Putar Semua
              </button>
            </div>
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
            <div>
              <h2>K-Pop & Asian Super Hits</h2>
              <p className="subtitle">Hits paling bertenaga dari NewJeans, BTS, BLACKPINK, dan YOASOBI</p>
            </div>
            <div className="shelf-nav-actions">
              <button
                className="btn-pill-play shelf-play-all"
                onClick={() => {
                  if (kpopTracks.length > 0) playTrack(kpopTracks[0], kpopTracks);
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Putar Semua
              </button>
            </div>
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
