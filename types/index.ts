export interface Track {
  id: string;
  title: string;
  artist: string;
  thumb: string;
  thumbnail?: string;
  duration: number; // in seconds
  source?: string;
  album?: string;
  artistId?: string;
  badge?: string;
}

export interface CuratedPlaylist {
  id: string;
  name: string;
  title?: string;
  desc: string;
  description?: string;
  badge: string;
  thumb: string;
  cover?: string;
  gradient: string;
  color?: string;
  tracks: Track[];
}

export interface UserPlaylist {
  id: string;
  name: string;
  desc?: string;
  description?: string;
  cover?: string;
  createdAt: number;
  tracks: Track[];
}

export interface ArtistAlbum {
  id?: string;
  title: string;
  year: string;
  type: string;
  thumb: string;
  cover?: string;
}

export interface ArtistProfile {
  id?: string;
  name: string;
  verified: boolean;
  monthlyListeners: string;
  followers: string;
  rank: string;
  banner: string;
  coverImage?: string;
  avatar?: string;
  bio: string;
  writer: string;
  producer: string;
  albums: ArtistAlbum[];
  related: string[];
  tracks: Track[];
  popularTracks?: Track[];
}

export type ViewType = 'home' | 'search' | 'playlists' | 'playlist-detail' | 'queue' | 'liked' | 'now-playing' | 'artist';
