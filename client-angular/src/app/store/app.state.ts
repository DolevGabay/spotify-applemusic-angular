export interface AppState {
  originStreamer: string | null;
  destinationStreamer: string | null;
  tokens: {
    [key: string]: string | null; // Allows any string key
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
