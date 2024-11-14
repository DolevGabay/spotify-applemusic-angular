import { Observable } from "rxjs";

export interface MusicProvider {
  initialize(token: string): void;
  loadProfile(): Promise<void>;
  loadPlaylists(): Observable<any[]>;
  getSongsFromPlaylist(playlistId: string): Observable<any[]>;
  transferPlaylists(playlistsToTransfer: any[]): Observable<any[]>;
  createPlaylist(name: string): Observable<string | null>;
  addSongsToPlaylist(playlistId: string, songs: any[]): Observable<any[]>;
}
