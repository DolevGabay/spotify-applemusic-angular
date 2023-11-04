import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { streamerProviders, DEST_STREAMER_API } from './providers';

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
                const { streamer, authData } = response.data;
                const destStreamerObj = streamerProviders[streamer];
                const destStreamerInstance = new destStreamerObj(authData);
                setDestStreamer(destStreamerInstance);
            } catch (error) {
                const { transferData, destProvider } = location.state;
                const response = await axios.post(TRANSFER_INFO_API, { transferData }, { withCredentials: true });

                if (response.status !== 201) {
                    console.error('Error:', response.statusText);
                    return;
                }

                const authResponse = await axios.post(DEST_STREAMER_API, { streamer: destProvider, redirect: 'transfer' }, { withCredentials: true });

                const authURL = authResponse.data.authURL;
                window.location.href = authURL;
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
