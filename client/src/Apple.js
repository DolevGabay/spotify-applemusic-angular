import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { apple_auth } from './spotify/apple-provider'
import ShowPlaylistsApple from './ShowPlaylistsApple';
import {getMusicInstance} from './spotify/appleAuth'

let resolvedValue;  

const getPlaylistToSpotify = (selectedPlaylists) => {
    const playlistHref = "https://api.music.apple.com" + selectedPlaylists.href;
    getSongsFromPlaylist(playlistHref)
}

const getSongsFromPlaylist = async (playlistHref) => {
    //console.log(resolvedValue)
    try {
        
        // Make a GET request to the playlist's API endpoint
        const response = await axios.get(playlistHref, { resolvedValue });
        if (response.status === 200) {
            // The playlist data is in response.data
            const playlistData = response.data;

            // Extract the songs from the playlistData
            const songs = playlistData.included.filter(item => item.type === 'songs');
            
            console.log(songs);
        } else {
            console.error('Error fetching playlist:', response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
};

const Apple = () => {
    const [playlistToPass, setPlaylistToPass] = useState([]);
    let userProfileInData = [];

    const getPlaylists = async (token) => {
        const apiEndpoint = 'https://api.music.apple.com/v1/me/library/playlists';
        let headers = "";
        
        await apple_auth.configure(token);
        await apple_auth.LogIn();
        console.log('Logged in successfully.');

<<<<<<< HEAD
        // Retrieve MusicKit instance
        const musicKitInstance = apple_auth.getMusicInstance();
        console.log('MusicKit instance:', musicKitInstance);

        // Create headers
        const headers = await apple_auth.getHeader(token);
        console.log('Headers:', headers);
        } catch (error) {
        console.error('An error occurred:', error);
        }


        axios.get(apiEndpoint, { headers })
        .then(response => {
            // Handle the response data (user playlists)
=======
        headers = apple_auth.getHeader(token);
        await headers.then((value) => {
            resolvedValue = value;
          }).catch((error) => {
            console.error(error);
          });
        
          axios.get(apiEndpoint, { headers: { ...resolvedValue } })
          .then(response => {
>>>>>>> a75a70f5b848c931c517443076a0f8aacd14d857
            const playlists = response.data.data;
            //console.log('User Playlists:', playlists);
            
            setIntoTemplate(playlists);
          })
          .catch(error => {
            console.error('Error fetching user playlists:', error);
          });
    };

    const setIntoTemplate = (playlists) => {
        let playlistToPassTemp = [];
        for (let i = 0 ; i< playlists.length ; i++)
        {
        let playlistObject = {
            name:playlists[i].attributes.name ,
            href: playlists[i].href,
            images: "",
          };
          playlistToPassTemp.push(playlistObject);
        }
        //console.log(playlistToPassTemp)
        setPlaylistToPass(playlistToPassTemp);
    };

    useEffect(() => {
        axios.get('http://localhost:8888/generate-token').then(res => {
            getPlaylists(res.data.token);
        }).catch(error => {
            console.log('error fetching developer token');
        });
    }, []);

    return (
        <div>
            <ShowPlaylistsApple userProfile = {userProfileInData} userPlaylists= {playlistToPass}  />
        </div>
    );
};

export { getPlaylistToSpotify };
export default Apple;
