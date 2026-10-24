#!/usr/bin/env python3
"""
Playtify YouTube Music Bridge
Powered by ytmusicapi (https://ytmusicapi.readthedocs.io/en/stable/)

Supports:
- search: query songs, artists, albums, or playlists with filters
- suggestions: instant search query auto-completion
- artist: artist profile, subscribers, description, top songs, albums, singles
- album: album tracklist, metadata, and year
- playlist: curated/user playlist details and tracks
- mood_categories: official YouTube Music mood categories
- mood_playlists: playlists for any mood category
- song: single song metadata
"""

import sys
import json
import warnings

# Suppress urllib3 warnings
warnings.filterwarnings('ignore')

try:
    from ytmusicapi import YTMusic
except ImportError:
    print(json.dumps({"error": "ytmusicapi is not installed. Run 'pip3 install ytmusicapi'"}))
    sys.exit(1)


def get_best_thumbnail(thumbnails):
    if not thumbnails or not isinstance(thumbnails, list):
        return ""
    # Return highest resolution thumbnail
    return thumbnails[-1].get("url", "")


def parse_duration(dur_str, dur_sec):
    if isinstance(dur_sec, (int, float)) and dur_sec > 0:
        return int(dur_sec)
    if not dur_str:
        return 210
    try:
        parts = str(dur_str).split(":")
        if len(parts) == 2:
            return int(parts[0]) * 60 + int(parts[1])
        elif len(parts) == 3:
            return int(parts[0]) * 3600 + int(parts[1]) * 60 + int(parts[2])
    except Exception:
        pass
    return 210


def cmd_search(query, filter_type=None, limit=20):
    try:
        yt = YTMusic()
        # Supported filters: songs, videos, albums, artists, playlists
        f = filter_type if filter_type in ["songs", "artists", "albums", "playlists", "videos"] else "songs"
        results = yt.search(query, filter=f, limit=limit)

        if f == "artists":
            artists = []
            for item in results[:limit]:
                artists.append({
                    "id": item.get("browseId", ""),
                    "name": item.get("artist", item.get("name", "Unknown")),
                    "avatar": get_best_thumbnail(item.get("thumbnails", [])),
                    "subscribers": item.get("subscribers", ""),
                    "type": "artist"
                })
            return {"artists": artists, "filter": "artists"}

        if f == "albums":
            albums = []
            for item in results[:limit]:
                artists = item.get("artists", [])
                artist_name = artists[0].get("name", "Artis") if artists else "Artis"
                albums.append({
                    "id": item.get("browseId", ""),
                    "title": item.get("title", ""),
                    "artist": artist_name,
                    "year": item.get("year", ""),
                    "thumb": get_best_thumbnail(item.get("thumbnails", [])),
                    "type": item.get("type", "Album")
                })
            return {"albums": albums, "filter": "albums"}

        if f == "playlists":
            playlists = []
            for item in results[:limit]:
                playlists.append({
                    "id": item.get("browseId", ""),
                    "title": item.get("title", ""),
                    "author": item.get("author", "YouTube Music"),
                    "itemCount": item.get("itemCount", ""),
                    "thumb": get_best_thumbnail(item.get("thumbnails", []))
                })
            return {"playlists": playlists, "filter": "playlists"}

        # Default: songs
        tracks = []
        for item in results[:limit]:
            video_id = item.get("videoId")
            if not video_id:
                continue

            title = item.get("title") or "Judul Lagu"
            artists = item.get("artists", [])
            artist_name = artists[0].get("name") if artists else "Artis"
            artist_id = artists[0].get("id") if artists else ""
            album_info = item.get("album")
            album_name = album_info.get("name") if isinstance(album_info, dict) else "Single"

            thumb = get_best_thumbnail(item.get("thumbnails", []))
            if not thumb:
                thumb = f"https://i.ytimg.com/vi/{video_id}/hqdefault.jpg"

            dur = parse_duration(item.get("duration"), item.get("duration_seconds"))

            tracks.append({
                "id": video_id,
                "title": title,
                "artist": artist_name,
                "artistId": artist_id,
                "album": album_name,
                "thumb": thumb,
                "thumbnail": thumb,
                "duration": dur,
                "source": "ytmusicapi"
            })

        return {"results": tracks, "filter": "songs"}
    except Exception as e:
        return {"error": str(e), "results": []}


