import React from 'react';

const CustomNotificationPopup = ({ show }) => {
    return (
        <div id="notification-popup" className={`notification-popup ${show ? 'show' : ''}`}>
        <div className="notification-content">
            <div className="notification-icon">&#10004;</div> {/* Green checkmark symbol */}
            <div className="notification-message">All playlists have moved</div>
        </div>
        </div>
    );
};

export default CustomNotificationPopup;
