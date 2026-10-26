package com.haytify.music;

import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Configure WebView for seamless continuous audio streaming
        if (this.bridge != null && this.bridge.getWebView() != null) {
            WebView webView = this.bridge.getWebView();
            WebSettings settings = webView.getSettings();
            
            // Allow media playback without requiring direct user gesture per track
            settings.setMediaPlaybackRequiresUserGesture(false);
            
            // Allow mixed content for streaming CDN endpoints
            settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
            
            // Enable DOM storage & database
            settings.setDomStorageEnabled(true);
            settings.setDatabaseEnabled(true);
        }
    }
}
