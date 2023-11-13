import SpotifyProvider from "../streamers/SpotifyProvider";
import AppleProvider from "../streamers/AppleProvider";
import { store } from "../redux/store/Store";

export const streamerProviders = {
  Spotify: SpotifyProvider,
  Apple: AppleProvider,
};

export async function getStreamer(streamer) {
  const state = store.getState();
  const token = state.auth.tokens[streamer];

  const streamerInstance = new streamerProviders[streamer](token);
  return streamerInstance;
}
