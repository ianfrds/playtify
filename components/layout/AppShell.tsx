'use client';

import React from 'react';
import { useAudio } from '@/context/AudioContext';
import AuthGate from '@/components/auth/AuthGate';
import AuthModal from '@/components/auth/AuthModal';
import GlobalAudioPlayer from '@/components/player/GlobalAudioPlayer';
import Sidebar from '@/components/layout/Sidebar';
import PlayerBar from '@/components/player/PlayerBar';
import MobileMiniPlayer from '@/components/player/MobileMiniPlayer';
import BottomDock from '@/components/layout/BottomDock';
import NowPlayingSidebar from '@/components/drawers/NowPlayingSidebar';
import QueueSidebar from '@/components/drawers/QueueSidebar';
import LyricsSidebar from '@/components/drawers/LyricsSidebar';
import RecDrawer from '@/components/drawers/RecDrawer';
import NewPlaylistModal from '@/components/modals/NewPlaylistModal';
import EditPlaylistModal from '@/components/modals/EditPlaylistModal';
import DeletePlaylistModal from '@/components/modals/DeletePlaylistModal';
import FullscreenLyricsModal from '@/components/modals/FullscreenLyricsModal';
import Toast from '@/components/common/Toast';

export function AppShell({ children }: { children: React.ReactNode }) {
  const {
    user,
    isGuest,
    isAuthLoading,
    isQueueSidebarOpen,
    isLyricsSidebarOpen,
    isNowPlayingSidebarOpen,
  } = useAudio();

  // 1. Loading splash screen while checking session & guest state
  if (isAuthLoading) {
    return (
      <div className="auth-splash-loader">
        <div className="auth-splash-content">
          <img
            src="/logo.png"
            alt="Haytify"
            className="auth-splash-icon"
            style={{
              width: 96,
              height: 96,
              borderRadius: '50%',
              objectFit: 'contain',
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.6), 0 0 40px rgba(30, 215, 96, 0.35)',
            }}
          />
          <span className="auth-splash-brand" style={{ letterSpacing: '0.04em', marginTop: 4 }}>
            Haytify
          </span>
          <div className="auth-splash-spinner" />
        </div>
      </div>
    );
  }

  // 2. Pure Auth Gate when user is not logged in and not in guest mode
  if (!user && !isGuest) {
    return (
      <>
        <AuthGate />
        <Toast />
      </>
    );
  }

  const hasRightSidebar = isQueueSidebarOpen || isLyricsSidebarOpen || isNowPlayingSidebarOpen;

  // 3. Complete Haytify App Shell (Logged-in user or Guest)
  return (
    <>
      {/* Persistent Audio Engine */}
      <GlobalAudioPlayer />

      <div
        id="app"
        className={`${isNowPlayingSidebarOpen ? 'has-now-playing-sidebar' : ''} ${isQueueSidebarOpen ? 'has-queue-sidebar' : ''} ${isLyricsSidebarOpen ? 'has-lyrics-sidebar' : ''} ${hasRightSidebar ? 'has-right-sidebar' : ''}`.trim()}
      >
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

        {/* Flyout Drawers & Modals */}
        <NowPlayingSidebar />
        <QueueSidebar />
        <LyricsSidebar />
        <RecDrawer />
        <NewPlaylistModal />
        <EditPlaylistModal />
        <DeletePlaylistModal />
        <FullscreenLyricsModal />
        <AuthModal />
        <Toast />
      </div>
    </>
  );
}

export default AppShell;
