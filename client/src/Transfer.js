import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { streamerProviders, authProviders, DEST_STREAMER_API } from './providers';

const Transfer = () => {
    const location = useLocation();
    const { transferData, destProvider } = location.state;
    const [destStreamer, setDestStreamer] = useState(null);

    useEffect(() => {
        const getDestStreamer = async () => {
            const response = await axios.get(DEST_STREAMER_API, { withCredentials: true });

            if (response.status === 404) {
                const authUrl = authProviders[destProvider];
                window.location.href = authUrl;
            }

            const destStreamerInfo = response.data.destStreamer;
            const destStreamerObj = streamerProviders[destStreamerInfo.streamer];
            const destStreamerInstance = new destStreamerObj(destStreamerInfo.authData);
            setDestStreamer(destStreamerInstance);
        };

        getDestStreamer();
    }, []);

    useEffect(() => {
        const transferPlaylists = async () => {
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
