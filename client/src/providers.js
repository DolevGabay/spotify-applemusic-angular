import SpotifyProvider from './streamers/SpotifyProvider'
import AppleProvider from './streamers/AppleProvider';

export const SOURCE_STREAMER_API = 'http://localhost:8888/source-streamer';
export const DEST_STREAMER_API = 'http://localhost:8888/dest-streamer';

export const streamerProviders = {
    Spotify: SpotifyProvider,
    Apple: AppleProvider
};

export const authProviders = {
    Spotify: 'http://localhost:8888/spotify/auth',
    Apple: 'http://localhost:8888/apple/auth'
};