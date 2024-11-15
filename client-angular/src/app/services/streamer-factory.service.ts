import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { SpotifyProvider } from './spotify-provider.service';
import { AppleProvider } from './apple-provider.service';
import { AppState } from '../store/app.state';
import { firstValueFrom } from 'rxjs';
import { MusicProvider } from './music-provider.interface';

@Injectable({
  providedIn: 'root'
})
export class StreamerFactoryService {
  constructor(
    private store: Store<{ app: AppState }>,  
    private spotifyProvider: SpotifyProvider,
    private appleProvider: AppleProvider
  ) {}

  async getStreamer(streamer: string): Promise<MusicProvider | null> {
    const state = await firstValueFrom(this.store.select('app'));
    const token = state.tokens[streamer];

    if (!token) {
      console.error(`Token for ${streamer} not found`);
      return null;
    }

    const provider: MusicProvider = streamer === 'Spotify' ? this.spotifyProvider : this.appleProvider;
    provider.initialize(token);
    await provider.loadProfile();
    return provider;
  }
}