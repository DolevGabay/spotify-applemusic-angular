import axios from "axios";

const CLIENT_ID = '19fa87bff4c74ef79f1a8af8608d1d87';
const REDIRECT_URI = 'http://localhost:8888/spotify/auth';
const SCOPES = 'user-read-private user-read-email playlist-read-private playlist-read-collaborative user-library-read user-top-read user-read-recently-played user-follow-read user-follow-modify user-read-playback-state user-modify-playback-state user-read-playback-position user-read-currently-playing playlist-read-private playlist-modify-private playlist-modify-public';

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
  
async function spotifyAuth(redirect_uri = REDIRECT_URI, state = undefined) {
    const codeVerifier = generateRandomString(128);
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    let r_state = state;

    if (r_state === undefined)
    {
        r_state = generateRandomString(16); // Recommended by Spotify
    }
    const args = new URLSearchParams({
        response_type: 'code',
        client_id: CLIENT_ID,
        scope: SCOPES,
        redirect_uri: redirect_uri,
        state: r_state,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge
    });

    await axios.post('http://localhost:8888/spotify/store-code-verifier', {
        codeVerifier: codeVerifier
    });

    window.location = 'https://accounts.spotify.com/authorize?' + args;
}

async function fetchAuthCode(code) {
    let codeVerifier = localStorage.getItem('code_verifier');
    let body = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      code_verifier: codeVerifier
    });

    const response = await axios.post('https://accounts.spotify.com/api/token', {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body });
    
    const access_token = response.data.access_token;

    localStorage.setItem('access_token', access_token);
    return response;
}

export default { spotifyAuth, generateRandomString, fetchAuthCode }



  