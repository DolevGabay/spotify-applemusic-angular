import React, { useEffect, useState } from 'react';
import "./ShowPlaylists.css";
import axios from 'axios';
import { getPlaylistToSpotify } from './Apple';
import spotifyAuth from './spotify/spotifyAuth';
import {ShowPlaylists} from './ShowPlaylists'

function ShowPlaylistsApple({ userProfile, userPlaylists }) {
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedPlaylists([]);
    } else {
      setSelectedPlaylists([...userPlaylists.map((_, index) => index)]);
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
    let selected = [];
    for(let i = 0 ; i < userPlaylists.length ; i++)
    {
      if (selectedPlaylists.includes(i)){
        selected.push(userPlaylists[i]);
      }
    }
    let arrayToSpotify;
    let returnedArray =  getPlaylistToSpotify(selected);
    await returnedArray.then((value) => {
      arrayToSpotify = value;
    }).catch((error) => {
      console.error(error);
    });
    console.log(arrayToSpotify);
    spotifyAuth("apple");
    //console.log("here")
    //arrayToSpotify.insertPlaylistToSpotify(arrayToSpotify)
    
  };


  return (
    <div>
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
          {Array.isArray(userPlaylists) &&
            userPlaylists.map((playlist, index) => (
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
      </div>
    </div>
  );
}

export default ShowPlaylistsApple;