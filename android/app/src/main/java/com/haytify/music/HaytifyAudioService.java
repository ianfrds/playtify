package com.haytify.music;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ServiceInfo;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.drawable.Icon;
import android.media.AudioAttributes;
import android.media.MediaMetadata;
import android.media.MediaPlayer;
import android.media.session.MediaSession;
import android.media.session.PlaybackState;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.os.PowerManager;
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
    public static final String ACTION_PLAY_STREAM = "com.haytify.music.ACTION_PLAY_STREAM";
    public static final String ACTION_PAUSE = "com.haytify.music.ACTION_PAUSE";
    public static final String ACTION_RESUME = "com.haytify.music.ACTION_RESUME";
    public static final String ACTION_SEEK = "com.haytify.music.ACTION_SEEK";

    private String currentTitle = "Haytify Music";
    private String currentArtist = "Musik berputar di latar belakang";
    private String currentCoverUrl = null;
    private String currentStreamUrl = null;
    private Bitmap currentCoverBitmap = null;
    private boolean isPlaying = false;
    private MediaSession mediaSession;
    private MediaPlayer mediaPlayer;
    private Handler progressHandler;
    private Runnable progressRunnable;
    private PowerManager.WakeLock wakeLock;

    @Override
    public void onCreate() {
        super.onCreate();
        createNotificationChannel();
        initMediaSession();
        initMediaPlayer();
        try {
            PowerManager pm = (PowerManager) getSystemService(Context.POWER_SERVICE);
            if (pm != null) {
                wakeLock = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "Haytify::AudioServiceWakeLock");
                wakeLock.setReferenceCounted(false);
                wakeLock.acquire(12 * 60 * 60 * 1000L); // 12 hours wakeLock
            }
        } catch (Exception ignored) {}
    }

    private void initMediaPlayer() {
        if (mediaPlayer == null) {
            mediaPlayer = new MediaPlayer();
            mediaPlayer.setWakeMode(getApplicationContext(), PowerManager.PARTIAL_WAKE_LOCK);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                mediaPlayer.setAudioAttributes(new AudioAttributes.Builder()
                        .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                        .setUsage(AudioAttributes.USAGE_MEDIA)
                        .build());
            }

            mediaPlayer.setOnPreparedListener(mp -> {
                try {
                    mp.start();
                    isPlaying = true;
                    updateNotification();
                    MainActivity.dispatchPlaybackState(true);
                    startProgressTracking();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            });

            mediaPlayer.setOnCompletionListener(mp -> {
                isPlaying = false;
                updateNotification();
                MainActivity.dispatchPlaybackState(false);
                stopProgressTracking();
                MainActivity.dispatchMediaAction("next");
            });

            mediaPlayer.setOnErrorListener((mp, what, extra) -> {
                isPlaying = false;
                updateNotification();
                MainActivity.dispatchPlaybackState(false);
                stopProgressTracking();
                MainActivity.dispatchMediaAction("native_stream_error");
                return true;
            });
        }
    }

    private void initMediaSession() {
        try {
            mediaSession = new MediaSession(this, "HaytifyMediaSession");
            mediaSession.setCallback(new MediaSession.Callback() {
                @Override
                public void onPlay() {
                    resumePlayback();
                }

                @Override
                public void onPause() {
                    pausePlayback();
                }

                @Override
                public void onSkipToNext() {
                    MainActivity.dispatchMediaAction("next");
                }

                @Override
                public void onSkipToPrevious() {
                    MainActivity.dispatchMediaAction("prev");
                }

                @Override
                public void onSeekTo(long pos) {
                    seekTo((int) pos);
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
                togglePlayback();
            } else if (ACTION_NEXT.equals(action)) {
                MainActivity.dispatchMediaAction("next");
            } else if (ACTION_PAUSE.equals(action)) {
                pausePlayback();
            } else if (ACTION_RESUME.equals(action)) {
                resumePlayback();
            } else if (ACTION_SEEK.equals(action)) {
                int pos = intent.getIntExtra("positionMsec", 0);
                seekTo(pos);
            } else if (ACTION_PLAY_STREAM.equals(action)) {
                String streamUrl = intent.getStringExtra("streamUrl");
                String title = intent.getStringExtra("title");
                String artist = intent.getStringExtra("artist");
                String coverUrl = intent.getStringExtra("coverUrl");
                playStream(streamUrl, title, artist, coverUrl);
            } else if (ACTION_UPDATE.equals(action)) {
                String title = intent.getStringExtra("title");
                String artist = intent.getStringExtra("artist");
                String coverUrl = intent.getStringExtra("coverUrl");
                boolean playing = intent.getBooleanExtra("isPlaying", isPlaying);

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

    private void playStream(String streamUrl, String title, String artist, String coverUrl) {
        if (title != null && !title.trim().isEmpty()) currentTitle = title;
        if (artist != null && !artist.trim().isEmpty()) currentArtist = artist;
        if (coverUrl != null && !coverUrl.equals(currentCoverUrl)) {
            currentCoverUrl = coverUrl;
            loadCoverBitmap(coverUrl);
        }

        if (streamUrl == null || streamUrl.trim().isEmpty()) return;
        currentStreamUrl = streamUrl;

        try {
            initMediaPlayer();
            mediaPlayer.reset();
            mediaPlayer.setDataSource(streamUrl);
            mediaPlayer.prepareAsync();
            isPlaying = true;
            updateNotification();
        } catch (Exception e) {
            e.printStackTrace();
            MainActivity.dispatchMediaAction("native_stream_error");
        }
    }

    private void pausePlayback() {
        if (mediaPlayer != null) {
            try {
                if (mediaPlayer.isPlaying()) {
                    mediaPlayer.pause();
                }
            } catch (Exception ignored) {}
        }
        isPlaying = false;
        updateNotification();
        MainActivity.dispatchPlaybackState(false);
        stopProgressTracking();
    }

    private void resumePlayback() {
        if (mediaPlayer != null) {
            try {
                mediaPlayer.start();
                isPlaying = true;
                updateNotification();
                MainActivity.dispatchPlaybackState(true);
                startProgressTracking();
                return;
            } catch (Exception ignored) {}
        }
        isPlaying = true;
        updateNotification();
        MainActivity.dispatchPlaybackState(true);
    }

    private void togglePlayback() {
        if (isPlaying) {
            pausePlayback();
        } else {
            resumePlayback();
        }
    }

    private void seekTo(int msec) {
        if (mediaPlayer != null) {
            try {
                mediaPlayer.seekTo(msec);
            } catch (Exception ignored) {}
        }
    }

    private void startProgressTracking() {
        stopProgressTracking();
        if (progressHandler == null) {
            progressHandler = new Handler(Looper.getMainLooper());
        }
        progressRunnable = new Runnable() {
            @Override
            public void run() {
                if (mediaPlayer != null && isPlaying) {
                    try {
                        int curr = mediaPlayer.getCurrentPosition() / 1000;
                        int dur = mediaPlayer.getDuration() / 1000;
                        if (dur > 0) {
                            MainActivity.dispatchPlaybackProgress(curr, dur);
                        }
                    } catch (Exception ignored) {}
                    if (progressHandler != null) {
                        progressHandler.postDelayed(this, 1000);
                    }
                }
            }
        };
        progressHandler.post(progressRunnable);
    }

    private void stopProgressTracking() {
        if (progressHandler != null && progressRunnable != null) {
            progressHandler.removeCallbacks(progressRunnable);
        }
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
                        PlaybackState.ACTION_PLAY_PAUSE | PlaybackState.ACTION_SEEK_TO;

                PlaybackState.Builder stateBuilder = new PlaybackState.Builder()
                        .setActions(actions)
                        .setState(isPlaying ? PlaybackState.STATE_PLAYING : PlaybackState.STATE_PAUSED,
                                mediaPlayer != null ? mediaPlayer.getCurrentPosition() : PlaybackState.PLAYBACK_POSITION_UNKNOWN, 1.0f);
                mediaSession.setPlaybackState(stateBuilder.build());

                MediaMetadata.Builder metaBuilder = new MediaMetadata.Builder()
                        .putString(MediaMetadata.METADATA_KEY_TITLE, currentTitle)
                        .putString(MediaMetadata.METADATA_KEY_ARTIST, currentArtist)
                        .putString(MediaMetadata.METADATA_KEY_ALBUM_ARTIST, currentArtist);

                if (mediaPlayer != null) {
                    try {
                        long durationMs = mediaPlayer.getDuration();
                        if (durationMs > 0) {
                            metaBuilder.putLong(MediaMetadata.METADATA_KEY_DURATION, durationMs);
                        }
                    } catch (Exception ignored) {}
                }

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
        stopProgressTracking();
        if (wakeLock != null && wakeLock.isHeld()) {
            try {
                wakeLock.release();
            } catch (Exception ignored) {}
        }
        if (mediaPlayer != null) {
            try {
                if (mediaPlayer.isPlaying()) {
                    mediaPlayer.stop();
                }
                mediaPlayer.release();
            } catch (Exception ignored) {}
            mediaPlayer = null;
        }
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
