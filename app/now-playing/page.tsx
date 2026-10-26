'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAudio } from '@/context/AudioContext';
import { getArtistData } from '@/data/artists';
import { getLyricsForTrack } from '@/data/lyrics';
import TrackRow from '@/components/tracks/TrackRow';
import SpotifyLyrics from '@/components/lyrics/SpotifyLyrics';

const DEFAULT_COVER = '/logo.png';

export default function WebNowPlayingPage() {
  const router = useRouter();
  const progressBarRef = useRef<HTMLDivElement>(null);
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    playNext,
    playPrev,
    currentTime,
    duration,
    seekTo,
    isShuffle,
    toggleShuffle,
    repeatMode,
    toggleRepeat,
    isLiked,
    toggleLike,
    queue,
    queueIndex,
    openFullscreenLyrics,
    toggleLyricsModal,
    showToast,
  } = useAudio();

  const [showMenu, setShowMenu] = useState(false);
  const [lyricsData, setLyricsData] = useState<any>(null);

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
      <section className="view active now-playing-web-view" style={{ display: 'block', textAlign: 'center', padding: '100px 32px' }}>
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--text-muted)' }}>
            <path d="M12 3v9.28c-.47-.17-.97-.28-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z" />
          </svg>
          <h2 style={{ fontSize: '1.5rem', marginTop: 16 }}>Belum Ada Lagu Diputar</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>
            Pilih lagu dari Beranda atau Cari lagu favoritmu untuk mendengarkan.
          </p>
          <button
            className="btn-primary-round"
            style={{ margin: '24px auto 0', width: 56, height: 56 }}
            onClick={() => router.push('/')}
            title="Buka Beranda"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>
      </section>
    );
  }

  const formatTime = (secs: number) => {
    if (!secs || isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;
  const liked = isLiked(currentTrack.id);
  const artistLookup = currentTrack.artist && !currentTrack.artist.startsWith('UC')
    ? currentTrack.artist
    : currentTrack.artistId || 'bernadya';
  const artistData = getArtistData(artistLookup, currentTrack);
  const upcomingQueue = queue.slice(queueIndex + 1, queueIndex + 6);
  const thumbUrl = currentTrack.thumbnail || currentTrack.thumb || DEFAULT_COVER;

  // Active line for preview card
  const activeLineIdx = (lyricsData?.lines || []).reduce((acc: number, line: any, idx: number) => {
    return line.time <= currentTime ? idx : acc;
  }, 0);
  const previewLines = (lyricsData?.lines || []).slice(activeLineIdx, activeLineIdx + 3);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration || !progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    seekTo(pct * duration);
  };

  const handleArtistClick = () => {
    const slug = encodeURIComponent(
      (currentTrack.artist || 'artis').toLowerCase().trim().replace(/[^a-z0-9]/g, '-')
    );
    router.push(`/artist/${slug}`);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Tautan lagu disalin ke papan klip!');
    }
  };

  const contextTitle = currentTrack.album || currentTrack.badge || 'Popular Songs';

  return (
    <section id="view-now-playing" className="view active now-playing-web-view" style={{ display: 'block' }}>
      {/* ─── Ambient Backdrop Glow ─── */}
      <div
        className="now-playing-ambient-backdrop"
        style={{ backgroundImage: `url(${thumbUrl})` }}
        aria-hidden="true"
      />

      {/* ─── Top Spotify-Style Header (Matches Screenshot) ─── */}
      <div className="now-playing-page-topbar">
        <button
          className="now-playing-topbar-btn"
          onClick={() => router.back()}
          title="Kembali"
          aria-label="Kembali"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className="now-playing-context-center" title={`${currentTrack.artist} – ${contextTitle}`}>
          <span className="now-playing-context-title">
            {currentTrack.artist} – {contextTitle}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {/* Menu Dropdown ••• */}
          <div style={{ position: 'relative' }}>
            <button
              className="now-playing-topbar-btn"
              onClick={() => setShowMenu(!showMenu)}
              title="Lainnya"
              aria-label="Menu opsi lainnya"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="5" cy="12" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="19" cy="12" r="2" />
              </svg>
            </button>

            {showMenu && (
              <div
                className="now-playing-popover-menu"
                style={{ top: '100%', right: 0 }}
                onClick={() => setShowMenu(false)}
              >
                <button onClick={handleShare}>
                  <span>Bagikan Lagu</span>
                </button>
                <button onClick={handleArtistClick}>
                  <span>Buka Profil Artis</span>
                </button>
                <button onClick={() => router.push('/queue')}>
                  <span>Buka Antrean Lagu</span>
                </button>
              </div>
            )}
          </div>

          {/* Lyrics Button (Microphone Icon) */}
          <button
            className="now-playing-topbar-btn"
            onClick={() => openFullscreenLyrics()}
            title="Lirik Lagu (Sinkron)"
            aria-label="Lirik Lagu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zm5.3 7.7a1 1 0 0 0-2 .2c0 2.9-2.4 5.3-5.3 5.3s-5.3-2.4-5.3-5.3a1 1 0 1 0-2-.2C3 13.5 5.9 17 9.8 17.2V20H7a1 1 0 0 0 0 2h10a1 1 0 0 0 0-2h-2.8v-2.8c3.9-.2 6.8-3.7 3.1-7.5z" />
            </svg>
          </button>

          {/* Queue Button */}
          <button
            className="now-playing-topbar-btn"
            onClick={() => router.push('/queue')}
            title="Buka Antrean Lagu"
            aria-label="Buka Antrean Lagu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <circle cx="3.5" cy="6" r="1.5" />
              <circle cx="3.5" cy="12" r="1.5" />
              <circle cx="3.5" cy="18" r="1.5" />
            </svg>
            {queue.length > 0 && <span className="now-playing-queue-dot" />}
          </button>
        </div>
      </div>

      {/* ─── Main Content Layout ─── */}
      <div className="now-playing-web-layout">
        {/* ─── Left Hero Column: Artwork, Titles, Actions, Scrubber, Controls ─── */}
        <div className="now-playing-hero-card">
          {/* Square Artwork */}
          <div className="now-playing-artwork-stage">
            <div
              className="now-playing-artwork-glow"
              style={{ backgroundImage: `url(${thumbUrl})` }}
              aria-hidden="true"
            />
            <div className="now-playing-artwork-box">
              <img
                src={thumbUrl}
                alt={currentTrack.title}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = DEFAULT_COVER;
                }}
              />
            </div>
          </div>

          {/* Track Title, Artist, Share [↑] & Like/Add (+) Row (Matches Screenshot) */}
          <div className="now-playing-meta-row">
            <div className="now-playing-meta-info">
              <h1 id="web-np-title" className="now-playing-hero-title">
                {currentTrack.title}
              </h1>
              <div className="now-playing-artist-wrapper">
                <button
                  id="web-np-artist"
                  className="now-playing-artist-link"
                  onClick={handleArtistClick}
                  title="Lihat Profil Artis"
                >
                  <span>{currentTrack.artist}</span>
                </button>
              </div>
            </div>

            {/* Right Action Icons: Share [↑] and Add/Like (+) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <button
                className="now-playing-action-icon-btn"
                onClick={handleShare}
                title="Bagikan"
                aria-label="Bagikan lagu"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" y1="2" x2="12" y2="15" />
                </svg>
              </button>

              <button
                className={`now-playing-action-icon-btn ${liked ? 'is-liked' : ''}`}
                onClick={() => toggleLike(currentTrack)}
                title={liked ? 'Hapus dari Disukai' : 'Simpan ke Disukai'}
                aria-label={liked ? 'Hapus dari Disukai' : 'Simpan ke Disukai'}
              >
                {liked ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#1ed760">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Interactive Progress Scrubber */}
          <div className="now-playing-scrubber-section">
            <div
              className="now-playing-progress-track"
              ref={progressBarRef}
              onClick={handleSeek}
              role="slider"
              aria-label="Posisi pemutaran musik"
              tabIndex={0}
            >
              <div className="now-playing-progress-filled" style={{ width: `${progressPct}%` }} />
              <div className="now-playing-progress-thumb" style={{ left: `${progressPct}%` }} />
            </div>
            <div className="now-playing-time-row">
              <span className="time-stamp">{formatTime(currentTime)}</span>
              <span className="time-stamp">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Playback Controls Row */}
          <div className="now-playing-controls-row">
            <button
              className={`np-ctrl-btn ${isShuffle ? 'active' : ''}`}
              onClick={toggleShuffle}
              title="Acak Lagu"
              aria-label="Acak Lagu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="16,3 21,3 21,8" />
                <line x1="4" y1="20" x2="21" y2="3" />
                <polyline points="21,16 21,21 16,21" />
                <line x1="15" y1="15" x2="21" y2="21" />
                <line x1="4" y1="4" x2="9" y2="9" />
              </svg>
            </button>

            <button
              className="np-ctrl-btn np-prev-btn"
              onClick={playPrev}
              title="Lagu Sebelumnya"
              aria-label="Lagu Sebelumnya"
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
              </svg>
            </button>

            <button
              className="np-main-play-btn"
              onClick={togglePlay}
              title={isPlaying ? 'Jeda' : 'Putar'}
              aria-label={isPlaying ? 'Jeda' : 'Putar'}
            >
              {isPlaying ? (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
                </svg>
              ) : (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: 3 }}>
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <button
              className="np-ctrl-btn np-next-btn"
              onClick={playNext}
              title="Lagu Berikutnya"
              aria-label="Lagu Berikutnya"
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 6h2v12h-2zm-10 0l8.5 6L6 18z" />
              </svg>
            </button>

            <button
              className={`np-ctrl-btn ${repeatMode !== 'off' ? 'active' : ''}`}
              onClick={toggleRepeat}
              title={`Ulangi (${repeatMode})`}
              aria-label={`Ulangi (${repeatMode})`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="17 1 21 5 17 9" />
                <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                <polyline points="7 23 3 19 7 15" />
                <path d="M21 13v2a4 4 0 0 1-4 4H3" />
              </svg>
              {repeatMode === 'one' && <span className="np-repeat-one-badge">1</span>}
            </button>
          </div>

          {/* Pratinjau lirik Card (Especially on mobile, or when scrolling down) */}
          <div
            className="now-playing-sidebar-lyrics-card"
            style={{
              background: lyricsData?.themeColor || '#4a1118',
              marginTop: 18,
            }}
            onClick={() => openFullscreenLyrics()}
            role="button"
            tabIndex={0}
            title="Klik untuk membuka lirik layar penuh"
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
        </div>

        {/* ─── Right Column: Real-time Synced Karaoke & Artist Info (Desktop) ─── */}
        <div className="now-playing-side-column">
          {/* Card 1: Spotify Realtime Synced Lyrics */}
          <div className="now-playing-lyrics-container">
            <SpotifyLyrics
              track={currentTrack}
              currentTime={currentTime}
              duration={duration}
              onSeek={seekTo}
              mode="embedded"
              onExpand={() => openFullscreenLyrics()}
            />
          </div>

          {/* Card 2: Tentang Artis Card */}
          <div
            className="now-playing-side-card artist-card"
            onClick={handleArtistClick}
            role="button"
            tabIndex={0}
          >
            <div className="side-card-badge">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>TENTANG ARTIS</span>
            </div>
            <div className="artist-preview-row">
              <img
                src={artistData.avatar}
                alt={artistData.name}
                className="artist-preview-avatar"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = DEFAULT_COVER;
                }}
              />
              <div className="artist-preview-info">
                <h4 className="artist-preview-name">{artistData.name}</h4>
                <p className="artist-preview-listeners">
                  {artistData.monthlyListeners} pendengar bulanan
                </p>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--text-muted)' }}>
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </div>

          {/* Card 3: Berikutnya dalam Antrean */}
          {upcomingQueue.length > 0 && (
            <div className="now-playing-side-card queue-card">
              <div className="side-card-header-row">
                <div className="side-card-badge">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="8" y1="6" x2="21" y2="6" />
                    <line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" />
                    <circle cx="3.5" cy="6" r="1.5" />
                    <circle cx="3.5" cy="12" r="1.5" />
                    <circle cx="3.5" cy="18" r="1.5" />
                  </svg>
                  <span>BERIKUTNYA DALAM ANTREAN</span>
                </div>
                <button
                  className="side-card-link-btn"
                  onClick={() => router.push('/queue')}
                  title="Lihat semua antrean"
                >
                  Buka Antrean
                </button>
              </div>
              <div className="now-playing-queue-list">
                {upcomingQueue.map((track, idx) => (
                  <TrackRow
                    key={`${track.id}-${idx}`}
                    track={track}
                    index={idx}
                    queueContext={queue}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
