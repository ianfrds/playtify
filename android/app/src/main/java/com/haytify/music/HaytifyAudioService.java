package com.haytify.music;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Intent;
import android.content.pm.ServiceInfo;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.drawable.Icon;
import android.media.MediaMetadata;
import android.media.session.MediaSession;
import android.media.session.PlaybackState;
import android.os.Build;
import android.os.IBinder;
import androidx.annotation.Nullable;

import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class HaytifyAudioService extends Service {
    public static final String CHANNEL_ID = "haytify_audio_playback";
    public static final int NOTIFICATION_ID = 2026;

    public static final String ACTION_UPDATE = "com.haytify.music.ACTION_UPDATE";
    public static final String ACTION_PREV = "com.haytify.music.ACTION_PREV";
    public static final String ACTION_TOGGLE = "com.haytify.music.ACTION_TOGGLE";
    public static final String ACTION_NEXT = "com.haytify.music.ACTION_NEXT";

    private String currentTitle = "Haytify Music";
    private String currentArtist = "Musik berputar di latar belakang";
    private String currentCoverUrl = null;
    private Bitmap currentCoverBitmap = null;
    private boolean isPlaying = true;
    private MediaSession mediaSession;

    @Override
    public void onCreate() {
        super.onCreate();
        createNotificationChannel();
        initMediaSession();
    }

    private void initMediaSession() {
        try {
            mediaSession = new MediaSession(this, "HaytifyMediaSession");
            mediaSession.setCallback(new MediaSession.Callback() {
                @Override
                public void onPlay() {
                    isPlaying = true;
                    updateNotification();
                    MainActivity.dispatchMediaAction("toggle");
                }

                @Override
                public void onPause() {
                    isPlaying = false;
                    updateNotification();
                    MainActivity.dispatchMediaAction("toggle");
                }

                @Override
                public void onSkipToNext() {
                    MainActivity.dispatchMediaAction("next");
                }

                @Override
                public void onSkipToPrevious() {
                    MainActivity.dispatchMediaAction("prev");
                }
            });
            mediaSession.setActive(true);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent != null) {
            String action = intent.getAction();
            if (ACTION_PREV.equals(action)) {
                MainActivity.dispatchMediaAction("prev");
            } else if (ACTION_TOGGLE.equals(action)) {
                isPlaying = !isPlaying;
                updateNotification();
                MainActivity.dispatchMediaAction("toggle");
            } else if (ACTION_NEXT.equals(action)) {
                MainActivity.dispatchMediaAction("next");
            } else if (ACTION_UPDATE.equals(action)) {
                String title = intent.getStringExtra("title");
                String artist = intent.getStringExtra("artist");
                String coverUrl = intent.getStringExtra("coverUrl");
                boolean playing = intent.getBooleanExtra("isPlaying", true);

                if (title != null && !title.trim().isEmpty()) {
                    currentTitle = title;
                }
                if (artist != null && !artist.trim().isEmpty()) {
                    currentArtist = artist;
                }
                isPlaying = playing;

                if (coverUrl != null && !coverUrl.equals(currentCoverUrl)) {
                    currentCoverUrl = coverUrl;
                    loadCoverBitmap(coverUrl);
                }
            }
        }

        updateNotification();
        return START_STICKY;
    }

    private void loadCoverBitmap(String urlStr) {
        new Thread(() -> {
            try {
                URL url = new URL(urlStr);
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setConnectTimeout(4000);
                conn.setReadTimeout(4000);
                InputStream is = conn.getInputStream();
                Bitmap bmp = BitmapFactory.decodeStream(is);
                if (bmp != null) {
                    currentCoverBitmap = bmp;
                    updateNotification();
                }
            } catch (Exception ignored) {}
        }).start();
    }

    private void updateNotification() {
        Intent launchIntent = new Intent(this, MainActivity.class);
        launchIntent.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);

        int pendingFlags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            pendingFlags |= PendingIntent.FLAG_IMMUTABLE;
        }

        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, launchIntent, pendingFlags);

        // Controller Actions: Prev, Toggle Play/Pause, Next
        Intent prevIntent = new Intent(this, HaytifyAudioService.class);
        prevIntent.setAction(ACTION_PREV);
        PendingIntent prevPI = PendingIntent.getService(this, 1, prevIntent, pendingFlags);

        Intent toggleIntent = new Intent(this, HaytifyAudioService.class);
        toggleIntent.setAction(ACTION_TOGGLE);
        PendingIntent togglePI = PendingIntent.getService(this, 2, toggleIntent, pendingFlags);

        Intent nextIntent = new Intent(this, HaytifyAudioService.class);
        nextIntent.setAction(ACTION_NEXT);
        PendingIntent nextPI = PendingIntent.getService(this, 3, nextIntent, pendingFlags);

        // Update MediaSession state & metadata
        if (mediaSession != null) {
            try {
                long actions = PlaybackState.ACTION_PLAY | PlaybackState.ACTION_PAUSE |
                        PlaybackState.ACTION_SKIP_TO_NEXT | PlaybackState.ACTION_SKIP_TO_PREVIOUS |
                        PlaybackState.ACTION_PLAY_PAUSE;

                PlaybackState.Builder stateBuilder = new PlaybackState.Builder()
                        .setActions(actions)
                        .setState(isPlaying ? PlaybackState.STATE_PLAYING : PlaybackState.STATE_PAUSED,
                                PlaybackState.PLAYBACK_POSITION_UNKNOWN, 1.0f);
                mediaSession.setPlaybackState(stateBuilder.build());

                MediaMetadata.Builder metaBuilder = new MediaMetadata.Builder()
                        .putString(MediaMetadata.METADATA_KEY_TITLE, currentTitle)
                        .putString(MediaMetadata.METADATA_KEY_ARTIST, currentArtist)
                        .putString(MediaMetadata.METADATA_KEY_ALBUM_ARTIST, currentArtist);

                if (currentCoverBitmap != null) {
                    metaBuilder.putBitmap(MediaMetadata.METADATA_KEY_ALBUM_ART, currentCoverBitmap);
                    metaBuilder.putBitmap(MediaMetadata.METADATA_KEY_ART, currentCoverBitmap);
                }
                mediaSession.setMetadata(metaBuilder.build());
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        Notification.Builder builder;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            builder = new Notification.Builder(this, CHANNEL_ID);
        } else {
            builder = new Notification.Builder(this);
        }

        builder.setContentTitle(currentTitle)
                .setContentText(currentArtist)
                .setSmallIcon(R.drawable.ic_notification)
                .setContentIntent(pendingIntent)
                .setOngoing(isPlaying)
                .setVisibility(Notification.VISIBILITY_PUBLIC);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            builder.setCategory(Notification.CATEGORY_TRANSPORT);
        }

        if (currentCoverBitmap != null) {
            builder.setLargeIcon(currentCoverBitmap);
        }

        // Add Playback Control Action buttons
        builder.addAction(new Notification.Action.Builder(
                Icon.createWithResource(this, R.drawable.ic_prev),
                "Sebelumnya",
                prevPI
        ).build());

        builder.addAction(new Notification.Action.Builder(
                Icon.createWithResource(this, isPlaying ? R.drawable.ic_pause : R.drawable.ic_play),
                isPlaying ? "Jeda" : "Putar",
                togglePI
        ).build());

        builder.addAction(new Notification.Action.Builder(
                Icon.createWithResource(this, R.drawable.ic_next),
                "Berikutnya",
                nextPI
        ).build());

        // Apply Native MediaStyle
        Notification.MediaStyle mediaStyle = new Notification.MediaStyle();
        if (mediaSession != null) {
            mediaStyle.setMediaSession(mediaSession.getSessionToken());
        }
        mediaStyle.setShowActionsInCompactView(0, 1, 2);
        builder.setStyle(mediaStyle);

        Notification notification = builder.build();

        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                startForeground(NOTIFICATION_ID, notification, ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK);
            } else {
                startForeground(NOTIFICATION_ID, notification);
            }
        } catch (Throwable t) {
            t.printStackTrace();
        }
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onDestroy() {
        if (mediaSession != null) {
            try {
                mediaSession.setActive(false);
                mediaSession.release();
            } catch (Exception ignored) {}
        }
        super.onDestroy();
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID,
                    "Pemutaran Audio Latar Belakang",
                    NotificationManager.IMPORTANCE_LOW
            );
            channel.setDescription("Menjaga musik Haytify tetap berputar saat aplikasi diminimize atau layar dimatikan.");
            channel.setShowBadge(false);

            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(channel);
            }
        }
    }
}
