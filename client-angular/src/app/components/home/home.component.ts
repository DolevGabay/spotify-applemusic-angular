import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { setOrigin, setDestination } from '../../store/app.actions';
import { AppState } from '../../store/app.state';
import { AuthService } from '../../services/auth.service'; 
import { firstValueFrom } from 'rxjs';
import { selectAppState } from '../../store/app.selectors';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(
    private store: Store<{ app: AppState }>, 
    private authService: AuthService  
  ) {}

  async startTransfer(origin: string): Promise<void> {
    const destination = origin === 'Spotify' ? 'Apple' : 'Spotify';
    console.log(`Starting transfer for ${origin}`);
    
    this.store.dispatch(setOrigin({ originStreamer: origin }));
    this.store.dispatch(setDestination({ destinationStreamer: destination }));
  
    // Capture the state once after dispatching
    const state = await firstValueFrom(this.store.select(selectAppState));
    console.log('Updated state:', state);
  
    this.authService.startAuth(origin);
    console.log(`Starting transfer for ${origin}`);
  }
}
