export interface AppState {
  originStreamer: string | null;
  destinationStreamer: string | null;
  tokens: {
    Spotify: string | null;
    Apple: string | null;
  };
  playlistsToTransfer: any[];
}

export const initialAppState: AppState = {
  originStreamer: null,
  destinationStreamer: null,
  tokens: {
    Spotify: null,
    Apple: null
  },
  playlistsToTransfer: []
};
