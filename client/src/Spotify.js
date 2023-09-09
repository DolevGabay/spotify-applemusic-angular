import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchAuthCode } from './spotify/spotifyAuth';
import axios from 'axios';
import ShowPlaylists from './ShowPlaylists';

const Spotify = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get('code');

    let accessToken; // change to useState
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

    const startFunction = async () => {
        if (!accessToken) {
            await fetchAuthCode(code);
            //console.log(`good: ${localStorage.getItem('access_token')}`)
            accessToken = localStorage.getItem('access_token');
            const data = await getProfile(accessToken);
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
       // console.log(`accessToken: ${accessToken} for getUserPlaylists`);
        const response = await fetch('https://api.spotify.com/v1/me/playlists', {
          headers: {
            Authorization: 'Bearer ' + accessToken
          }
        });
      
        const data = await response.json();
        setUserPlaylists(data);
        //console.log(data.items[0].images[0].url);
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
