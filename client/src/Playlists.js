import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import AppleProvider from './streamers/AppleProvider'
import SpotifyProvider from './streamers/SpotifyProvider'
import PlaylistDisplay from './PlaylistDisplay'
import axios from 'axios';

const streamerProviders = {
    Spotify: SpotifyProvider,
    Apple: AppleProvider
}

const Playlists = () => {
    let streamerProvider;

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const uuid = searchParams.get('uuid');

    const [authData, setAuthData] = useState(null);
    const [userName, setUserName] = useState('');
    const [playlists, setUserPlaylists] = useState([]);

    useEffect(() => {
        
        const fetchAuthInfo = async () => {
            const response = await axios.get(`http://localhost:8888/get-auth-info?uuid=${uuid}`);
            console.log(response)
            setAuthData(response.data.authDataItem);
        };

        fetchAuthInfo();
    }, []);

    useEffect(() => {
        if (authData != null)  {
            console.log(authData.data);
            const provider = streamerProviders[authData.streamer];
            streamerProvider = new provider(authData.data);

            const fetchData = async (streamerProvider) => {
                await streamerProvider.loadData();
                console.log(streamerProvider.playlists);
                setUserName(streamerProvider.name);
                setUserPlaylists(streamerProvider.playlists);
            };

            fetchData(streamerProvider);
        }
    }, [authData]);

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