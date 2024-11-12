import { createReducer, on } from '@ngrx/store';
import { setOrigin, setDestination, setTokens, setPlaylistsToTransfer } from './app.actions';
import { initialAppState } from './app.state';

export const appReducer = createReducer(
  initialAppState,
  on(setOrigin, (state, { originStreamer }) => ({
    ...state,
    originStreamer
  })),
  on(setDestination, (state, { destinationStreamer }) => ({
    ...state,
    destinationStreamer
  })),
  on(setTokens, (state, { tokens }) => ({
    ...state,
    tokens: {
      ...state.tokens,
      ...tokens, 
    },
  })),
  on(setPlaylistsToTransfer, (state, { playlistsToTransfer }) => ({
    ...state,
    playlistsToTransfer
  }))
);
