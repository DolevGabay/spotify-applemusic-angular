import React, { useState } from "react";
import "./ShowPlaylists.css"; 

function ShowPlaylists({userProfile, userPlaylists }) {
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

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
    console.log("Selected Playlists:", selectedPlaylists.map(index => userPlaylists.items[index].name));
  };

  return (
    <div>
        <div>
        {userProfile && (
            <div className="header">
            <h2>Hey {userProfile.display_name}, please choose the playlist you want to move</h2>
            </div>
        )}
        </div>
        <div className="playlist-container">
        <h2 className="playlist-header">Playlists</h2>
        <label>
            <input
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAll}
            /> Choose All
        </label>
        <ul>
            {userPlaylists.items.map((playlist, index) => (
            <li key={index} className="playlist-item">
                <label>
                <input
                    type="checkbox"
                    checked={selectedPlaylists.includes(index)}
                    onChange={() => handleCheckboxChange(index)}
                />
                <span className="playlist-title">{playlist.name}</span>
                </label>
            </li>
            ))}
        </ul>
        <button onClick={handlePrintSelected}>Submit</button>
        </div>
    </div>
  );
}

export default ShowPlaylists;
