import React, { useEffect, useState } from "react";
import { startAuth, isAuthed } from "../modules/authUtils";  
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getStreamer } from "../modules/providers";

const Transfer = () => {
  const navigate = useNavigate();
  const transferData = useSelector((state) => state.transfer.transferData);
  const destination = useSelector((state) => state.transfer.destination);
  const [destinationStreamer, setDestinationStreamer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getDestinationStreamer = async () => {
    setDestinationStreamer(await getStreamer(destination));
  };

  const transferPlaylists = async () => {
    try {
      await destinationStreamer.transferPlaylists(transferData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  }


  useEffect(() => {
    if(!destination) {
      navigate("/");
    }

    if(!isAuthed(destination)) {
      startAuth(destination);
    }

    getDestinationStreamer();
  }, []);

  useEffect(() => {
    if (destinationStreamer) {
      transferPlaylists();
    }
  }, [destinationStreamer]);

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
