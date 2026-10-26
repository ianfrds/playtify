'use client';

import React, { useState, useEffect } from 'react';
import { useAudio } from '@/context/AudioContext';
import { useRouter } from 'next/navigation';
import { getArtistData } from '@/data/artists';
import { getLyricsForTrack } from '@/data/lyrics';

export function NowPlayingSidebar() {
  const {
    isNowPlayingSidebarOpen,
    toggleNowPlayingSidebar,
    toggleLyricsSidebar,
    openFullscreenLyrics,
    currentTrack,
    currentTime,
    isLiked,
    toggleLike,
    queue,
    queueIndex,
    followedArtists,
    toggleFollowArtist,
    showToast,
  } = useAudio();

  const router = useRouter();
  const [lyricsData, setLyricsData] = useState<any>(null);
  const [showMenu, setShowMenu] = useState(false);

  // Fetch real-time synced lyrics for the preview card
  useEffect(() => {
    if (!currentTrack) return;
    const staticL = getLyricsForTrack(currentTrack.id, currentTrack.title, currentTrack.artist);
    setLyricsData(staticL);

    let cancelled = false;
    const fetchLive = async () => {
      try {
        const query = new URLSearchParams({
          title: currentTrack.title,
          artist: currentTrack.artist,
          id: currentTrack.id,
          duration: (currentTrack.duration || 210).toString(),
        });
        const res = await fetch(`/api/lyrics?${query.toString()}`);
        if (res.ok && !cancelled) {
          const data = await res.json();
          if (data && data.lines && data.lines.length > 0) {
            setLyricsData(data);
          }
        }
      } catch {
        // ignore
      }
    };
    fetchLive();

    return () => {
      cancelled = true;
    };
  }, [currentTrack]);

  if (!currentTrack) {
    return (
      <aside
        className={`now-playing-sidebar ${isNowPlayingSidebarOpen ? 'open' : ''}`}
        aria-label="Sedang Diputar"
      >
        <div className="now-playing-sidebar-header">
          <div className="now-playing-sidebar-context">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="15" y1="3" x2="15" y2="21" />
            </svg>
            <span className="sidebar-context-text">Sedang Diputar</span>
          </div>
          <button
            className="icon-btn small"
            onClick={() => toggleNowPlayingSidebar(false)}
            title="Tutup"
            aria-label="Tutup panel"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="now-playing-sidebar-empty">
          <p>Belum ada lagu yang diputar</p>
        </div>
      </aside>
    );
  }

  const thumbUrl = currentTrack.thumbnail || currentTrack.thumb || '/logo.png';
  const liked = isLiked(currentTrack.id);
  const contextName = `${currentTrack.artist} – ${currentTrack.album || currentTrack.badge || 'Popular Songs'}`;

  // Find active line in synced lyrics
  const activeLineIdx = (lyricsData?.lines || []).reduce((acc: number, line: any, idx: number) => {
    return line.time <= currentTime ? idx : acc;
  }, 0);

  const previewLines = (lyricsData?.lines || []).slice(activeLineIdx, activeLineIdx + 3);

  const artistLookup = currentTrack.artist && !currentTrack.artist.startsWith('UC')
    ? currentTrack.artist
    : currentTrack.artistId || 'bernadya';
  const artistData = getArtistData(artistLookup, currentTrack);
  const isFollowing = followedArtists.some(
    (a) => a.toLowerCase() === artistData.name.toLowerCase()
  );

  const nextTrack = queue[queueIndex + 1];

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/now-playing`);
      showToast('Tautan lagu disalin ke papan klip!');
    }
  };

  const handleArtistClick = () => {
    const slug = encodeURIComponent(
      (currentTrack.artist || 'artis').toLowerCase().trim().replace(/[^a-z0-9]/g, '-')
    );
    router.push(`/artist/${slug}`);
  };

  return (
    <aside
      className={`now-playing-sidebar ${isNowPlayingSidebarOpen ? 'open' : ''}`}
      aria-label="Sedang Diputar"
    >
      {/* ─── Header: [>|] Context Name ••• ⤢ ─── */}
      <div className="now-playing-sidebar-header">
        <div className="now-playing-sidebar-context" title={contextName}>
          <button
            className="icon-btn-minimal"
            onClick={() => toggleNowPlayingSidebar(false)}
            title="Tutup panel samping"
            aria-label="Tutup panel samping"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="15" y1="3" x2="15" y2="21" />
            </svg>
          </button>
          <span className="sidebar-context-text">{contextName}</span>
        </div>

        <div className="now-playing-sidebar-header-actions">
          {/* Menu Dropdown Button */}
          <div style={{ position: 'relative' }}>
            <button
              className="icon-btn-minimal"
              onClick={() => setShowMenu(!showMenu)}
              title="Lainnya"
              aria-label="Menu opsi lainnya"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="5" cy="12" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="19" cy="12" r="2" />
              </svg>
            </button>

            {showMenu && (
              <div
                className="now-playing-popover-menu"
                onClick={() => setShowMenu(false)}
              >
                <button onClick={handleShare}>
                  <span>Bagikan Lagu</span>
                </button>
                <button onClick={handleArtistClick}>
                  <span>Buka Profil Artis</span>
                </button>
                <button onClick={() => router.push('/now-playing')}>
                  <span>Buka Tampilan Penuh</span>
                </button>
              </div>
            )}
          </div>

          {/* Fullscreen Lyrics Button (Microphone Icon) */}
          <button
            className="icon-btn-minimal"
            onClick={() => openFullscreenLyrics()}
            title="Layar penuh lirik"
            aria-label="Layar penuh lirik"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zm5.3 7.7a1 1 0 0 0-2 .2c0 2.9-2.4 5.3-5.3 5.3s-5.3-2.4-5.3-5.3a1 1 0 1 0-2-.2C3 13.5 5.9 17 9.8 17.2V20H7a1 1 0 0 0 0 2h10a1 1 0 0 0 0-2h-2.8v-2.8c3.9-.2 6.8-3.7 3.1-7.5z" />
            </svg>
          </button>
        </div>
      </div>

      {/* ─── Scrollable Body (Matching Screenshot) ─── */}
      <div className="now-playing-sidebar-body">
        {/* 1. Large Square Artwork */}
        <div className="now-playing-sidebar-art-wrap">
          <img
            src={thumbUrl}
            alt={currentTrack.title}
            className="now-playing-sidebar-art"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/logo.png';
            }}
          />
        </div>

        {/* 2. Track Title, Artist, & Actions Row */}
        <div className="now-playing-sidebar-meta-row">
          <div className="now-playing-sidebar-titles">
            <h2 className="now-playing-sidebar-track-title" title={currentTrack.title}>
              {currentTrack.title}
            </h2>
            <p className="now-playing-sidebar-artist" onClick={handleArtistClick}>
              {currentTrack.artist}
            </p>
          </div>

          <div className="now-playing-sidebar-actions">
            {/* Share Button [↑] */}
            <button
              className="icon-btn-minimal action-icon"
              onClick={handleShare}
              title="Bagikan"
              aria-label="Bagikan lagu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
            </button>

            {/* Add / Like Button (+) */}
            <button
              className={`icon-btn-minimal action-icon ${liked ? 'is-liked' : ''}`}
              onClick={() => toggleLike(currentTrack)}
              title={liked ? 'Hapus dari Disukai' : 'Simpan ke Disukai'}
              aria-label={liked ? 'Hapus dari Disukai' : 'Simpan ke Disukai'}
            >
              {liked ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#1ed760">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* 3. Pratinjau lirik Card (Matches Screenshot Exactly) */}
        <div
          className="now-playing-sidebar-lyrics-card"
          style={{
            background: lyricsData?.themeColor || '#431219',
          }}
          onClick={() => toggleLyricsSidebar(true)}
          role="button"
          tabIndex={0}
          title="Klik untuk membuka lirik lengkap"
        >
          <div className="lyrics-card-top">
            <span className="lyrics-card-badge">Pratinjau lirik</span>
            <span className="lyrics-card-expand-hint">Buka lirik &gt;</span>
          </div>

          <div className="lyrics-card-lines">
            {previewLines.length > 0 ? (
              previewLines.map((l: any, i: number) => (
                <p
                  key={i}
                  className={`lyrics-card-line ${i === 0 ? 'active' : i === 1 ? 'next-1' : 'next-2'}`}
                >
                  {l.text}
                </p>
              ))
            ) : (
              <>
                <p className="lyrics-card-line active">♪ {currentTrack.title} ♪</p>
                <p className="lyrics-card-line next-1">{currentTrack.artist}</p>
                <p className="lyrics-card-line next-2">Memuat lirik...</p>
              </>
            )}
          </div>
        </div>

        {/* 4. About the Artist Card (Spotify Desktop Standard) */}
        <div className="now-playing-sidebar-artist-card" onClick={handleArtistClick}>
          <div
            className="artist-card-cover"
            style={{ backgroundImage: `url(${artistData.avatar || thumbUrl})` }}
          >
            <div className="artist-card-cover-overlay" />
            <span className="artist-card-header-label">Tentang artis</span>
          </div>

          <div className="artist-card-content">
            <div className="artist-card-info-row">
              <div>
                <h3 className="artist-card-name">{artistData.name}</h3>
                <p className="artist-card-stats">
                  {artistData.monthlyListeners} pendengar bulanan
                </p>
              </div>
              <button
                className={`artist-card-follow-btn ${isFollowing ? 'following' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFollowArtist(artistData.name);
                }}
              >
                {isFollowing ? 'Mengikuti' : 'Ikuti'}
              </button>
            </div>
            <p className="artist-card-bio-snippet">{artistData.bio}</p>
          </div>
        </div>

        {/* 5. Next in Queue Preview Card (if available) */}
        {nextTrack && (
          <div
            className="now-playing-sidebar-next-card"
            onClick={() => router.push('/queue')}
          >
            <div className="next-card-header">
              <span>Berikutnya di antrean</span>
              <span className="next-card-link">Buka antrean &gt;</span>
            </div>
            <div className="next-card-item">
              <img
                src={nextTrack.thumbnail || nextTrack.thumb || '/logo.png'}
                alt={nextTrack.title}
                className="next-card-thumb"
              />
              <div className="next-card-meta">
                <p className="next-card-title">{nextTrack.title}</p>
                <p className="next-card-artist">{nextTrack.artist}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

export default NowPlayingSidebar;
