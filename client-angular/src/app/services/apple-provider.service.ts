import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, Observable, of } from 'rxjs';
import { catchError, concatMap, map, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppleProvider {
    private accessToken: string = "";
    private instance = (window as any).MusicKit;
    private header: HttpHeaders = new HttpHeaders();
  
    constructor(private http: HttpClient) {}
  
    initialize(token: string) {
      this.accessToken = token;
      this.header = new HttpHeaders({
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      });
    }
  
    loadName(): Observable<string> {
      return of('');
    }
  
    loadPlaylists(): Observable<any[]> {
        const apiEndpoint = 'https://api.music.apple.com/v1/me/library/playlists';
        console.log('header:', this.getHeaders());
        return this.http.get<any>(apiEndpoint, { headers: this.getHeaders() }).pipe(
          map(response => response.data.map((playlist: any) => ({
            name: playlist.attributes.name,
            id: playlist.id,
            image: playlist.attributes.artwork
              ? playlist.attributes.artwork.url.replace('{w}', '300').replace('{h}', '300')
              : 'https://community.spotify.com/t5/image/serverpage/image-id/25294i2836BD1C1A31BDF2?v=v2'
          }))),
          catchError(error => {
            console.error('Error loading playlists:', error);
            return of([]);
          })
        );
      }      
  
    getSongsFromPlaylist(playlistId: string): Observable<any[]> {
      const apiUrl = `https://api.music.apple.com/v1/me/library/playlists/${playlistId}/tracks`;
      return this.http.get<any>(apiUrl, { headers: this.header }).pipe(
        map(response => response.data.map((item: any) => ({
          name: item.attributes.name,
          artist: item.attributes.artistName
        }))),
        catchError(error => {
          console.error('Error fetching playlist:', error);
          return of([]);
        })
      );
    }
  
    transferPlaylists(playlistToInsert: any[]): Observable<any[]> {
        let songsNotFoundReturn: any[] = [];
      
        return from(playlistToInsert).pipe(
          concatMap(playlist =>
            this.createPlaylist(playlist.name).pipe(
              concatMap(newPlaylistId => {
                if (newPlaylistId) {
                  return this.addSongsToApplePlaylist(newPlaylistId, playlist.songs).pipe(
                    map(songsNotFound => {
                      if (songsNotFound && songsNotFound.length > 0) {
                        songsNotFoundReturn.push({
                          playlistName: playlist.name,
                          songsNotFound: songsNotFound
                        });
                      }
                      return songsNotFoundReturn;
                    })
                  );
                } else {
                  console.error(`Failed to create playlist: ${playlist.name}`);
                  return of(songsNotFoundReturn);
                }
              })
            )
          ),
          map(() => songsNotFoundReturn)
        );
      }      
  
    createPlaylist(name: string): Observable<string | null> {
      const apiUrl = `https://api.music.apple.com/v1/me/library/playlists`;
      const playlistData = { attributes: { name } };
  
      return this.http.post<any>(apiUrl, playlistData, { headers: this.header }).pipe(
        map(response => response.data[0].id),
        catchError(error => {
          console.error('Error creating playlist:', error);
          return of(null);
        })
      );
    }
  
    addSongsToApplePlaylist(playlistId: string, songs: any[]): Observable<any[]> {
      let songsNotFound: any[] = [];
      songs.forEach(async (song) => {
        const songId = await this.searchTrackInApple(song.name, song.artist).toPromise();
        if (songId) {
          await this.addTrackToPlaylist(playlistId, songId).toPromise();
        } else {
          songsNotFound.push(song);
        }
      });
  
      return of(songsNotFound);
    }
  
    addTrackToPlaylist(playlistId: string, trackId: string): Observable<void> {
      const url = `https://api.music.apple.com/v1/me/library/playlists/${playlistId}/tracks`;
      const trackData = { data: [{ type: 'songs', id: trackId }] };
  
      return this.http.post<void>(url, trackData, { headers: this.header }).pipe(
        catchError(error => {
          console.error('Error adding track to playlist:', error);
          return of();
        })
      );
    }
  
    searchTrackInApple(trackName: string, artistName: string): Observable<string | null> {
      const query = `term=${trackName}+${artistName}&types=songs&limit=1`;
      const endpoint = `https://api.music.apple.com/v1/catalog/us/search?${query}`;
  
      return this.http.get<any>(endpoint, { headers: this.header }).pipe(
        map(response => response.results.songs.data[0]?.id || null),
        catchError(error => {
          console.error('Error searching for the track:', error);
          return of(null);
        })
      );
    }
  
    async loadProfile(): Promise<void> {
        await this.configure();
    
        console.log('Configured');
        try {
          const res = await this.instance.getInstance().authorize();
        } catch (error) {
          console.error('Error authorizing:', error);
          return;
        }
    
        this.header = new HttpHeaders({
            'Authorization': `Bearer ${this.accessToken}`,
            'Music-User-Token': this.getMusicInstance().musicUserToken,
            'Content-Type': 'application/json',
          });          
    }
  
    async configure(): Promise<void> {
    this.instance.configure({
        developerToken: this.accessToken,
        app: {
        name: 'MDsolutions',
        build: '1.0',
        },
    });
    }

    getMusicInstance(){
    return this.instance.getInstance();
    }

    private getHeaders(): HttpHeaders {
        return new HttpHeaders({
          'Authorization': `Bearer ${this.accessToken}`,
          'Music-User-Token': this.getMusicInstance().musicUserToken || '',
          'Content-Type': 'application/json',
        });
      }
      
}
