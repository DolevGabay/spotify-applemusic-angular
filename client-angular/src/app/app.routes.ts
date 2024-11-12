import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PlaylistsComponent } from './playlists/playlists.component';
import { TransferComponent } from './transfer/transfer.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },  
  { path: 'playlists', component: PlaylistsComponent},  
  { path: 'transfer', component: TransferComponent},  
];
