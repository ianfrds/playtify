package com.haytify.music;

import android.app.PictureInPictureParams;
import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
import android.os.Build;
import android.os.Bundle;
import android.os.PowerManager;
import android.util.Rational;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import androidx.core.content.ContextCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private PowerManager.WakeLock wakeLock;
    private boolean isAudioPlaying = false;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

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

        // 4. Configure WebView settings for uninterrupted HTML5 streaming & PiP
        if (this.bridge != null && this.bridge.getWebView() != null) {
            WebView webView = this.bridge.getWebView();
            WebSettings settings = webView.getSettings();
            
            // Allow media playback without requiring a new manual touch per song
            settings.setMediaPlaybackRequiresUserGesture(false);
            
            // Allow mixed content for external stream CDNs
            settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
            
            settings.setDomStorageEnabled(true);
            settings.setDatabaseEnabled(true);

            // Expose AndroidAudioBridge and AndroidPiP interface to Web UI
            Object audioBridge = new Object() {
                @JavascriptInterface
                public void updateTrack(String title, String artist, boolean isPlaying) {
                    isAudioPlaying = isPlaying;
                    updatePipParams(isPlaying);
                    try {
                        Intent serviceIntent = new Intent(MainActivity.this, HaytifyAudioService.class);
                        serviceIntent.setAction(HaytifyAudioService.ACTION_UPDATE);
                        serviceIntent.putExtra("title", title);
                        serviceIntent.putExtra("artist", artist);
                        serviceIntent.putExtra("isPlaying", isPlaying);
                        ContextCompat.startForegroundService(MainActivity.this, serviceIntent);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }

                @JavascriptInterface
                public void setAudioPlaying(boolean playing) {
                    isAudioPlaying = playing;
                    updatePipParams(playing);
                }

                @JavascriptInterface
                public void enterPip() {
                    runOnUiThread(() -> enterPictureInPicture());
                }

                @JavascriptInterface
                public boolean isPipSupported() {
                    return Build.VERSION.SDK_INT >= Build.VERSION_CODES.O;
                }

                @JavascriptInterface
                public void moveToBack() {
                    runOnUiThread(() -> moveTaskToBack(true));
                }

                @JavascriptInterface
                public void minimizeToBackgroundAudio() {
                    runOnUiThread(() -> {
                        try {
                            moveTaskToBack(true);
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    });
                }
            };

            webView.addJavascriptInterface(audioBridge, "AndroidAudioBridge");
            webView.addJavascriptInterface(audioBridge, "AndroidPiP");
        }
    }

    private void updatePipParams(boolean isPlaying) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            try {
                PictureInPictureParams.Builder builder = new PictureInPictureParams.Builder();
                builder.setAspectRatio(new Rational(1, 1));
                builder.setAutoEnterEnabled(isPlaying);
                setPictureInPictureParams(builder.build());
            } catch (Exception ignored) {}
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
    public void onUserLeaveHint() {
        super.onUserLeaveHint();
        // Auto-enter 1:1 PiP when exiting app while audio is playing
        if (isAudioPlaying && Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            enterPictureInPicture();
        }
    }

    @Override
    public void onBackPressed() {
        if (this.bridge != null && this.bridge.getWebView() != null) {
            WebView webView = this.bridge.getWebView();
            webView.evaluateJavascript(
                "(function() { if (window.handleAndroidBack) { return window.handleAndroidBack(); } return 'unhandled'; })()",
                result -> {
                    if ("\"handled\"".equals(result) || "true".equals(result)) {
                        return;
                    }
                    // At root page: move task to back without killing the activity or stopping music
                    runOnUiThread(() -> moveTaskToBack(true));
                }
            );
        } else {
            moveTaskToBack(true);
        }
    }

    @Override
    public void onPause() {
        super.onPause();
        // Prevent Chromium WebView from pausing HTML5 audio tags when app is minimized
        keepWebViewMediaActive();
    }

    @Override
    public void onStop() {
        super.onStop();
        // Prevent Chromium WebView from freezing audio when screen is locked or switching to another app
        keepWebViewMediaActive();
    }

    private void keepWebViewMediaActive() {
        if (this.bridge != null && this.bridge.getWebView() != null) {
            WebView webView = this.bridge.getWebView();
            webView.onResume();
            webView.resumeTimers();
        }
    }

    public void enterPictureInPicture() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            try {
                PictureInPictureParams.Builder builder = new PictureInPictureParams.Builder();
                // 1:1 Aspect ratio for square album cover!
                Rational aspectRatio = new Rational(1, 1);
                builder.setAspectRatio(aspectRatio);
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                    builder.setAutoEnterEnabled(true);
                }
                enterPictureInPictureMode(builder.build());
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    public void onPictureInPictureModeChanged(boolean isInPictureInPictureMode, Configuration newConfig) {
        super.onPictureInPictureModeChanged(isInPictureInPictureMode, newConfig);
        if (this.bridge != null && this.bridge.getWebView() != null) {
            String script = "window.dispatchEvent(new CustomEvent('pipmodechange', { detail: { isInPip: " + isInPictureInPictureMode + " } }));";
            this.bridge.getWebView().evaluateJavascript(script, null);
        }
    }

    @Override
    public void onDestroy() {
        if (wakeLock != null && wakeLock.isHeld()) {
            try {
                wakeLock.release();
            } catch (Exception ignored) {}
        }
        super.onDestroy();
    }
}
