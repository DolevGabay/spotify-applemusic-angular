import React from 'react';

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
      <div className="container">
        <div className="row justify-content-center"> {/* Added justify-content-center */}
          {playlists.map((playlist, index) => (
            <div key={index} className={`col-md-6 item card ${selectedPlaylists.includes(index) ? 'selected' : ''}`} onClick={() => onPlaylistClick(index)} style={{ margin: '5px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img src={playlist.image} alt={playlist.name} className="img-fluid" style={{ maxWidth: '300px', maxHeight: '300px' }} />
              <div style={{ marginTop: '5px' }}>{playlist.name}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

export default PlaylistDisplay;