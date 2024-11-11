// src/app/store/app.actions.ts
import { createAction, props } from '@ngrx/store';

export const startTransfer = createAction(
  '[App] Start Transfer',
  props<{ service: string }>()
);

export const login = createAction(
  '[App] Login',
  props<{ streamer: string; token: string }>()
);
