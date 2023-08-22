import React from 'react';
import { useLocation } from 'react-router-dom';

const Spotify = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get('code');

    return(
        <div>
            <h1>Spotify</h1>
        </div>
    );
};

export default Spotify;