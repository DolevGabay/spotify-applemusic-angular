// src/app/store/app.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { startTransfer, login } from './app.actions';
import { AppState, initialAppState } from './app.state';

export const appReducer = createReducer(
  initialAppState,
  on(startTransfer, (state, { service }) => ({ ...state, service })),
  on(login, (state, { streamer, token }) => ({ ...state, streamer, token }))
);
