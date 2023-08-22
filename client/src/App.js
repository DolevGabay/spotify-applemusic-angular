import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import Spotify from './Spotify';
const App = () => {
    return (
        <div>
        <BrowserRouter>
            <Navbar />
            <Routes>
               <Route path="/" element={<Home />} />
               <Route path="/spotify" element={<Spotify />} />
            </Routes>
        </BrowserRouter>
        </div>
    );
};

export default App;