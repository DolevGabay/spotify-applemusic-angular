// src/app/services/streamer-factory.service.ts
import { Injectable, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { SpotifyProvider } from './spotify-provider.service';
import { AppleProvider } from './apple-provider.service';
import { AppState } from '../store/app.state';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StreamerFactoryService {
  constructor(
    private store: Store<{ app: AppState }>,  
    private spotifyProvider: SpotifyProvider,
    private appleProvider: AppleProvider
  ) {}

  async getStreamer(streamer: string): Promise<SpotifyProvider | AppleProvider | null> {
    const state = await firstValueFrom(this.store.select('app'));

    const token = state?.token;

    if (!token) {
      console.error(`Token for ${streamer} not found`);
      return null;
    }

    let provider;
    if (streamer === 'Spotify') {
      provider = this.spotifyProvider;
    } else if (streamer === 'Apple') {
      provider = this.appleProvider;
    } else {
      console.error(`Unsupported streamer: ${streamer}`);
      return null;
    }

    provider.initialize(token);
    await provider.loadProfile();
    return provider;
  }
}
