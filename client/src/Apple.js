import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { apple_auth } from './spotify/apple-provider'
import ShowPlaylistsApple from './ShowPlaylistsApple';
import {getMusicInstance} from './spotify/appleAuth'

let resolvedValue;  

const getPlaylistToSpotify = async (selectedPlaylists) => {
    const playlistsReadyToSpotify = [];
    for(let i = 0 ; i < selectedPlaylists.length ; i++)
    {
        const playlistHref = "https://api.music.apple.com" + selectedPlaylists[i].href;
        let songsInPlaylist;
        let songsInPlaylistPromise = getSongsFromPlaylist(playlistHref)
        await songsInPlaylistPromise.then((value) => {
            songsInPlaylist = value;
          }).catch((error) => {
            console.error(error);
          });

        const onePlaylistInTemplate = {
            name: selectedPlaylists[i].name,
            songs: songsInPlaylist
            ,
          };
          playlistsReadyToSpotify.push(onePlaylistInTemplate);
    }
    return playlistsReadyToSpotify;
}

const getSongsFromPlaylist = async (playlistHref) => {
    try {
        const response = await axios.get(playlistHref + "/tracks", { headers: { ...resolvedValue } });
        if (response.status === 200) {
            const arrayOfSongs = [];
            const playlistData = response.data;
            //console.log(playlistData.data)
            for(let j = 0 ; j < playlistData.data.length ; j++)
            {
                let songName = playlistData.data[j].attributes.name
                let artistName = playlistData.data[j].attributes.artistName
                const newSong = {
                    name: songName,
                    artist: artistName,
                  };
                arrayOfSongs.push(newSong);  
            }
            return arrayOfSongs;
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

        headers = apple_auth.getHeader(token);
        await headers.then((value) => {
            resolvedValue = value;
          }).catch((error) => {
            console.error(error);
          });
        
          axios.get(apiEndpoint, { headers: { ...resolvedValue } })
          .then(response => {
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
