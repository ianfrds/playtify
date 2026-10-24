'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAudio } from '@/context/AudioContext';
import { Track } from '@/types';
import TrackRow from '@/components/tracks/TrackRow';
import PlaylistCard from '@/components/playlists/PlaylistCard';
import { CURATED_PLAYLISTS, BROWSE_CATEGORIES, ALL_RECOMMENDATIONS_POOL } from '@/data/recommendations';

export default function SearchPage() {
  const router = useRouter();
  const { recommendations, playTrack } = useAudio();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
        } else {
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
  }, [query]);

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
            placeholder="Cari lagu, artis, atau album dari YouTube..."
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
              onClick={() => setQuery('')}
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
      </div>

      {loading && (
        <div className="loading-state" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 0', gap: 12 }}>
          <div className="spinner" />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Mencari musik dari YouTube...</p>
        </div>
      )}

      {/* Results view: Spotify layout */}
      {query.trim() && !loading && (
        <div className="search-results-container" style={{ marginTop: 24 }}>
          {results.length > 0 && topResult ? (
            <>
              {/* Split row: Hasil Teratas (Left) + Lagu (Right) */}
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
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=160&h=160&fit=crop';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Rekomendasi Playlist Populer */}
          <div className="search-section">
            <div className="shelf-header">
              <div>
                <h2>Playlist Pilihan untuk Kamu</h2>
                <p className="subtitle">Dengarkan koleksi terbaik sesuai suasana hatimu</p>
              </div>
            </div>
            <div className="shelf-grid">
              {CURATED_PLAYLISTS.map((pl) => (
                <PlaylistCard key={pl.id} playlist={pl} />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
