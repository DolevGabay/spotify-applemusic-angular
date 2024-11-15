import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { setOrigin, setDestination } from '../../store/app.actions';
import { AppState } from '../../store/app.state';
import { AuthService } from '../../services/auth.service'; 

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

  async startTransfer(origin: string, destination: string): Promise<void> {    
    this.store.dispatch(setOrigin({ originStreamer: origin }));
    this.store.dispatch(setDestination({ destinationStreamer: destination }));
  
    this.authService.startAuth(origin);
    console.log(`Starting transfer for ${origin}`);
  }
}
