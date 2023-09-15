import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchAuthCode } from './spotify/spotifyAuth';
import NotificationPopup from './NotificationPopup';
import ThinkingLogo from './ThinkingLogo';

let showPopup = false;

async function getProfile(accessToken) {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    });
  
    const data = await response.json();
    return data;
}

const insertPlaylistToSpotify = async (insertToSpotify,userId) => {
    //console.log(insertToSpotify)
    const added = true;
    for(let i = 0 ; i < insertToSpotify.length ; i++)
    {
        try {
            const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            },
            body: JSON.stringify({
                name: insertToSpotify[i].name,
                description: 'New playlist description',
                public: true
            })
            });
        
            if (!response.ok) {
            throw new Error('HTTP status ' + response.status);
            }
        
            const newPlaylistData = await response.json();
            addSongsToPlaylist(newPlaylistData.id,insertToSpotify[i].songs);
             
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }
    return added;
  };

  const addSongsToPlaylist = async (playlistId, songs) => {
    //todo: do it more efficiently, send them all by commas

    for (let i = 0; i < songs.length; i++) {
        const trackUri = await findSongUri(songs[i].name, songs[i].artist);

        try {
            const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
                body: JSON.stringify({
                    uris: [trackUri],
                    position: 0,
                }),
            });

            if (!response.ok) {
                throw new Error('HTTP status ' + response.status);
            }

            const data = await response.json();
            console.log('Track added to playlist:', data);
        } catch (error) {
            console.error('Error:', error);
        }
    }

};

const findSongUri = async (songName, artistName) => {
    try {
        const initialQuery = `track:${encodeURIComponent(songName)} artist:${encodeURIComponent(artistName)}`;
        const response = await fetch(`https://api.spotify.com/v1/search?q=${initialQuery}&type=track`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        });

        if (!response.ok) {
            throw new Error('HTTP status ' + response.status);
        }

        const data = await response.json();
        console.log(data);

        const items = data.tracks.items;

        if (items.length > 0) {
            const uri = items[0].uri;
            console.log("URI found:", uri);
            return uri;
        } else {
            console.log("No URI found for the given query. Retrying without artist.");

            // Retry the search without the artist
            const retryQuery = `track:${encodeURIComponent(songName)}`;
            const retryResponse = await fetch(`https://api.spotify.com/v1/search?q=${retryQuery}&type=track`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });

            if (!retryResponse.ok) {
                throw new Error('HTTP status ' + retryResponse.status);
            }

            const retryData = await retryResponse.json();
            console.log(retryData);

            const retryItems = retryData.tracks.items;

            if (retryItems.length > 0) {
                const retryUri = retryItems[0].uri;
                console.log("URI found (retry):", retryUri);
                return retryUri;
            } else {
                console.log("No URI found for the retry query either.");
                alert(songName + " not found");
                return null; // Or you can return some default value to indicate no URI was found.
            }
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
    
};


const Transfer = () => {
    const location = useLocation(); // Move this line outside of the useEffect
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get('code');
    const state = queryParams.get('state');

    const [showPopup, setShowPopup] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            await fetchAuthCode(code);
            const SpotifyAccessToken = localStorage.getItem('access_token');
            const userData = await getProfile(SpotifyAccessToken);

            fetch('http://localhost:8888/get-playlist', {
                method: 'GET',
              })
                .then((response) => {
                  if (!response.ok) {
                    throw new Error('Network response was not ok');
                  }
                  return response.json();
                })
                .then(async (data) => {
                  const playlist = data.playlist;
                  console.log('Playlist retrieved:', playlist);
                  const finish = await insertPlaylistToSpotify(playlist, userData.id)
                  setShowPopup(finish);
                  
                })
                .catch((error) => {
                  console.error('There was a problem with the fetch operation:', error);
                })
        };
        fetchData();
    }, [location]); // Pass location as a dependency to useEffect

    return (
        <div>
            <ThinkingLogo show={!showPopup}/>
             <NotificationPopup show={showPopup} />
        </div>
    );
};

export default Transfer;
