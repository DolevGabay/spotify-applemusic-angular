import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Contact from "./pages/Contact/Contact";
import Transfer from "./pages/Transfer";
import Playlists from "./pages/Playlists/Playlists";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store/Store"; // Updated import
import { useEffect } from "react";

useEffect(() => {
  // Store the current path in sessionStorage before redirecting
  sessionStorage.redirect = window.location.pathname.slice('/spotify-applemusic'.length);
}, []);

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <div>
          <BrowserRouter basename="/spotify-applemusic">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/transfer" element={<Transfer />} />
              <Route path="/playlists" element={<Playlists />} />
            </Routes>
          </BrowserRouter>
        </div>
      </PersistGate>
    </Provider>
  );
};

export default App;