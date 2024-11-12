import { createAction, props } from '@ngrx/store';

export const setOrigin = createAction(
  '[App] Set Origin',
  props<{ originStreamer: string }>()
);

export const setDestination = createAction(
  '[App] Set Destination',
  props<{ destinationStreamer: string }>()
);

export const setTokens = createAction(
  '[Auth] Set Tokens',
  props<{ tokens: Partial<{ Spotify: string; Apple: string }> }>()
);

export const setPlaylistsToTransfer = createAction(
  '[App] Set Playlists To Transfer',
  props<{ playlistsToTransfer: any[] }>()
);
