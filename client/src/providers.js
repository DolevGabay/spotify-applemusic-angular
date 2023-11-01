import SpotifyProvider from './streamers/SpotifyProvider'
import AppleProvider from './streamers/AppleProvider';

export const SOURCE_STREAMER_API = 'http://localhost:8888/source-streamer';
export const DEST_STREAMER_API = 'http://localhost:8888/dest-streamer';

export const streamerProviders = {
    Spotify: SpotifyProvider,
    Apple: AppleProvider
};

export const authProviders = {
    Spotify: {
        Playlist: 'http://localhost:8888/spotify/auth?redirect=playlists',
        Transfer: 'http://localhost:8888/spotify/auth?redirect=transfer'
    } ,
    Apple:  {
        Playlist: 'http://localhost:8888/apple/auth?redirect=playlists',
        Transfer: 'http://localhost:8888/apple/auth?redirect=transfer'
    }
};