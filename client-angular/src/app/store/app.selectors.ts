import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AppState } from './app.state';

export const selectAppState = createFeatureSelector<AppState>('app');

export const selectOriginStreamer = createSelector(
  selectAppState,
  (state: AppState) => state.originStreamer
);

export const selectdestinationStreamer = createSelector(
    selectAppState,
    (state: AppState) => state.destinationStreamer
);

export const selectTransferData = createSelector(
    selectAppState,
    (state: AppState) => state.playlistsToTransfer
);


