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

            // Expose AndroidPiP interface to Web UI
            webView.addJavascriptInterface(new Object() {
                @JavascriptInterface
                public void enterPip() {
                    runOnUiThread(() -> enterPictureInPicture());
                }

                @JavascriptInterface
                public boolean isPipSupported() {
                    return Build.VERSION.SDK_INT >= Build.VERSION_CODES.O;
                }
            }, "AndroidPiP");
        }

        updatePipParams();
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
    public void onPause() {
        super.onPause();
        // CRITICAL: Prevent Chromium WebView from pausing HTML5 audio tags when app is minimized
        keepWebViewMediaActive();
    }

    @Override
    public void onStop() {
        super.onStop();
        // CRITICAL: Prevent Chromium WebView from freezing audio when screen is locked or switching to another app
        keepWebViewMediaActive();
    }

    private void keepWebViewMediaActive() {
        if (this.bridge != null && this.bridge.getWebView() != null) {
            WebView webView = this.bridge.getWebView();
            // In Android WebView, onPause() pauses all HTML5 audio elements.
            // Calling onResume() & resumeTimers() prevents the audio engine from being paused!
            webView.onResume();
            webView.resumeTimers();
        }
    }

    @Override
    public void onResume() {
        super.onResume();
        updatePipParams();
    }

    @Override
    public void onUserLeaveHint() {
        super.onUserLeaveHint();
        // Automatically enter Picture-in-Picture when user minimizes the app or presses Home
        enterPictureInPicture();
    }

    public void enterPictureInPicture() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            try {
                PictureInPictureParams.Builder builder = new PictureInPictureParams.Builder();
                Rational aspectRatio = new Rational(16, 9);
                builder.setAspectRatio(aspectRatio);
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                    builder.setAutoEnterEnabled(true);
                    builder.setSeamlessResizeEnabled(true);
                }
                enterPictureInPictureMode(builder.build());
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    private void updatePipParams() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            try {
                PictureInPictureParams.Builder builder = new PictureInPictureParams.Builder();
                builder.setAspectRatio(new Rational(16, 9));
                builder.setAutoEnterEnabled(true);
                builder.setSeamlessResizeEnabled(true);
                setPictureInPictureParams(builder.build());
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
