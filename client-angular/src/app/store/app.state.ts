// src/app/store/app.state.ts
export interface AppState {
    service: string | null;
    streamer: string | null;
    token: string | null;
  }
  
  export const initialAppState: AppState = {
    service: null,
    streamer: null,
    token: null,
  };
  