def cmd_suggestions(query):
    try:
        yt = YTMusic()
        sug = yt.get_search_suggestions(query)
        return {"suggestions": sug if isinstance(sug, list) else []}
    except Exception as e:
        return {"error": str(e), "suggestions": []}


def cmd_artist(artist_name_or_id):
    try:
        yt = YTMusic()
        browse_id = artist_name_or_id

        # If name rather than channel ID, search first
        if not artist_name_or_id.startswith("UC"):
            search_res = yt.search(artist_name_or_id, filter="artists")
            if search_res and search_res[0].get("browseId"):
                browse_id = search_res[0]["browseId"]
            else:
                return {"error": "Artist not found"}

        artist = yt.get_artist(browse_id)
        avatar = get_best_thumbnail(artist.get("thumbnails", []))

        # Popular songs
        songs_raw = artist.get("songs", {}).get("results", [])
        popular_tracks = []
        for s in songs_raw:
            vid = s.get("videoId")
            if not vid:
                continue
            title = s.get("title") or "Lagu"
            artists = s.get("artists", [])
            aname = artists[0].get("name") if artists else artist.get("name", "Artis")
            album = s.get("album", {}).get("name", "Single") if isinstance(s.get("album"), dict) else "Single"
            thumb = get_best_thumbnail(s.get("thumbnails", [])) or f"https://i.ytimg.com/vi/{vid}/hqdefault.jpg"
            dur = parse_duration(s.get("duration"), None)

            popular_tracks.append({
                "id": vid,
                "title": title,
                "artist": aname,
                "album": album,
                "thumb": thumb,
                "thumbnail": thumb,
                "duration": dur,
                "source": "ytmusicapi-artist"
            })

        # Albums
        albums_raw = artist.get("albums", {}).get("results", [])
        albums = []
        for a in albums_raw:
            albums.append({
                "id": a.get("browseId", ""),
                "title": a.get("title", ""),
                "type": a.get("type", "Album"),
                "year": a.get("year", ""),
                "thumb": get_best_thumbnail(a.get("thumbnails", []))
            })

        # Singles & EPs
        singles_raw = artist.get("singles", {}).get("results", [])
        singles = []
        for s in singles_raw:
            singles.append({
                "id": s.get("browseId", ""),
                "title": s.get("title", ""),
                "type": s.get("type", "Single"),
                "year": s.get("year", ""),
                "thumb": get_best_thumbnail(s.get("thumbnails", []))
            })

        return {
            "name": artist.get("name"),
            "id": browse_id,
            "description": artist.get("description", ""),
            "subscribers": artist.get("subscribers", ""),
            "avatar": avatar,
            "popularTracks": popular_tracks,
            "albums": albums,
            "singles": singles
        }
    except Exception as e:
        return {"error": str(e)}


def cmd_album(browse_id):
    try:
        yt = YTMusic()
        alb = yt.get_album(browse_id)
        tracks = []
        for t in alb.get("tracks", []):
            vid = t.get("videoId")
            if not vid:
                continue
            dur = parse_duration(t.get("duration"), t.get("duration_seconds"))
            artists = t.get("artists", [])
            aname = artists[0].get("name", "") if artists else alb.get("artists", [{}])[0].get("name", "")
            tracks.append({
                "id": vid,
                "title": t.get("title", ""),
                "artist": aname,
                "album": alb.get("title", ""),
                "thumb": get_best_thumbnail(alb.get("thumbnails", [])) or f"https://i.ytimg.com/vi/{vid}/hqdefault.jpg",
                "thumbnail": get_best_thumbnail(alb.get("thumbnails", [])) or f"https://i.ytimg.com/vi/{vid}/hqdefault.jpg",
                "duration": dur,
                "source": "ytmusicapi-album"
            })

        return {
            "id": browse_id,
            "title": alb.get("title", ""),
            "artist": alb.get("artists", [{}])[0].get("name", ""),
            "year": alb.get("year", ""),
            "thumb": get_best_thumbnail(alb.get("thumbnails", [])),
            "tracks": tracks
        }
    except Exception as e:
        return {"error": str(e)}


