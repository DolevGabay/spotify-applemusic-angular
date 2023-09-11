import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { apple_auth } from './spotify/apple-provider'

const Apple = () => {

    const startFunction = async (token) => {
        const apiEndpoint = 'https://api.music.apple.com/v1/me/library/playlists';
        const headers = "";

        try {
        // Configure MusicKit and log in
        console.log(token)
        await apple_auth.configure(token);
        await apple_auth.LogIn();
        console.log('Logged in successfully.');

        // Retrieve MusicKit instance
        const musicKitInstance = apple_auth.getMusicInstance();
        console.log('MusicKit instance:', musicKitInstance);

        // Create headers
        const headers = apple_auth.getHeader(token);
        console.log('Headers:', headers);
        } catch (error) {
        console.error('An error occurred:', error);
        }


        axios.get(apiEndpoint, { headers })
        .then(response => {
            // Handle the response data (user playlists)
            const playlists = response.data.data;
            console.log('User Playlists:', playlists);
        })
        .catch(error => {
            // Handle errors
            console.error('Error fetching user playlists:', error);
        });

    };

    useEffect(() => {
        axios.get('http://localhost:8888/generate-token').then(res => {
            startFunction(res.data.token);

        }).catch(error => {
            console.log('error fetching developer token');
        });
        console.log('test')
    }, []);

    return (
        <div>
            <h1>apple</h1>
        </div>
    );
};

export default Apple;
