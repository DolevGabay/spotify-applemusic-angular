import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { StreamerFactoryService } from '../services/streamer-factory.service';
import { AppState } from '../store/app.state';
import { AuthService } from '../services/auth.service';
import { selectOriginStreamer, selectAppState } from '../store/app.selectors';
import { PlaylistCardComponent } from '../playlist-card/playlist-card.component';
import { CommonModule } from '@angular/common';
import { setPlaylistsToTransfer } from '../store/app.actions';

@Component({
  selector: 'app-playlists',
  standalone: true,
  imports: [PlaylistCardComponent, CommonModule],
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.css']
})
export class PlaylistsComponent implements OnInit, OnDestroy {
  sourceStreamer: any = null;
  sourcePlaylists: any[] = [];
  selectedPlaylists: Set<number> = new Set();
  isLoading: boolean = true;

  constructor(
    private store: Store<{ app: AppState }>,
    private router: Router,
    private authService: AuthService,
    private streamerFactory: StreamerFactoryService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      const originStreamer = await firstValueFrom(this.store.select(selectOriginStreamer));
  
      if (!originStreamer) {
        console.error('No origin streamer found');
        this.router.navigate(['/']);
        return;
      }
  
      const authed = await this.authService.isAuthed(originStreamer);
      if (authed) {
        this.sourceStreamer = await this.streamerFactory.getStreamer(originStreamer);
        this.loadPlaylists();
      } else {
        this.router.navigate(['/']);
      }
    } catch (error) {
      console.error('Error retrieving origin streamer:', error);
      this.router.navigate(['/']);
    }
  }  

  loadPlaylists(): void {
    this.sourceStreamer.loadPlaylists().subscribe(
      (playlists: any[]) => {
        this.sourcePlaylists = playlists;
        this.isLoading = false;
      },
      (error: any) => {
        this.isLoading = false;
        console.error('Error loading playlists:', error);
      }
    );
  }  

  async onTransferClick(): Promise<void> {
    const playlistsToTransfer = this.sourcePlaylists.filter((_, index) =>
      this.selectedPlaylists.has(index)
    );

    const transferData = await Promise.all(
      playlistsToTransfer.map(async (playlist: any) => ({
        name: playlist.name,
        songs: await firstValueFrom(this.sourceStreamer.getSongsFromPlaylist(playlist.id))
      }))
    );

    this.store.dispatch(setPlaylistsToTransfer({ playlistsToTransfer: transferData }));
    this.router.navigate(['/transfer']);
  }

  onPlaylistClick(index: number): void {
    if (this.selectedPlaylists.has(index)) {
      this.selectedPlaylists.delete(index);
    } else {
      this.selectedPlaylists.add(index);
    }
  }

  ngOnDestroy(): void {
    this.selectedPlaylists.clear();
  }
}
