import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AppleProvider from './streamers/AppleProvider'
import SpotifyProvider from './streamers/SpotifyProvider'
import axios from 'axios';

const streamerProviders = {
    Spotify: SpotifyProvider,
    Apple: AppleProvider
}

const Playlists = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const uuid = new URLSearchParams(location.search).get('uuid');
    const [authData, setAuthData] = useState(null);
    const [userName, setUserName] = useState('');
    const [playlists, setUserPlaylists] = useState([]);
    const [selectedPlaylists, setSelectedPlaylists] = useState([]);
    const [streamerProvider, setStreamerProvider] = useState(null); 
    const [otherStreamerProvider, setOtherStreamerProvider] = useState(null); 

    useEffect(() => {
        const fetchAuthInfo = async () => {
            const response = await axios.get(`http://localhost:8888/get-auth-info?uuid=${uuid}`);
            setAuthData(response.data.authDataItem);
        };

        fetchAuthInfo();
    }, []);

    useEffect(() => {
        if (authData != null) {
            console.log(authData)
            const provider = streamerProviders[authData.streamer];
            const providerInstance = new provider(authData.data);

            const fetchData = async (providerInstance) => {
                await providerInstance.loadData();
                setUserName(providerInstance.name);
                setUserPlaylists(providerInstance.playlists);
                setStreamerProvider(providerInstance);
            };

            fetchData(providerInstance);
        }
    }, [authData]);

    const onTransferClick = async () => {
        streamerProvider.getPlaylistSongs(selectedPlaylists);
        console.log(streamerProvider.PlaylistSongsToTransfer);

        const response = await fetch('http://localhost:8888/apple/apple_access_token');
        const tokenData = await response.json();

        const provider = streamerProviders["Spotify"];
        const providerInstance = new provider(tokenData);
        console.log(providerInstance);
        await providerInstance.loadData();
        setOtherStreamerProvider(providerInstance);
        console.log(otherStreamerProvider)

        const transferData = {
            playlists: selectedPlaylists.map((index) => playlists[index]),
            from: authData.streamer,
            to: authData.streamer === 'Spotify' ? 'Apple' : 'Spotify',
        };

        //navigate('/transfer', { state: { transferData, streamerProvider } });
    };
    

    const onPlaylistClick = (index) => {
        if (selectedPlaylists.includes(index) === false) {
            setSelectedPlaylists([...selectedPlaylists, index]);
        } else {
            setSelectedPlaylists(selectedPlaylists.filter((item) => item !== index));
        }
    }

    return (
        <div>
             <div className="header">
                {userName && (
                    <div>
                        <h2>Hey {userName} please choose the playlist you want to move</h2>
                    </div>
                )}
             </div>

             <div className="playlist-container ">
                <div className="playlist-cards">
                {playlists.map((playlist, index) => (
                    <div
                    key={index}
                    className={`playlist-card ${
                        selectedPlaylists.includes(index) ? 'selected' : ''
                    }`}
                    onClick={() => onPlaylistClick(index)}
                    >
                    <div className="card-content">
                        <img
                        src={playlist.image}
                        alt={playlist.name}
                        className="playlist-image "
                        />
                        <h3 className="playlist-title">{playlist.name}</h3>
                    </div>
                    </div>
                ))}
                </div>
            </div>

            {selectedPlaylists.length > 0 && (
                <div style={{ textAlign: 'center', marginRight: '20px' }}>
                    <a className="btn btn-primary shadow" role="button" onClick={onTransferClick}>Transfer</a>
                </div>
            )}

        </div>
    )
}

export default Playlists