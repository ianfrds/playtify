'use client';

import { useAudio } from '@/context/AudioContext';
import { useRouter } from 'next/navigation';

export function QueueSidebar() {
  const { isQueueSidebarOpen, toggleQueueSidebar, currentTrack, queue, playTrack, clearQueue } = useAudio();
  const router = useRouter();

  const handleArtistClick = (e: React.MouseEvent, artist: string) => {
    e.stopPropagation();
    toggleQueueSidebar(false);
    router.push(`/artist/${encodeURIComponent(artist.toLowerCase().trim())}`);
  };

  const formatTime = (secs: number) => {
    if (!secs || isNaN(secs) || secs <= 0) return '3:20';
    const safeSecs = Math.max(0, Math.floor(secs));
    const m = Math.floor(safeSecs / 60);
    const s = Math.floor(safeSecs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <aside className={`queue-sidebar ${isQueueSidebarOpen ? 'open' : ''}`} aria-label="Antrian Lagu">
      <div className="queue-sidebar-header">
        <div className="queue-sidebar-title-wrap">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <circle cx="3.5" cy="6" r="1.5" />
            <circle cx="3.5" cy="12" r="1.5" />
            <circle cx="3.5" cy="18" r="1.5" />
          </svg>
          <h3>Antrean</h3>
          <span className="queue-sidebar-count">{queue.length} lagu</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {queue.length > 0 && (
            <button
              className="btn-text small"
              onClick={clearQueue}
              title="Kosongkan antrean"
              style={{ fontSize: '0.74rem', color: 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              Hapus
            </button>
          )}
          <button className="icon-btn small" onClick={() => toggleQueueSidebar(false)} title="Tutup">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      <div className="queue-sidebar-body">
        {currentTrack && (
          <div className="sidebar-queue-section">
            <span className="sidebar-section-label">SEDANG DIPUTAR</span>
            <div className="sidebar-track-item current">
              <div className="sidebar-track-thumb">
                <img
                  src={currentTrack.thumbnail || currentTrack.thumb || '/logo.png'}
                  alt={currentTrack.title}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/logo.png';
                  }}
                />
              </div>
              <div className="sidebar-track-meta">
                <p className="sidebar-track-title">{currentTrack.title}</p>
                <p className="sidebar-track-artist clickable-artist" onClick={(e) => handleArtistClick(e, currentTrack.artist)}>
                  {currentTrack.artist}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="sidebar-queue-section">
          <span className="sidebar-section-label">BERIKUTNYA</span>
          {queue.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', padding: '12px 0' }}>Antrian kosong</p>
          ) : (
            <div className="sidebar-queue-list">
              {queue.map((track, idx) => (
                <div
                  key={`${track.id}-${idx}`}
                  className="sidebar-track-item"
                  onClick={() => playTrack(track, queue.filter((_, i) => i !== idx))}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="sidebar-track-thumb">
                    <img
                      src={track.thumbnail || track.thumb || '/logo.png'}
                      alt={track.title}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/logo.png';
                      }}
                    />
                  </div>
                  <div className="sidebar-track-meta">
                    <p className="sidebar-track-title">{track.title}</p>
                    <p className="sidebar-track-artist clickable-artist" onClick={(e) => handleArtistClick(e, track.artist)}>
                      {track.artist}
                    </p>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                    {formatTime(track.duration)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

export default QueueSidebar;
