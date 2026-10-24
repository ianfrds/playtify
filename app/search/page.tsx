'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAudio } from '@/context/AudioContext';
import { Track } from '@/types';
import TrackRow from '@/components/tracks/TrackRow';
import PlaylistCard from '@/components/playlists/PlaylistCard';
import { CURATED_PLAYLISTS, BROWSE_CATEGORIES, ALL_RECOMMENDATIONS_POOL } from '@/data/recommendations';
import { getArtistAvatar } from '@/data/artists';

interface ArtistResult {
  id: string;
  name: string;
  avatar: string;
  subscribers?: string;
  type?: string;
}

interface AlbumResult {
  id: string;
  title: string;
  artist: string;
  year?: string;
  thumb?: string;
  type?: string;
}

export default function SearchPage() {
  const router = useRouter();
  const { playTrack, curatedPlaylists } = useAudio();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'songs' | 'artists' | 'albums'>('songs');
  const [results, setResults] = useState<Track[]>([]);
  const [artistResults, setArtistResults] = useState<ArtistResult[]>([]);
  const [albumResults, setAlbumResults] = useState<AlbumResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Live YouTube Music Search Suggestions
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/suggestions?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.suggestions || []);
        }
      } catch {
        // ignore
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // Main Search query
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setArtistResults([]);
      setAlbumResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}&filter=${filter}`);
        if (res.ok) {
          const data = await res.json();
          if (filter === 'artists') {
            setArtistResults(data.artists || []);
          } else if (filter === 'albums') {
            setAlbumResults(data.albums || []);
          } else {
            setResults(data.results || []);
          }
        } else {
          // Local fallback for songs
          const q = query.toLowerCase();
          const local = ALL_RECOMMENDATIONS_POOL.filter(
            (t) =>
              t.title.toLowerCase().includes(q) ||
              t.artist.toLowerCase().includes(q)
          );
          setResults(local);
        }
      } catch (err) {
        console.error('Search error:', err);
        const q = query.toLowerCase();
        const local = ALL_RECOMMENDATIONS_POOL.filter(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            t.artist.toLowerCase().includes(q)
        );
        setResults(local);
      } finally {
        setLoading(false);
      }
    }, 320);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [query, filter]);

  const topResult = results.length > 0 ? results[0] : null;
  const topTracks = results.slice(0, 4);
  const remainingTracks = results.slice(4);

  return (
    <section id="view-search" className="view active search-view-page" style={{ display: 'block' }}>
      <div className="view-header">
        <h1>Cari</h1>
      </div>

      <div className="search-bar-wrap">
        <div className="search-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            id="search-input"
            placeholder="Cari lagu, artis, atau album dari YouTube Music..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Cari musik"
            autoComplete="off"
            autoFocus
          />
          {query && (
            <button
              id="btn-search-clear"
              className="icon-btn search-clear-btn"
              onClick={() => {
                setQuery('');
                setSuggestions([]);
              }}
              title="Hapus"
              aria-label="Hapus"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        {/* Live Search Suggestions Pills */}
        {suggestions.length > 0 && (
          <div
            className="search-suggestions-wrap"
            style={{
              display: 'flex',
              gap: 8,
              overflowX: 'auto',
              marginTop: 10,
              paddingBottom: 4,
              scrollbarWidth: 'none',
            }}
          >
            {suggestions.map((sug, i) => (
              <button
                key={i}
                className="search-suggestion-chip"
                onClick={() => {
                  setQuery(sug);
                  setSuggestions([]);
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: 9999,
                  padding: '6px 14px',
                  color: 'var(--text-primary)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <span>{sug}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Spotify Filter Tabs */}
      <div className="filter-pills" style={{ marginTop: 14, marginBottom: 20 }}>
        <button
          className={`pill ${filter === 'songs' ? 'active' : ''}`}
          onClick={() => setFilter('songs')}
        >
          Lagu
        </button>
        <button
          className={`pill ${filter === 'artists' ? 'active' : ''}`}
          onClick={() => setFilter('artists')}
        >
          Artis
        </button>
        <button
          className={`pill ${filter === 'albums' ? 'active' : ''}`}
          onClick={() => setFilter('albums')}
        >
          Album
        </button>
      </div>

      {loading && (
        <div className="loading-state" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 0', gap: 12 }}>
          <div className="spinner" />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Mengambil musik dari YouTube Music...</p>
        </div>
      )}

      {/* Results view: Songs, Artists, or Albums */}
      {query.trim() && !loading && (
        <div className="search-results-container" style={{ marginTop: 18 }}>
          {/* 1. ARTISTS RESULTS */}
          {filter === 'artists' && (
            <div>
              {artistResults.length > 0 ? (
                <div
                  className="artist-results-grid"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
                    gap: 20,
                  }}
                >
                  {artistResults.map((art) => (
                    <div
                      key={art.id || art.name}
                      className="artist-card-item"
                      onClick={() => {
                        const artistParam = art.id || encodeURIComponent(art.name.toLowerCase().trim().replace(/[^a-z0-9]/g, '-'));
                        router.push(`/artist/${artistParam}`);
                      }}
                      style={{
                        background: 'var(--bg-elevated)',
                        borderRadius: 'var(--radius-md)',
                        padding: 18,
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'background 0.2s ease, transform 0.2s ease',
                      }}
                    >
                      <img
                        src={art.avatar || getArtistAvatar(art.name) || '/logo.png'}
                        alt={art.name}
                        loading="lazy"
                        style={{
                          width: 120,
                          height: 120,
                          borderRadius: '50%',
                          objectFit: 'cover',
                          margin: '0 auto 12px',
                          boxShadow: '0 6px 18px rgba(0,0,0,0.5)',
                        }}
                        onError={(e) => {
                          e.currentTarget.src = getArtistAvatar(art.name) || '/logo.png';
                        }}
                      />
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {art.name}
                      </h4>
                      <span className="badge-pill" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--text-muted)', fontSize: '0.72rem', padding: '3px 10px', borderRadius: 9999 }}>
                        Artis
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state" style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
                  <h3>Tidak ada artis ditemukan</h3>
                </div>
              )}
            </div>
          )}

          {/* 2. ALBUMS RESULTS */}
          {filter === 'albums' && (
            <div>
              {albumResults.length > 0 ? (
                <div
                  className="album-results-grid"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                    gap: 20,
                  }}
                >
                  {albumResults.map((alb) => (
                    <div
                      key={alb.id || alb.title}
                      className="album-card-item"
                      style={{
                        background: 'var(--bg-elevated)',
                        borderRadius: 'var(--radius-md)',
                        padding: 16,
                        cursor: 'pointer',
                        transition: 'background 0.2s ease, transform 0.2s ease',
                      }}
                      onClick={() => setQuery(alb.title)}
                    >
                      <img
                        src={alb.thumb || '/logo.png'}
                        alt={alb.title}
                        loading="lazy"
                        style={{
                          width: '100%',
                          aspectRatio: '1 / 1',
                          borderRadius: 8,
                          objectFit: 'cover',
                          marginBottom: 12,
                          boxShadow: '0 6px 18px rgba(0,0,0,0.4)',
                        }}
                        onError={(e) => {
                          e.currentTarget.src = '/logo.png';
                        }}
                      />
                      <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {alb.title}
                      </h4>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        {alb.year ? `${alb.year} • ` : ''}{alb.artist}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state" style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
                  <h3>Tidak ada album ditemukan</h3>
                </div>
              )}
            </div>
          )}

          {/* 3. SONGS RESULTS (Default Spotify Layout) */}
          {filter === 'songs' && (
            <>
              {results.length > 0 && topResult ? (
                <>
                  <div className="spotify-search-top-grid">
                    {/* Left: Hasil Teratas Card */}
                    <div className="spotify-search-top-result-col">
                      <h2 className="spotify-search-heading">Hasil Teratas</h2>
                      <div
                        className="spotify-top-result-card"
                        onClick={() => playTrack(topResult, results)}
                        role="button"
                        tabIndex={0}
                        aria-label={`Putar ${topResult.title} oleh ${topResult.artist}`}
                      >
                        <div className="spotify-top-result-thumb-wrap">
                          <img
                            src={topResult.thumb || topResult.thumbnail || `https://i.ytimg.com/vi/${topResult.id}/hqdefault.jpg`}
                            alt={topResult.title}
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.src = `https://i.ytimg.com/vi/${topResult.id}/hqdefault.jpg`;
                            }}
                          />
                        </div>
                        <h3 className="spotify-top-result-title">{topResult.title}</h3>
                        <div className="spotify-top-result-meta">
                          <span className="badge-pill">Lagu</span>
                          <span
                            className="spotify-top-result-artist clickable-artist"
                            onClick={(e) => {
                              e.stopPropagation();
                              const artistId = topResult.artistId || encodeURIComponent(topResult.artist.toLowerCase().trim().replace(/[^a-z0-9]/g, '-'));
                              router.push(`/artist/${artistId}`);
                            }}
                          >
                            {topResult.artist}
                          </span>
                        </div>
                        <button
                          className="spotify-top-result-play-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            playTrack(topResult, results);
                          }}
                          title={`Putar ${topResult.title}`}
                          aria-label="Putar"
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Right: Lagu (Top 4 tracks) */}
                    <div className="spotify-search-songs-col">
                      <h2 className="spotify-search-heading">Lagu</h2>
                      <div className="track-table-list">
                        {topTracks.map((track, idx) => (
                          <TrackRow
                            key={track.id}
                            track={track}
                            index={idx}
                            queueContext={results}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Remaining Tracks Table */}
                  {remainingTracks.length > 0 && (
                    <div className="spotify-search-more-section" style={{ marginTop: 32 }}>
                      <h2 className="spotify-search-heading" style={{ marginBottom: 14 }}>
                        Semua Lagu Terkait
                      </h2>
                      <div className="track-table-list">
                        {remainingTracks.map((track, idx) => (
                          <TrackRow
                            key={track.id}
                            track={track}
                            index={idx + 4}
                            queueContext={results}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="empty-state" style={{ textAlign: 'center', padding: '64px 20px', color: 'var(--text-muted)' }}>
                  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.6, marginBottom: 12 }}>
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <h3 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: 6 }}>Tidak ada hasil untuk &quot;{query}&quot;</h3>
                  <p style={{ fontSize: '0.9rem' }}>Coba periksa ejaan judul lagu atau gunakan nama artis lain.</p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Idle view: Kategori Musik + Rekomendasi Playlist */}
      {!query.trim() && (
        <div id="search-recommendations" className="search-recommendations" style={{ marginTop: 28 }}>
          {/* Section 1: Browse Category Boxes */}
          <div className="search-section" style={{ marginBottom: 36 }}>
            <h2 className="search-section-title" style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: 16 }}>
              Jelajahi Semua Kategori
            </h2>
            <div className="browse-grid">
              {BROWSE_CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  className="browse-card"
                  onClick={() => setQuery(cat.query)}
                  style={{
                    background: cat.gradient || cat.color,
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Kategori ${cat.name}`}
                >
                  <span className="browse-card-title">
                    {cat.name}
                  </span>
                  <img
                    src={cat.thumb}
                    alt={cat.name}
                    className="browse-card-thumb"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = '/logo.png';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Rekomendasi Playlist Populer */}
          <div className="search-section">
            <div className="shelf-header">
              <h2>Playlist Pilihan untuk Kamu</h2>
            </div>
            <div className="shelf-grid">
              {curatedPlaylists.map((pl) => (
                <PlaylistCard key={pl.id} playlist={pl} />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
