import React, { useEffect, useState } from 'react';
import "./ShowPlaylists.css"; 
import axios from 'axios';
import NotificationPopup from './NotificationPopup';
import { insertPlaylistToApple } from './Transfer'; // Adjust the path to your module
import ThinkingLogo from './ThinkingLogo';


function ShowPlaylists({userProfile, userPlaylists }) {
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  let insertFromSpotify = []; // change to useState
  const [showPopup, setShowPopup] = useState(false);
  const [showThinkLogo, setShowThinkLogo] = useState(false);

  const [invalidSongs, setInvalidSongs] = useState([]);
  let songsNotFound = [];

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

  const handlePrintSelected = async () => {
    setShowThinkLogo(true);
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
    songsNotFound = await insertPlaylistToApple(insertFromSpotify);
    setInvalidSongs(songsNotFound);
    setShowThinkLogo(false)
    setShowPopup(true)
  };

useEffect(() => {
    console.log(invalidSongs);
}, [invalidSongs]);

useEffect(() => {
}, [showThinkLogo]);

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
        <ThinkingLogo show={showThinkLogo}/>
        <NotificationPopup invalidSongs={invalidSongs} show={showPopup} />
        </div>
    </div>
  );
}

export default ShowPlaylists;
