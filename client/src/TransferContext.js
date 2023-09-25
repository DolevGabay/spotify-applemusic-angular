import React from 'react';

const TransferContext = React.createContext();

export const useTransfer = () => {
    return React.useContext(TransferContext);
}

export const TransferProvider = ({ children }) => {
    const [transferSource, setTransferSource] = React.useState('');
    const [transferDestination, setTransferDestination] = React.useState('');

    const initiateTransfer = (source) => {
        setTransferSource(source);
    };

    const completeTransfer = (destination) => {
        setTransferDestination(destination);
    }

    const transferState = {
        transferSource,
        transferDestination,
        initiateTransfer,
        completeTransfer,
    };

    return (
        <TransferContext.Provider value={transferState}>
            {children}
        </TransferContext.Provider>
    )
};
    
