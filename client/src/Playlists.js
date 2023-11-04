import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { streamerProviders, SOURCE_STREAMER_API } from "./providers";
import "./Playlists.css";
import axios from "axios";

const Playlists = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const [streamerProvider, setStreamerProvider] = useState(null);

  useEffect(() => {
    const getSourceStreamer = async () => {
      const response = await axios.get(SOURCE_STREAMER_API, {
        withCredentials: true,
      });
      
      const streamer = response.data.streamer;
      const authData = response.data.authData;

      const sourceStreamer = streamerProviders[streamer];
      const sourceStreamerInstance = new sourceStreamer(authData);
      setStreamerProvider(sourceStreamerInstance);
    };

    getSourceStreamer();
  }, []);

  useEffect(() => {
    const loadUserData = async () => {
      await streamerProvider.loadProfile();
      const userName = await streamerProvider.loadName();
      const playlists = await streamerProvider.loadPlaylists();

      setUserName(userName);
      setPlaylists(playlists);
    };

    if (streamerProvider != null) {
      loadUserData();
    }
  }, [streamerProvider]);

  const onTransferClick = async () => {
    const destProvider =
      streamerProvider.provider === "Spotify" ? "Apple" : "Spotify";
      
    const playlistsToTransfer = playlists.filter((_, index) =>
      selectedPlaylists.includes(index)
    );

    const transferData = await Promise.all(
      playlistsToTransfer.map(async (playlist) => {
        return {
          name: playlist.name,
          songs: await streamerProvider.getSongsFromPlaylist(playlist),
        };
      })
    );
    
    navigate("/transfer", { state: { transferData, destProvider } });
  };

  const onPlaylistClick = (index) => {
    if (selectedPlaylists.includes(index) === false) {
      setSelectedPlaylists([...selectedPlaylists, index]);
    } else {
      setSelectedPlaylists(selectedPlaylists.filter((item) => item !== index));
    }
  };

  return (
    <div>
      <div className="header">
        {userName && (
          <div>
            <h2>Hey {userName}, please choose the playlist you want to move</h2>
          </div>
        )}
      </div>

      <div className="playlist-container ">
        <div className="playlist-cards">
          {playlists.map((playlist, index) => (
            <div
              key={index}
              className={`playlist-card ${
                selectedPlaylists.includes(index) ? "selected" : ""
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

      {selectedPlaylists.length > 0 && (
        <div style={{ textAlign: "center", marginRight: "20px" }}>
          <a
            className="btn btn-primary shadow"
            role="button"
            onClick={onTransferClick}
          >
            Transfer
          </a>
        </div>
      )}
    </div>
  );
};

export default Playlists;
