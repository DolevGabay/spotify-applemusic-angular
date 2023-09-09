import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import Spotify from './Spotify';
import Contact from './Contact';
const App = () => {
    return (
        <div>
        <BrowserRouter>
            <Navbar />
            <Routes>
               <Route path="/" element={<Home />} />
               <Route path="/spotify" element={<Spotify />} />
               <Route path="/Contact" element={<Contact />} />
            </Routes>
        </BrowserRouter>
        </div>
    );
};

export default App;