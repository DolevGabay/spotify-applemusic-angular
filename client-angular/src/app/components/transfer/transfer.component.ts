import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AppState } from '../../store/app.state';
import { selectTransferData, selectdestinationStreamer } from '../../store/app.selectors';
import { AuthService } from '../../services/auth.service';
import { StreamerFactoryService } from '../../services/streamer-factory.service';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-transfer',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css']
})
export class TransferComponent implements OnInit {
  transferData: any;
  destination: string | null = null;

  destinationStreamer: any = null;
  isLoading: boolean = true;
  songsNotFound: any[] = [];

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private authService: AuthService,
    private streamerFactory: StreamerFactoryService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.transferData = await firstValueFrom(this.store.select(selectTransferData));
      this.destination = await firstValueFrom(this.store.select(selectdestinationStreamer));

      if (!this.destination) {
        this.router.navigate(['/']);
        return;
      }

      const authed = await this.authService.isAuthed(this.destination);

      if (authed) {
        console.log('Destination is authed');
        this.destinationStreamer = await this.streamerFactory.getStreamer(this.destination);
        if (this.destinationStreamer) {
          this.transferPlaylists();
        }
      } else {
        console.log('Destination is not authed');
        this.authService.startAuth(this.destination, 'transfer');
      }
    } catch (error) {
      console.error('Error during initialization:', error);
      this.router.navigate(['/']);
    }
  }

  async transferPlaylists(): Promise<void> {
    try {
  
      const songsNotFound = await firstValueFrom(this.destinationStreamer.transferPlaylists(this.transferData)) as any[];

      console.log('Songs not found:', songsNotFound);
      this.songsNotFound = songsNotFound;
      this.isLoading = false;
    } catch (error) {
      console.error('Error during playlist transfer:', error);
      this.isLoading = false;
    }
  }
}
