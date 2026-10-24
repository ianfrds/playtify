'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';

export function BottomDock() {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === '/now-playing') return null;

  return (
    <nav id="mobile-dock" className="mobile-bottom-dock" aria-label="Navigasi Bawah">
      {/* 1. Home */}
      <button
        className={`dock-item ${pathname === '/' ? 'active' : ''}`}
        onClick={() => router.push('/')}
        aria-label="Home"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill={pathname === '/' ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <span className="dock-label">Home</span>
      </button>

      {/* 2. Cari */}
      <button
        className={`dock-item ${pathname === '/search' ? 'active' : ''}`}
        onClick={() => router.push('/search')}
        aria-label="Cari"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <span className="dock-label">Cari</span>
      </button>

      {/* 3. Koleksi Kamu */}
      <button
        className={`dock-item ${pathname === '/liked' || pathname.startsWith('/playlist') ? 'active' : ''}`}
        onClick={() => router.push('/liked')}
        aria-label="Koleksi Kamu"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill={pathname === '/liked' ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
        <span className="dock-label">Koleksi Kamu</span>
      </button>

      {/* 4. Antrean (Queue) */}
      <button
        className={`dock-item ${pathname === '/queue' ? 'active' : ''}`}
        onClick={() => router.push('/queue')}
        aria-label="Antrean"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <circle cx="3.5" cy="6" r="1.5" />
          <circle cx="3.5" cy="12" r="1.5" />
          <circle cx="3.5" cy="18" r="1.5" />
        </svg>
        <span className="dock-label">Antrean</span>
      </button>
    </nav>
  );
}

export default BottomDock;
