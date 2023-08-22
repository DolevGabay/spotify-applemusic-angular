import axios from 'axios';

const CLIENT_ID = '3a13037db50d41c2bdb86e08ae7758be';
const REDIRECT_URI = 'http://localhost:3000/spotify';
const SCOPES = 'playlist-read-private playlist-read-collaborative user-read-email';

function generateRandomString(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

async function generateCodeChallenge(codeVerifier) {
    function base64encode(string) {
      return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    }
  
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
  
    return base64encode(digest);
}
  
async function spotifyAuth() {
    const codeVerifier = generateRandomString(128);
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    window.localStorage.setItem('code_verifier', codeVerifier);

    const state = generateRandomString(16); // Recommended by Spotify
    const args = new URLSearchParams({
        response_type: 'code',
        client_id: CLIENT_ID,
        scope: SCOPES,
        redirect_uri: REDIRECT_URI,
        state: state,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge
    });

    window.location = 'https://accounts.spotify.com/authorize?' + args;
}

export default spotifyAuth;



  