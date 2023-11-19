import React from "react";

const PlaylistCard = ({ playlist, selected, onClick }) => {
  return (
    <div
      className={`playlist-card ${selected ? "selected" : ""}`}
      onClick={onClick}
    >
      <div className="card-content">
        <img
          src={playlist.image}
          alt={playlist.name}
          className="playlist-image"
        />
        <h3 className="playlist-title">{playlist.name}</h3>
      </div>
    </div>
  );
};

export default PlaylistCard;
