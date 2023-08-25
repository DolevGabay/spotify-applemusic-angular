import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import ShowPlaylists from './ShowPlaylists';

const Spotify = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get('code');

    const CLIENT_ID = '3a13037db50d41c2bdb86e08ae7758be';
    const REDIRECT_URI = 'http://localhost:8080/spotify';
    const codeVerifier = localStorage.getItem('code_verifier');

    const [userProfile, setUserProfile] = useState(null);
    const [userPlaylists, setUserPlaylists] = useState({
        "items": [
            {
                "name": "Playlist 1"
            },
            {
                "name": "Playlist 2"
            },
            {
                "name": "Playlist 3"
            }
        ]
    });

    const startFunction = () => {
        let body = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        code_verifier: codeVerifier
        });

        const response = fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body
        })
        .then(response => {
            if (!response.ok) {
            throw new Error('HTTP status ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem('access_token', data.access_token);
            getProfile(data.access_token);
        })
        .catch(error => {
            console.error('Error:', error);
        });

        async function getProfile(accessToken) {
            // Remove this line: let accessToken = localStorage.getItem('access_token');
        
            const response = await fetch('https://api.spotify.com/v1/me', {
                headers: {
                    Authorization: 'Bearer ' + accessToken
                }
            });
        
            const data = await response.json();
            setUserProfile(data);
            console.log(data); 
        }
    };

    const refreshToken = () => {
        let OGToken = localStorage.getItem('access_token');
        alert("here " + OGToken);
    
        let body = new URLSearchParams({
            grant_type: 'refresh_token',
            code: code,
            refresh_token: OGToken,
            client_id: CLIENT_ID,
        });
    
        fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: body
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('HTTP status ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            alert("New Access Token: " + data.access_token);
            localStorage.setItem('access_token', data.access_token);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };
    
    const getUserPlaylists = () => {
        if (userProfile) {
            const response = fetch(`https://api.spotify.com/v1/users/${userProfile.id}/playlists`, {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('access_token'),
                },
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('HTTP status ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                setUserPlaylists(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    };

    useEffect(() => {
        startFunction();
    }, []);

    useEffect(() => {
        if (userProfile) {
            console.log('User profile fetched:', userProfile);
        }
    }, [userProfile]);

    return (
        <div>
            <ShowPlaylists userProfile={userProfile} userPlaylists={userPlaylists}/>
            <button onClick={refreshToken}>Refresh Token</button>
            <button onClick={getUserPlaylists}>get playlists</button>
        </div>
    );
};

export default Spotify;
