'use client';

import { useAudio } from '@/context/AudioContext';
import { RECOMMENDATIONS_DATA } from '@/data/recommendations';

export function RecDrawer() {
  const { isRecDrawerOpen, toggleRecDrawer, currentTrack, playTrack } = useAudio();

  if (!isRecDrawerOpen) return null;

  const pool = RECOMMENDATIONS_DATA.top_indo || [];
  const tracks = pool.filter((t) => t.id !== currentTrack?.id).slice(0, 6);

  return (
    <div className="player-rec-drawer" style={{ display: 'block' }}>
      <div className="rec-drawer-header">
        <div className="rec-drawer-title-wrap">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
          </svg>
          <h3>Rekomendasi Cepat</h3>
        </div>
        <button className="icon-btn small" onClick={() => toggleRecDrawer(false)} title="Tutup">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <p className="rec-drawer-subtitle">
        {currentTrack ? `Berdasarkan "${currentTrack.title}"` : 'Pilihan musik populer hari ini'}
      </p>
      <div className="rec-drawer-list">
        {tracks.map((t) => (
          <div
            key={t.id}
            className="rec-drawer-item"
            onClick={() => {
              playTrack(t);
              toggleRecDrawer(false);
            }}
          >
            <div className="rec-drawer-thumb">
              <img src={t.thumb} alt={t.title} />
            </div>
            <div className="rec-drawer-meta">
              <p className="rec-drawer-title">{t.title}</p>
              <p className="rec-drawer-artist">{t.artist}</p>
            </div>
            <button className="btn-text small" style={{ color: 'var(--accent)', fontWeight: 700 }}>
              Putar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecDrawer;
