import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import Contact from './Contact';
import Transfer from './Transfer';
import Playlists from './Playlists';

const App = () => {
    return (
        <div>
        <BrowserRouter>
            <Navbar />
            <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/Contact" element={<Contact />} />
                    <Route path="/transfer" element={<Transfer />} />
                    <Route path="/playlists" element={<Playlists />} />
            </Routes>
        </BrowserRouter>
        </div>
    );
};

export default App;