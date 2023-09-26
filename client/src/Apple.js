import React, { useEffect, useState } from 'react';
import axios from 'axios';
import appleAuth from './apple/appleAuth';
import ShowPlaylistsApple from './ShowPlaylistsApple';

const getPlaylistToSpotify = async (selectedPlaylists, headers) => {
    const playlistsReadyToSpotify = [];
    for(let i = 0 ; i < selectedPlaylists.length ; i++)
    {
        const playlistHref = "https://api.music.apple.com" + selectedPlaylists[i].href;
        let songsInPlaylist;
        let songsInPlaylistPromise = getSongsFromPlaylist(playlistHref, headers)
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

const getSongsFromPlaylist = async (playlistHref, headers) => {
    try {
        const response = await axios.get(playlistHref + "/tracks", { headers: { ...headers } });
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
    let headers = "";

    const getPlaylists = async (token) => {
        const apiEndpoint = 'https://api.music.apple.com/v1/me/library/playlists';
        
        await appleAuth.configure(token);
        await appleAuth.LogIn();
        console.log('Logged in successfully.');

        headers = await appleAuth.getHeader(token);
        const response = await axios.get(apiEndpoint, { headers: { ...headers } });
        const playlists = response.data.data;
        setIntoTemplate(playlists);
    };

    const setIntoTemplate = (playlists) => {
        let playlistToPassTemp = [];
        for (let i = 0 ; i < playlists.length ; i++)
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

    useEffect(async () => {
        const response = await axios.get('http://localhost:8888/generate-token');
        getPlaylists(response.data.token);
    }, []);

    return (
        <div>
            <ShowPlaylistsApple userProfile = {userProfileInData} userPlaylists= {playlistToPass}  />
        </div>
    );
};

export { getPlaylistToSpotify };
export default Apple;
