import type { Metadata, Viewport } from 'next';
import React from 'react';
import './globals.css';
import { AudioProvider } from '@/context/AudioContext';
import GlobalAudioPlayer from '@/components/player/GlobalAudioPlayer';
import Sidebar from '@/components/layout/Sidebar';
import PlayerBar from '@/components/player/PlayerBar';
import MobileMiniPlayer from '@/components/player/MobileMiniPlayer';
import BottomDock from '@/components/layout/BottomDock';
import ModalNowPlaying from '@/components/player/ModalNowPlaying';
import QueueSidebar from '@/components/drawers/QueueSidebar';
import RecDrawer from '@/components/drawers/RecDrawer';
import BrandModal from '@/components/modals/BrandModal';
import NewPlaylistModal from '@/components/modals/NewPlaylistModal';
import FullscreenLyricsModal from '@/components/modals/FullscreenLyricsModal';
import Toast from '@/components/common/Toast';

export const metadata: Metadata = {
  title: 'Playtify - Pemutar Musik Online Modern',
  description: 'Streaming musik bebas hambatan dengan rekomendasi YouTube terupdate, profil artis lengkap, dan audio stabil.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon-192.png',
    apple: '/icon-192.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AudioProvider>
          {/* Persistent Audio Engine */}
          <GlobalAudioPlayer />

          <div id="app">
            {/* Desktop Left Sidebar */}
            <Sidebar />

            {/* Main Scrollable Stage */}
            <main id="main-content" className="main-content">
              {children}
            </main>

            {/* Desktop Player Bar */}
            <PlayerBar />

            {/* Mobile Mini Player Pill (Floating 16px above dock) */}
            <MobileMiniPlayer />

            {/* Mobile Bottom Dock */}
            <BottomDock />

            {/* Mobile Screen 3 Fullscreen Now Playing Modal */}
            <ModalNowPlaying />

            {/* Flyout Drawers & Modals */}
            <QueueSidebar />
            <RecDrawer />
            <BrandModal />
            <NewPlaylistModal />
            <FullscreenLyricsModal />
            <Toast />
          </div>
        </AudioProvider>
      </body>
    </html>
  );
}
