import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
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

    const navigate = useNavigate();
    const location = useLocation();

    const uuid = new URLSearchParams(location.search).get('uuid');

    const [authData, setAuthData] = useState(null);
    const [userName, setUserName] = useState('');
    const [playlists, setUserPlaylists] = useState([]);
    const [selectedPlaylists, setSelectedPlaylists] = useState([]);

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

    const onTransferClick = () => {
        console.log(selectedPlaylists)
        const transferData = {
            playlists: selectedPlaylists.map((index) => playlists[index]),
            from: authData.streamer,
            to: authData.streamer === 'Spotify' ? 'Apple' : 'Spotify' 
        };

        navigate('/transfer', { state: { transferData } });
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