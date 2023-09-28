import React from 'react';
import "./ShowPlaylists.css"; 


const PlaylistDisplay = ({ playlists }) => {
    const [selectedPlaylists, setSelectedPlaylists] = React.useState([]);

    const onPlaylistClick = (index) => {
        if (selectedPlaylists.includes(index) === false) {
            setSelectedPlaylists([...selectedPlaylists, index]);
        } else {
            setSelectedPlaylists(selectedPlaylists.filter((item) => item !== index));
        }
    }

    return (
      <div className="playlist-container ">
        <div className="playlist-cards">
          {playlists.map((playlist, index) => (
            <div
              key={index}
              className={`playlist-card ${
                selectedPlaylists.includes(index) ? 'selected' : ''
              }`}
              onClick={() => onPlaylistClick(index)}
            >
              <div className="card-content">
                <img
                  src={playlist.image}
                  alt={playlist.name}
                  className="playlist-image "
                />
                <h3 className="playlist-title">{playlist.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
    
    
    
    
  };

export default PlaylistDisplay;