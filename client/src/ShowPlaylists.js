import React, { useState } from "react";
import "./ShowPlaylists.css"; 
import axios from 'axios';
import NotificationPopup from './NotificationPopup';


function ShowPlaylists({userProfile, userPlaylists }) {
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  let insertFromSpotify = []; // change to useState
  const [showPopup, setShowPopup] = useState(false);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedPlaylists([]);
    } else {
      setSelectedPlaylists([...userPlaylists.items.map((_, index) => index)]);
    }
    setSelectAll(!selectAll);
  };

  const handleCheckboxChange = (index) => {
    if (selectedPlaylists.includes(index)) {
      setSelectedPlaylists(selectedPlaylists.filter(item => item !== index));
    } else {
      setSelectedPlaylists([...selectedPlaylists, index]);
    }
  };

  const handlePrintSelected = () => {
    const selectedData = selectedPlaylists.map(index => ({
        name: userPlaylists.items[index].name,
        href: userPlaylists.items[index].href,
    }));

    //console.log("Selected Playlists:", selectedData);
    for(let i = 0 ; i < selectedData.length ; i++)
    {
        const playlistData = {
            name: selectedData[i].name,
            songs: [
            ],
          };
          
        insertFromSpotify.push(playlistData)
        //console.log(insertFromSpotify)
        getTracks(selectedData[i].href, i)
    }
    insertPlaylistToSpotify(insertFromSpotify);
  };

  const getTracks = async (playlistHref, index) => {
    const response = await fetch(playlistHref, {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('access_token')
        }
    });

    if (!response.ok) {
        throw new Error('HTTP status ' + response.status);
    }

    const data = await response.json();
    //console.log(data)
    for(let i = 0 ; i < data.tracks.items.length ; i++)
    {
        const newSong = {
            name: data.tracks.items[i].track.name,
            artist: data.tracks.items[i].track.artists[0].name,
          };
        insertFromSpotify[index].songs.push(newSong);
    }
    //console.log(insertFromSpotify)
  };

    const insertPlaylistToSpotify = async (insertToSpotify) => {
    console.log(insertToSpotify)
    for(let i = 0 ; i < insertToSpotify.length ; i++)
    {
        try {
            const response = await fetch(`https://api.spotify.com/v1/users/${userProfile.id}/playlists`, {
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
  };

  const addSongsToPlaylist = async (playlistId, songs) => {
    //todo: do it more efficiently, send them all by commas
    let allTracksAdded = true;

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
            allTracksAdded = false;
        }
    }

    if (allTracksAdded) {
        setShowPopup(true);
        setTimeout(() => {
            setShowPopup(false);
        }, 3000);
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


  return (
    <div>
        <div className="header">
            {userProfile && (
                    <div>
                        <h2>Hey {userProfile.display_name} please choose the playlist you want to move</h2>
                    </div>
                )}
        </div>
        <div className="playlist-container">
        <h2 className="playlist-header"></h2>
        <label className="choose-all-label">
            <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                className="choose-all-checkbox"
            /> Choose All
        </label>
        <ul className="playlist-cards">
            {userPlaylists.items.map((playlist, index) => (
                <li key={index} className={`playlist-card ${selectedPlaylists.includes(index) ? 'selected' : ''}`}>
                    <div className="card-content" onClick={() => handleCheckboxChange(index)}>
                        {playlist.images && playlist.images.length > 0 && (
                            <img
                                src={playlist.images[0].url}
                                alt={`${playlist.name} Image`}
                                className="playlist-image"
                            />
                        )}
                        <h3 className="playlist-title">{playlist.name}</h3>
                    </div>
                </li>
            ))}
        </ul>
        <button onClick={handlePrintSelected}>Transfer</button>
        <NotificationPopup show={showPopup} />
        </div>
    </div>
  );
}

export default ShowPlaylists;