def cmd_playlist(playlist_id, limit=50):
    try:
        yt = YTMusic()
        pl = yt.get_playlist(playlist_id, limit=limit)
        tracks = []
        for t in pl.get("tracks", []):
            vid = t.get("videoId")
            if not vid:
                continue
            artists = t.get("artists", [])
            aname = artists[0].get("name", "") if artists else "Artis"
            album = t.get("album", {}).get("name", "Playlist") if isinstance(t.get("album"), dict) else "Playlist"
            dur = parse_duration(t.get("duration"), t.get("duration_seconds"))
            thumb = get_best_thumbnail(t.get("thumbnails", [])) or f"https://i.ytimg.com/vi/{vid}/hqdefault.jpg"

            tracks.append({
                "id": vid,
                "title": t.get("title", "Lagu"),
                "artist": aname,
                "album": album,
                "thumb": thumb,
                "thumbnail": thumb,
                "duration": dur,
                "source": "ytmusicapi-playlist"
            })

        return {
            "id": playlist_id,
            "title": pl.get("title", "Playlist"),
            "description": pl.get("description", ""),
            "author": pl.get("author", {}).get("name", "YouTube Music") if isinstance(pl.get("author"), dict) else "YouTube Music",
            "thumb": get_best_thumbnail(pl.get("thumbnails", [])),
            "tracks": tracks
        }
    except Exception as e:
        return {"error": str(e)}


def cmd_mood_categories():
    try:
        yt = YTMusic()
        moods = yt.get_mood_categories()
        # Return cleanly formatted categories
        categories = []
        for section, items in moods.items():
            for item in items:
                categories.append({
                    "title": item.get("title", ""),
                    "params": item.get("params", ""),
                    "section": section
                })
        return {"categories": categories}
    except Exception as e:
        return {"error": str(e), "categories": []}


def cmd_mood_playlists(params):
    try:
        yt = YTMusic()
        playlists_raw = yt.get_mood_playlists(params)
        playlists = []
        for pl in playlists_raw:
            playlists.append({
                "id": pl.get("playlistId", ""),
                "title": pl.get("title", ""),
                "author": pl.get("author", [{}])[0].get("name", "YouTube Music") if isinstance(pl.get("author"), list) and pl.get("author") else "YouTube Music",
                "thumb": get_best_thumbnail(pl.get("thumbnails", []))
            })
        return {"playlists": playlists}
    except Exception as e:
        return {"error": str(e), "playlists": []}


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Usage: ytmusic_bridge.py <command> [args...]"}))
        sys.exit(1)

    command = sys.argv[1].lower()

    if command == "search":
        q = sys.argv[2] if len(sys.argv) > 2 else ""
        filt = sys.argv[3] if len(sys.argv) > 3 else "songs"
        print(json.dumps(cmd_search(q, filt)))
    elif command == "suggestions":
        q = sys.argv[2] if len(sys.argv) > 2 else ""
        print(json.dumps(cmd_suggestions(q)))
    elif command == "artist":
        name = sys.argv[2] if len(sys.argv) > 2 else ""
        print(json.dumps(cmd_artist(name)))
    elif command == "album":
        alb_id = sys.argv[2] if len(sys.argv) > 2 else ""
        print(json.dumps(cmd_album(alb_id)))
    elif command == "playlist":
        pl_id = sys.argv[2] if len(sys.argv) > 2 else ""
        print(json.dumps(cmd_playlist(pl_id)))
    elif command == "mood_categories":
        print(json.dumps(cmd_mood_categories()))
    elif command == "mood_playlists":
        params = sys.argv[2] if len(sys.argv) > 2 else ""
        print(json.dumps(cmd_mood_playlists(params)))
    else:
        print(json.dumps({"error": f"Unknown command: {command}"}))
