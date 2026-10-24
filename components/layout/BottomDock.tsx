'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAudio } from '@/context/AudioContext';

export function BottomDock() {
  const router = useRouter();
  const pathname = usePathname();
  const { toggleQueueSidebar } = useAudio();

  return (
    <nav id="mobile-dock" className="mobile-bottom-dock" aria-label="Navigasi Bawah">
      <button
        className={`dock-item ${pathname === '/' ? 'active' : ''}`}
        onClick={() => router.push('/')}
        aria-label="Home"
      >
        <div className="dock-icon-pill">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </div>
      </button>

      <button
        className={`dock-item ${pathname === '/search' ? 'active' : ''}`}
        onClick={() => router.push('/search')}
        aria-label="Cari"
      >
        <div className="dock-icon-pill">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
      </button>

      <button
        className={`dock-item ${pathname === '/now-playing' ? 'active' : ''}`}
        onClick={() => router.push('/now-playing')}
        aria-label="Now Playing"
      >
        <div className="dock-icon-pill">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
          </svg>
        </div>
      </button>

      <button
        className={`dock-item ${pathname === '/liked' ? 'active' : ''}`}
        onClick={() => router.push('/liked')}
        aria-label="Lagu Disukai"
      >
        <div className="dock-icon-pill">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </div>
      </button>

      <button
        className="dock-item"
        onClick={() => toggleQueueSidebar(true)}
        aria-label="Antrian"
      >
        <div className="dock-icon-pill">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <circle cx="3.5" cy="6" r="1.5" />
            <circle cx="3.5" cy="12" r="1.5" />
            <circle cx="3.5" cy="18" r="1.5" />
          </svg>
        </div>
      </button>
    </nav>
  );
}

export default BottomDock;
