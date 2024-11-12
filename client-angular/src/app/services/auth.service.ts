import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { setTokens } from '../store/app.actions'; 
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.backendApi;

  constructor(private http: HttpClient, private store: Store) {}

  startAuth(streamer: String, redirect: string = 'playlists') {
    const queryString = `?streamer=${streamer}&redirect=${redirect}`;
    const url = `${this.baseUrl}/auth${queryString}`;
    window.location.href = url; 
  }

  async isAuthed(streamer: string): Promise<boolean> {
    try {
      const response = await this.http
        .get<{ token: string }>(`${this.baseUrl}/${streamer}/token`, { withCredentials: true })
        .toPromise();
  
      if (response && response.token) {
        const { token } = response;
  
        this.store.dispatch(
          setTokens({
            tokens: {
              [streamer]: token
            }
          })
        );
  
        return true;
      } else {
        console.error("No token found in response");
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  }
   
}
