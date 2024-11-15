import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PlaylistsComponent } from './components/playlists/playlists.component';
import { TransferComponent } from './components/transfer/transfer.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },  
  { path: 'playlists', component: PlaylistsComponent},  
  { path: 'transfer', component: TransferComponent},  
];
