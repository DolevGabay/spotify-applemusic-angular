import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchAuthCode } from './spotify/spotifyAuth';


async function getProfile(accessToken) {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    });
  
    const data = await response.json();
    return data;
}

const Transfer = () => {
    useEffect(async () => {
        const location = useLocation();
        const queryParams = new URLSearchParams(location.search);
        const code = queryParams.get('code');
        const state = queryParams.get('state');
        console.log(state);

        const accessToken = await fetchAuthCode(code);
        const userData = await getProfile(accessToken);

        console.log(userData);


        
    }, []);
    return (
        <div>
            <h1>Transfer</h1>
        </div>
    );
};

export default Transfer;