import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const Transfer = () => {
    const location = useLocation();
    const transferData = location.state.transferData;
    const transferStreamerProvider= location.state.streamerProvider;

    useEffect(() => {
        console.log(transferData);
        console.log(transferStreamerProvider);

    }, [transferData]);

    return (
        <div>
            <h1>Transfer</h1>
        </div>
    );
};

export default Transfer;
