import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { streamerProviders, authProviders, DEST_STREAMER_API } from './providers';

const Transfer = () => {
    const TRANSFER_INFO_API = 'http://localhost:8888/transfer-info';
    const location = useLocation();
    const [destStreamer, setDestStreamer] = useState(null);
    console.log(location.state);
    
    useEffect(() => {
        const getDestStreamer = async () => {
            try {
                const response = await axios.get(DEST_STREAMER_API, { withCredentials: true });
                console.log(response);
                const destStreamerInfo = response.data.destStreamer;
                const destStreamerObj = streamerProviders[destStreamerInfo.streamer];
                const destStreamerInstance = new destStreamerObj(destStreamerInfo.authData);
                setDestStreamer(destStreamerInstance);
            } catch (error) {
                console.log(location.state);
                const { transferData, destProvider } = location.state;
                const response = await axios.post(TRANSFER_INFO_API, { transferData }, { withCredentials: true });

                if (response.status !== 201) {
                    console.error('Error:', response.statusText);
                    return;
                }

                const authUrl = authProviders[destProvider].Transfer;
                window.location.href = authUrl;
            }
        };

        getDestStreamer();
    }, []);

    useEffect(() => {
        const transferPlaylists = async () => {
            const transferData = await axios.get(TRANSFER_INFO_API, { withCredentials: true });
            await destStreamer.loadProfile();
            await destStreamer.transferPlaylists(transferData);
        };

        if (destStreamer != null) {
            transferPlaylists();
        }
    }, [destStreamer]);

    return (
        <div>
            <h1>Transfer</h1>
        </div>
    );
};

export default Transfer;
