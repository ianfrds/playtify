'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
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
  const router = useRouter();
  const pathname = usePathname();
  const audio = useAudio();

  const {
    user,
    isGuest,
    isAuthLoading,
    currentTrack,
    isPlaying,
    isQueueSidebarOpen,
    isLyricsSidebarOpen,
    isNowPlayingSidebarOpen,
    isLyricsFullscreen,
    closeFullscreenLyrics,
    isNowPlayingModalOpen,
    setNowPlayingModalOpen,
    toggleQueueSidebar,
    toggleLyricsSidebar,
    toggleNowPlayingSidebar,
    isRecDrawerOpen,
    toggleRecDrawer,
    editingPlaylist,
    closeEditPlaylistModal,
    deletingPlaylist,
    closeDeletePlaylistModal,
    isNewPlaylistModalOpen,
    setIsNewPlaylistModalOpen,
    isBrandModalOpen,
    setIsBrandModalOpen,
  } = audio;

  // 1. Sync current song metadata to Android Native Media Notification
  useEffect(() => {
    if (typeof window !== 'undefined' && currentTrack) {
      const bridge = (window as any).AndroidAudioBridge;
      if (bridge && typeof bridge.updateTrack === 'function') {
        bridge.updateTrack(currentTrack.title, currentTrack.artist, isPlaying);
      }
    }
  }, [currentTrack, isPlaying]);

  // 2. Sequential Android Hardware Back Button Navigation
  useEffect(() => {
    if (typeof window === 'undefined') return;

    (window as any).handleAndroidBack = () => {
      // Step A: Close full screen lyrics if open
      if (isLyricsFullscreen) {
        closeFullscreenLyrics();
        return 'handled';
      }

      // Step B: Close Now Playing modal if open
      if (isNowPlayingModalOpen) {
        setNowPlayingModalOpen(false);
        return 'handled';
      }

      // Step C: Close flyout drawers if open
      if (isQueueSidebarOpen) {
        toggleQueueSidebar(false);
        return 'handled';
      }
      if (isLyricsSidebarOpen) {
        toggleLyricsSidebar(false);
        return 'handled';
      }
      if (isNowPlayingSidebarOpen) {
        toggleNowPlayingSidebar(false);
        return 'handled';
      }
      if (isRecDrawerOpen) {
        toggleRecDrawer(false);
        return 'handled';
      }

      // Step D: Close popup modals if open
      if (editingPlaylist) {
        closeEditPlaylistModal();
        return 'handled';
      }
      if (deletingPlaylist) {
        closeDeletePlaylistModal();
        return 'handled';
      }
      if (isNewPlaylistModalOpen) {
        setIsNewPlaylistModalOpen(false);
        return 'handled';
      }
      if (isBrandModalOpen) {
        setIsBrandModalOpen(false);
        return 'handled';
      }

      // Step E: Navigate backwards through routes in order
      if (pathname && pathname !== '/') {
        router.back();
        return 'handled';
      }

      // Step F: At root page ('/'): signal unhandled so Android minimizes smoothly without killing app
      return 'unhandled';
    };

    return () => {
      delete (window as any).handleAndroidBack;
    };
  }, [
    pathname,
    router,
    isLyricsFullscreen,
    closeFullscreenLyrics,
    isNowPlayingModalOpen,
    setNowPlayingModalOpen,
    isQueueSidebarOpen,
    toggleQueueSidebar,
    isLyricsSidebarOpen,
    toggleLyricsSidebar,
    isNowPlayingSidebarOpen,
    toggleNowPlayingSidebar,
    isRecDrawerOpen,
    toggleRecDrawer,
    editingPlaylist,
    closeEditPlaylistModal,
    deletingPlaylist,
    closeDeletePlaylistModal,
    isNewPlaylistModalOpen,
    setIsNewPlaylistModalOpen,
    isBrandModalOpen,
    setIsBrandModalOpen,
  ]);

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
