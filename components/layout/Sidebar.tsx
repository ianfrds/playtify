'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAudio } from '@/context/AudioContext';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { brandName, setIsBrandModalOpen, toggleQueueSidebar, setIsNewPlaylistModalOpen, playlists } = useAudio();

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
        <div className="brand" id="brand-display">
          <svg className="brand-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1.5" />
            <path d="M9.5 7.5V16.5L17 12L9.5 7.5Z" fill="currentColor" />
          </svg>
          <span className="brand-name" id="brand-name">{brandName}</span>
        </div>
        <button
          id="btn-edit-brand"
          className="icon-btn"
          onClick={() => setIsBrandModalOpen(true)}
          title="Edit nama brand"
          aria-label="Edit nama brand"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
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
            onClick={() => setIsNewPlaylistModalOpen(true)}
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
              >
                <div className="playlist-item-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3v9.28c-.47-.17-.97-.28-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z" />
                  </svg>
                </div>
                <span>{pl.name}</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;
