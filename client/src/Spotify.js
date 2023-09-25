import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import spotifyAuth from './spotify/spotifyAuth';
import axios from 'axios';
import ShowPlaylists from './ShowPlaylists';

const Spotify = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get('code');

    let accessToken; // change to useState
    const [userProfile, setUserProfile] = useState(null);
    const [userPlaylists, setUserPlaylists] = useState({ items: [] });

    const startFunction = async () => {
        if (!accessToken) {
            await spotifyAuth.fetchAuthCode(code);
            accessToken = localStorage.getItem('access_token');
            await getProfile(accessToken);
            getUserPlaylists();
        }
    };

    async function getProfile(accessToken) {
        const response = await fetch('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: 'Bearer ' + accessToken
          }
        });
      
        const data = await response.json();
        setUserProfile(data);
        return data;
    }
    
    const getUserPlaylists = async () => {
        const response = await axios.get('https://api.spotify.com/v1/me/playlists', { headers: { Authorization: 'Bearer ' + accessToken } });
        const data = response.json();
        setUserPlaylists(data);
        return data;
    };


    useEffect(() => {
        startFunction();
    }, []);

    return (
        <div>
            <ShowPlaylists userProfile={userProfile} userPlaylists={userPlaylists}/>
        </div>
    );
};

export default Spotify;
