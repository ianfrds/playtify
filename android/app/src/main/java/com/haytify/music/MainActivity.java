package com.haytify.music;

import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
import android.os.Build;
import android.os.Bundle;
import android.os.PowerManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import androidx.core.content.ContextCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    public static MainActivity instance;
    private PowerManager.WakeLock wakeLock;
    private boolean isAudioPlaying = false;

    public static void dispatchMediaAction(String action) {
        if (instance != null && instance.bridge != null && instance.bridge.getWebView() != null) {
            instance.runOnUiThread(() -> {
                instance.bridge.getWebView().evaluateJavascript(
                    "if (window.handleNotificationMediaAction) { window.handleNotificationMediaAction('" + action + "'); }",
                    null
                );
            });
        }
    }

    public static void dispatchPlaybackProgress(int currentSec, int totalSec) {
        if (instance != null && instance.bridge != null && instance.bridge.getWebView() != null) {
            instance.runOnUiThread(() -> {
                instance.bridge.getWebView().evaluateJavascript(
                    "if (window.handleNativeProgress) { window.handleNativeProgress(" + currentSec + ", " + totalSec + "); }",
                    null
                );
            });
        }
    }

    public static void dispatchPlaybackState(boolean isPlaying) {
        if (instance != null && instance.bridge != null && instance.bridge.getWebView() != null) {
            instance.runOnUiThread(() -> {
                instance.bridge.getWebView().evaluateJavascript(
                    "if (window.handleNativeStateChange) { window.handleNativeStateChange(" + isPlaying + "); }",
                    null
                );
            });
        }
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        instance = this;

        // 1. Request notification permission on Android 13+ (API 33+) so foreground service notification can display
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (checkSelfPermission(android.Manifest.permission.POST_NOTIFICATIONS) != android.content.pm.PackageManager.PERMISSION_GRANTED) {
                requestPermissions(new String[]{android.Manifest.permission.POST_NOTIFICATIONS}, 101);
            }
        }

        // 2. Start Native Background Audio Foreground Service
        startBackgroundAudioService();

        // 3. Acquire Partial WakeLock to keep CPU active during playback
        try {
            PowerManager powerManager = (PowerManager) getSystemService(Context.POWER_SERVICE);
            if (powerManager != null) {
                wakeLock = powerManager.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "Haytify::BackgroundAudioWakeLock");
                wakeLock.setReferenceCounted(false);
                wakeLock.acquire(12 * 60 * 60 * 1000L); // Max 12 hours timeout
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        // 4. Configure WebView settings for uninterrupted background streaming
        if (this.bridge != null && this.bridge.getWebView() != null) {
            WebView webView = this.bridge.getWebView();
            WebSettings settings = webView.getSettings();
            
            // Allow media playback without requiring a new manual touch per song
            settings.setMediaPlaybackRequiresUserGesture(false);
            
            // Allow mixed content for external stream CDNs
            settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
            
            settings.setDomStorageEnabled(true);
            settings.setDatabaseEnabled(true);

            // Expose AndroidAudioBridge interface to Web UI
            Object audioBridge = new Object() {
                @JavascriptInterface
                public void playTrack(String videoId, String title, String artist, String coverUrl, String streamUrl) {
                    MainActivity.this.isAudioPlaying = true;
                    try {
                        Intent serviceIntent = new Intent(MainActivity.this, HaytifyAudioService.class);
                        serviceIntent.setAction(HaytifyAudioService.ACTION_PLAY_STREAM);
                        serviceIntent.putExtra("videoId", videoId);
                        serviceIntent.putExtra("title", title);
                        serviceIntent.putExtra("artist", artist);
                        serviceIntent.putExtra("coverUrl", coverUrl);
                        serviceIntent.putExtra("streamUrl", streamUrl);
                        ContextCompat.startForegroundService(MainActivity.this, serviceIntent);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }

                @JavascriptInterface
                public void pauseAudio() {
                    MainActivity.this.isAudioPlaying = false;
                    try {
                        Intent serviceIntent = new Intent(MainActivity.this, HaytifyAudioService.class);
                        serviceIntent.setAction(HaytifyAudioService.ACTION_PAUSE);
                        ContextCompat.startForegroundService(MainActivity.this, serviceIntent);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }

                @JavascriptInterface
                public void resumeAudio() {
                    MainActivity.this.isAudioPlaying = true;
                    try {
                        Intent serviceIntent = new Intent(MainActivity.this, HaytifyAudioService.class);
                        serviceIntent.setAction(HaytifyAudioService.ACTION_RESUME);
                        ContextCompat.startForegroundService(MainActivity.this, serviceIntent);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }

                @JavascriptInterface
                public void togglePlay() {
                    try {
                        Intent serviceIntent = new Intent(MainActivity.this, HaytifyAudioService.class);
                        serviceIntent.setAction(HaytifyAudioService.ACTION_TOGGLE);
                        ContextCompat.startForegroundService(MainActivity.this, serviceIntent);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }

                @JavascriptInterface
                public void seekTo(int seconds) {
                    try {
                        Intent serviceIntent = new Intent(MainActivity.this, HaytifyAudioService.class);
                        serviceIntent.setAction(HaytifyAudioService.ACTION_SEEK);
                        serviceIntent.putExtra("positionMsec", seconds * 1000);
                        ContextCompat.startForegroundService(MainActivity.this, serviceIntent);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }

                @JavascriptInterface
                public void updateTrack(String title, String artist, boolean isPlaying, String coverUrl) {
                    MainActivity.this.isAudioPlaying = isPlaying;
                    try {
                        Intent serviceIntent = new Intent(MainActivity.this, HaytifyAudioService.class);
                        serviceIntent.setAction(HaytifyAudioService.ACTION_UPDATE);
                        serviceIntent.putExtra("title", title);
                        serviceIntent.putExtra("artist", artist);
                        serviceIntent.putExtra("isPlaying", isPlaying);
                        serviceIntent.putExtra("coverUrl", coverUrl);
                        ContextCompat.startForegroundService(MainActivity.this, serviceIntent);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }

                @JavascriptInterface
                public void updateTrack(String title, String artist, boolean isPlaying) {
                    updateTrack(title, artist, isPlaying, null);
                }

                @JavascriptInterface
                public void setAudioPlaying(boolean playing) {
                    MainActivity.this.isAudioPlaying = playing;
                }

                @JavascriptInterface
                public void moveToBack() {
                    runOnUiThread(() -> moveTaskToBack(true));
                }

                @JavascriptInterface
                public void minimizeToBackgroundAudio() {
                    runOnUiThread(() -> moveTaskToBack(true));
                }

                @JavascriptInterface
                public boolean isNative() {
                    return true;
                }
            };

            webView.addJavascriptInterface(audioBridge, "AndroidAudioBridge");
        }
    }

    private void startBackgroundAudioService() {
        try {
            Intent serviceIntent = new Intent(this, HaytifyAudioService.class);
            ContextCompat.startForegroundService(this, serviceIntent);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onBackPressed() {
        if (this.bridge != null && this.bridge.getWebView() != null) {
            WebView webView = this.bridge.getWebView();
            webView.evaluateJavascript(
                "(function() { if (window.handleAndroidBack) { return window.handleAndroidBack(); } return 'unhandled'; })()",
                null
            );
        } else {
            moveTaskToBack(true);
        }
    }

    @Override
    public void onPause() {
        super.onPause();
        keepWebViewMediaActive();
    }

    @Override
    public void onStop() {
        super.onStop();
        keepWebViewMediaActive();
    }

    private void keepWebViewMediaActive() {
        if (this.bridge != null && this.bridge.getWebView() != null) {
            WebView webView = this.bridge.getWebView();
            webView.onResume();
            webView.resumeTimers();
        }
    }

    @Override
    public void onDestroy() {
        if (instance == this) {
            instance = null;
        }
        if (wakeLock != null && wakeLock.isHeld()) {
            try {
                wakeLock.release();
            } catch (Exception ignored) {}
        }
        super.onDestroy();
    }
}
