import SpotifyProvider from './streamers/SpotifyProvider'
import AppleProvider from './streamers/AppleProvider';

export const SOURCE_STREAMER_API = 'http://localhost:8888/streamers/source';
export const DEST_STREAMER_API = 'http://localhost:8888/streamers/dest';

export const streamerProviders = {
    Spotify: SpotifyProvider,
    Apple: AppleProvider
};