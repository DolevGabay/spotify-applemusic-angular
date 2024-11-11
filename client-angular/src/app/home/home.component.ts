import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { startTransfer } from '../store/app.actions';
import { AppState } from '../store/app.state';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private store: Store<{ transfer: AppState }>) {}

  startTransfer(service: string): void {
    this.store.dispatch(startTransfer({ service }));
    console.log(`Starting transfer for ${service}`);
  }
}
