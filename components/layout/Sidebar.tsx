'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAudio } from '@/context/AudioContext';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    user,
    signOut,
    openAuthModal,
    openNewPlaylistModal,
    toggleQueueSidebar,
    playlists,
    openEditPlaylistModal,
    openDeletePlaylistModal,
  } = useAudio();

  const navItems = [
    {
      label: 'Home',
      href: '/',
      active: pathname === '/',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      label: 'Search',
      href: '/search',
      active: pathname === '/search',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      ),
    },
    {
      label: 'Now Playing',
      href: '/now-playing',
      active: pathname === '/now-playing',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="3" />
          <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
        </svg>
      ),
    },
    {
      label: 'Liked Songs',
      href: '/liked',
      active: pathname === '/liked',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
    },
  ];

  return (
    <aside id="sidebar" className="sidebar" aria-label="Navigasi Utama">
      <div className="sidebar-header">
        <div className="brand" id="brand-display" onClick={() => router.push('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
          <img
            src="/logo.png"
            alt="Haytify"
            style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'contain' }}
          />
          <span className="brand-name" id="brand-name">Haytify</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.href}
            className={`nav-item ${item.active ? 'active' : ''}`}
            onClick={() => router.push(item.href)}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}

        <button className="nav-item" onClick={() => toggleQueueSidebar(true)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
          <span>Queue</span>
        </button>
      </nav>

      <div className="sidebar-playlists">
        <div className="playlist-header">
          <h3>Playlists</h3>
          <button
            id="btn-new-playlist"
            className="icon-btn"
            onClick={openNewPlaylistModal}
            title="Buat playlist baru"
            aria-label="Buat playlist baru"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>

        <ul id="playlist-list" className="playlist-list">
          {playlists.length === 0 ? (
            <li className="playlist-empty-hint" style={{ padding: '8px 12px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Belum ada playlist
            </li>
          ) : (
            playlists.map((pl) => (
              <li
                key={pl.id}
                className="playlist-item"
                onClick={() => router.push(`/playlist/${pl.id}`)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  position: 'relative',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flex: 1 }}>
                  <div className="playlist-item-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 3v9.28c-.47-.17-.97-.28-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z" />
                    </svg>
                  </div>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {pl.name}
                  </span>
                </div>

                <div
                  className="sidebar-playlist-item-actions"
                  style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditPlaylistModal(pl);
                    }}
                    title="Edit nama & rincian"
                    aria-label="Edit playlist"
                    style={{ padding: 4, opacity: 0.6, color: '#b3b3b3' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '1';
                      e.currentTarget.style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '0.6';
                      e.currentTarget.style.color = '#b3b3b3';
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    className="icon-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      openDeletePlaylistModal(pl);
                    }}
                    title="Hapus playlist"
                    aria-label="Hapus playlist"
                    style={{ padding: 4, opacity: 0.6, color: '#b3b3b3' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '1';
                      e.currentTarget.style.color = '#ff4d4d';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '0.6';
                      e.currentTarget.style.color = '#b3b3b3';
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* ─── Sidebar Bottom Footer (User Account / Login & Register) ─── */}
      <div
        className="sidebar-footer"
        style={{
          marginTop: 'auto',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '14px 12px',
          background: 'var(--bg-base)',
          flexShrink: 0,
        }}
      >
        {user ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              borderRadius: 10,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div
              onClick={() => router.push('/login')}
              style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1, cursor: 'pointer' }}
              title="Lihat Akun"
            >
              {user.user_metadata?.avatar_url || user.user_metadata?.picture ? (
                <img
                  src={user.user_metadata.avatar_url || user.user_metadata.picture}
                  alt=""
                  style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: '#1ed760',
                    color: '#000',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {(user.user_metadata?.full_name || user.email || 'U').charAt(0).toUpperCase()}
                </div>
              )}
              <div style={{ minWidth: 0, flex: 1 }}>
                <div
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#fff',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0]}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#1ed760', fontWeight: 600 }}>Tersambung</div>
              </div>
            </div>

            <button
              onClick={() => signOut()}
              title="Keluar dari akun"
              aria-label="Keluar dari akun"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#888',
                cursor: 'pointer',
                padding: 4,
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ff4d4d')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#888')}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        ) : (
          <button
            onClick={() => openAuthModal('Masuk ke Haytify', 'Nikmati fitur lengkap, simpan lagu favorit, dan buat playlist pribadimu.')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '10px 14px',
              borderRadius: 24,
              background: '#fff',
              color: '#000',
              fontWeight: 700,
              fontSize: '0.84rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'transform 0.15s, background-color 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.backgroundColor = '#1ed760';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.backgroundColor = '#fff';
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Masuk / Daftar</span>
          </button>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
