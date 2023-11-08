import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import {
  streamerProviders,
  DEST_STREAMER_API,
  TRANSFER_API,
} from "./providers";
import "./Playlists.css";

const Transfer = () => {
  const location = useLocation();
  const [destStreamer, setDestStreamer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const startDestAuth = async () => {
    const response = await axios.post(
      DEST_STREAMER_API,
      { streamer: location.state.destProvider, redirect: "transfer" },
      { withCredentials: true }
    );

    const authURL = response.data.authURL;
    window.location.href = authURL;
  };

  const getDestStreamer = async () => {
    try {
      const response = await axios.get(DEST_STREAMER_API, {
        withCredentials: true,
      });

      const { streamer, authData } = response.data;
      const destStreamerObj = streamerProviders[streamer];
      const destStreamerInstance = new destStreamerObj(authData);
      await destStreamerInstance.loadProfile();
      setDestStreamer(destStreamerInstance);
    } catch (error) {
      startDestAuth();
    }
  };

  useEffect(() => {
    if (!destStreamer) {
      getDestStreamer();
    }
  }, []);

  const transferPlaylists = async () => {
    try {
      const response = await axios.get(TRANSFER_API, {
        withCredentials: true,
      });
      await destStreamer.transferPlaylists(response.data);
      await axios.delete(TRANSFER_API, { withCredentials: true });
      setIsLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  useEffect(() => {
    if (destStreamer) {
      transferPlaylists();
    }
  }, [destStreamer]);

  return (
    <div>
      {isLoading ? (
        <div className="loading-indicator">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <h1>Transfer is done</h1>
      )}
    </div>
  );
};

export default Transfer;
