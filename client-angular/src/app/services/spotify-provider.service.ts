// src/app/services/spotify-provider.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { from, Observable, of } from 'rxjs';
import { catchError, concatMap, map, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SpotifyProvider {
    private accessToken: string = "";
    private header: HttpHeaders = new HttpHeaders();
    private provider = "Spotify";
    private userId = "";
  
    constructor(private http: HttpClient) {}
  
    initialize(token: string) {
      this.accessToken = token;
      this.header = new HttpHeaders().set('Authorization', `Bearer ${this.accessToken}`);
    }
  
    loadPlaylists(): Observable<any> {
      const PLAYLIST_API = "https://api.spotify.com/v1/me/playlists";
      const DEFAULT_IMAGE_URL = "https://community.spotify.com/t5/image/serverpage/image-id/25294i2836BD1C1A31BDF2?v=v2";
  
      return this.http.get<any>(PLAYLIST_API, { headers: this.header }).pipe(
        map(data => data.items.map((playlist: any) => ({
          name: playlist.name,
          id: playlist.id,
          tracks: playlist.tracks.total,
          image: playlist.images.length > 0 ? playlist.images[0].url : DEFAULT_IMAGE_URL
        }))),
        catchError(error => {
          console.error('Error loading playlists:', error);
          return of([]);
        })
      );
    }
  
    getSongsFromPlaylist(playlistId: string): Observable<any> {
      const TRACKS_API = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
  
      return this.http.get<any>(TRACKS_API, { headers: this.header }).pipe(
        map(data => data.items.map((item: any) => ({
          name: item.track.name,
          artist: item.track.artists[0].name
        }))),
        catchError(error => {
          console.error('Failed to retrieve playlist tracks:', error);
          return of(null);
        })
      );
    }
  
    transferPlaylists(playlistsToTransfer: any[]): Observable<any[]> {
        let songsNotFoundReturn: any[] = [];
      
        return from(playlistsToTransfer).pipe(
          concatMap(playlist =>
            this.createPlaylist(playlist.name).pipe(
              concatMap(newPlaylistId => {
                if (newPlaylistId) {
                  return this.addTracksToPlaylist(newPlaylistId, playlist.songs).pipe(
                    map(songsNotFound => {
                      if (songsNotFound.length > 0) {
                        console.log('Playlist created! Songs not found:', songsNotFound);
                        songsNotFoundReturn.push({
                          playlistName: playlist.name,
                          songsNotFound: songsNotFound
                        });
                      } else {
                        console.log('Playlist created!');
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
      const CREATE_PLAYLIST_API = `https://api.spotify.com/v1/users/${this.userId}/playlists`;
  
      return this.http.post<any>(CREATE_PLAYLIST_API, { name }, { headers: this.header }).pipe(
        map(data => data.id),
        catchError(error => {
          console.error('Failed to create playlist:', error);
          return of(null);
        })
      );
    }
  
    addTracksToPlaylist(playlistId: string, songs: any[]): Observable<any[]> {
        const ADD_TRACKS_API = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
        let songsNotFound: any[] = [];
      
        return from(Promise.all(songs.map(song => 
          this.getSongUri(song).toPromise().then(songUri => {
            if (songUri === null) {
              songsNotFound.push(song);
            }
            return songUri;
          })
        ))).pipe(
          mergeMap(songUris => 
            this.http.post<any>(ADD_TRACKS_API, { uris: songUris }, { headers: this.header }).pipe(
              map(() => songsNotFound),
              catchError(error => {
                console.error('Failed to add tracks to playlist:', error);
                return of([]);
              })
            )
          )
        );
      }
      
  
    getSongUri(song: any): Observable<string | null> {
      const SONG_URI_API = `https://api.spotify.com/v1/search?q=${encodeURIComponent(song.name)} ${encodeURIComponent(song.artist)}&type=track`;
  
      return this.http.get<any>(SONG_URI_API, { headers: this.header }).pipe(
        map(data => data.tracks.items.length > 0 ? data.tracks.items[0].uri : null),
        catchError(error => {
          console.error('Failed to get song URI:', error);
          return of(null);
        })
      );
    }
  
    loadProfile(): Observable<string | null> {
      const PROFILE_API = "https://api.spotify.com/v1/me";
  
      return this.http.get<any>(PROFILE_API, { headers: this.header }).pipe(
        map(data => {
          this.userId = data.id;
          return data.display_name;
        }),
        catchError(error => {
          console.error('Failed to load profile:', error);
          return of(null);
        })
      );
    }
}
