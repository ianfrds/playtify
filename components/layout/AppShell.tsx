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
import ModalNowPlaying from '@/components/player/ModalNowPlaying';
import QueueSidebar from '@/components/drawers/QueueSidebar';
import RecDrawer from '@/components/drawers/RecDrawer';
import NewPlaylistModal from '@/components/modals/NewPlaylistModal';
import EditPlaylistModal from '@/components/modals/EditPlaylistModal';
import DeletePlaylistModal from '@/components/modals/DeletePlaylistModal';
import FullscreenLyricsModal from '@/components/modals/FullscreenLyricsModal';
import Toast from '@/components/common/Toast';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, isGuest, isAuthLoading } = useAudio();

  // 1. Loading splash screen while checking session & guest state
  if (isAuthLoading) {
    return (
      <div className="auth-splash-loader">
        <div className="auth-splash-content">
          <svg className="auth-splash-icon" width="60" height="60" viewBox="0 0 24 24" fill="#1ed760">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 11.5c3.5-1 7-0.5 9.5 1" stroke="#121212" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M7.5 14.5c4-1 8-0.5 10.5 1" stroke="#121212" strokeWidth="1.8" strokeLinecap="round" fill="none" />
            <path d="M9 8.5c3-0.8 6-0.3 8.5 1" stroke="#121212" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          </svg>
          <span className="auth-splash-brand">Playtify</span>
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

  // 3. Complete Playtify App Shell (Logged-in user or Guest)
  return (
    <>
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
