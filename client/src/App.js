import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import Spotify from './Spotify';
import Contact from './Contact';
import Apple from './Apple';
import Transfer from './Transfer';
import { TransferProvider } from './TransferContext';
import Playlists from './Playlists';

const App = () => {
    return (
        <div>
        <BrowserRouter>
            <Navbar />
            <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/spotify" element={<Spotify />} />
                    <Route path="/Contact" element={<Contact />} />
                    <Route path="/Apple" element={<Apple />} />
                    <Route path="/transfer" element={<Transfer />} />
                    <Route path="/playlists" element={<Playlists />} />
            </Routes>
        </BrowserRouter>
        </div>
    );
};

export default App;