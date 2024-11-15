import React, { useEffect, useState } from "react";
import { startAuth, isAuthed } from "../modules/authUtils";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getStreamer } from "../modules/providers";
import "./Transfer.css";

const Transfer = () => {
  const navigate = useNavigate();
  const transferData = useSelector((state) => state.transfer.transferData);
  const destination = useSelector((state) => state.transfer.destination);

  const [destinationStreamer, setDestinationStreamer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [songsNotFound, setSongsNotFound] = useState([]);

  const transferPlaylists = async () => {
    try {
      const songsNotFound = await destinationStreamer.transferPlaylists(
        transferData
      );
      console.log(songsNotFound);
      setSongsNotFound(songsNotFound);
      setIsLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (!destination) {
      navigate("/");
    }

    isAuthed(destination).then((authed) => {
      if (authed) {
        getStreamer(destination).then((streamer) => {
          setDestinationStreamer(streamer);
        });
      } else {
        startAuth(destination, "transfer");
      }
    });
  }, []);

  useEffect(() => {
    if (destinationStreamer) {
      transferPlaylists();
    }
  }, [destinationStreamer]);

  useEffect(() => {
    console.log(songsNotFound);
  }, [songsNotFound]);

  return (
    <div>
      {isLoading ? (
        <div className="loading-indicator">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <div className="thank-you-container">
          <h1 className="thank-you-title">Transfer is done</h1>
          <h2 className="thank-you-subtitle">
            Thanks for using Playlists Transfer!
          </h2>
          {songsNotFound.length > 0 ? (
            <div>
              <h6 className="error-message">
                There was a problem with some songs, for more info
              </h6>
              <h3 className="error-message">Songs not found:</h3>
              {songsNotFound.map((playlist, index) => (
                <div key={index}>
                  <h3>{playlist.playlistName}</h3>
                  <ul>
                    {playlist.songsNotFound.map((song, songIndex) => (
                      <li key={songIndex}>{song.name}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default Transfer;
