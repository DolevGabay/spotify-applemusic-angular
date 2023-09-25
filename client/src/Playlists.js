import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import AppleProvider from './streamers/AppleProvider'
import SpotifyProvider from './streamers/SpotifyProvider'
import PlaylistDisplay from './PlaylistDisplay'

const streamerProviders = {
    Spotify: SpotifyProvider,
    Apple: AppleProvider
}

const Playlists = () => {
    let streamerProvider;
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
    const streamer = searchParams.get('streamer');
    
    const [userName, setUserName] = useState('');
    const [playlists, setUserPlaylists] = useState([]);

    useEffect(() => {
        
        const provider = streamerProviders[streamer];
        streamerProvider = new provider(token);

        const fetchData = async (streamerProvider) => {
            await streamerProvider.loadData();
            
            setUserName(streamerProvider.name);
            setUserPlaylists(streamerProvider.playlists);
        };

        fetchData(streamerProvider);
    }, [token, streamer]);

    return (
        <div>
             <div className="header">
                {userName && (
                    <div>
                        <h2>Hey {userName} please choose the playlist you want to move</h2>
                    </div>
                )}
            </div>
            
            <PlaylistDisplay playlists={ playlists } />
        </div>
    )
}

export default Playlists