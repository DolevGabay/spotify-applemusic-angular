import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';


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
    const location = useLocation();
    const transferData = location.state.transferData;

    useEffect(() => {
        console.log(transferData);
    }, []);

    return (
        <div>
            <h1>Transfer</h1>
        </div>
    );
};

export default Transfer;