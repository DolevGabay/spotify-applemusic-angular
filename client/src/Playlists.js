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
    const [userName, setUserName] = useState('');
    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylists, setSelectedPlaylists] = useState([]);
    const [streamerProvider, setStreamerProvider] = useState(null); 

    useEffect(() => {
        const fetchSourceStreamer = async () => {
            const response = await axios.get(`http://localhost:8888/get-source-streamer`, { withCredentials: true });
            console.log(response);
            const sourceStreamerInfo = response.data.sourceStreamer;
            const sourceStreamer = streamerProviders[sourceStreamerInfo.streamer];
            const sourceStreamerInstance = new sourceStreamer(sourceStreamerInfo.data, sourceStreamerInfo.streamer);

            setStreamerProvider(sourceStreamerInstance);
        };

        fetchSourceStreamer();
    }, []);

    useEffect(() => {
        const loadUserData = async () => {
            const userName = await streamerProvider.loadName();
            const playlists = await streamerProvider.loadPlaylists();

            setUserName(userName);
            setPlaylists(playlists);
        };

        if (streamerProvider != null) {
            loadUserData();
        };

    }, [streamerProvider]);

    const onTransferClick = async () => {
        /*
        streamerProvider.getPlaylistSongs(selectedPlaylists);
        const playlistToInsert = streamerProvider.PlaylistSongsToTransfer;
        console.log(streamerProvider.PlaylistSongsToTransfer);

        let other;
        if (streamerProvider.musicApp == "Spotify"){
            other = "Apple";
        }
        if (streamerProvider.musicApp == "Apple"){
            other = "Spotify"
        }

        const provider = streamerProviders[other];
        const providerInstance = new provider("",other);
        await providerInstance.loadData();
        setOtherStreamerProvider(providerInstance);
        await providerInstance.insertPlaylist(playlistToInsert);

        */
        const transferData = {
            playlists: selectedPlaylists.map((index) => playlists[index]),
            destProvider: streamerProvider.provider === 'Spotify' ? 'Apple' : 'Spotify'
        };

        navigate('/transfer', { state: { transferData, streamerProvider } });
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