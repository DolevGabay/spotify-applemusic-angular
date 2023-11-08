require('./loadEnvironment');
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const conn = require('./db/conn');
const appleAuth = require('./appleAuth');
const spotifyAuth = require('./spotifyAuth');
const streamers = require('./streamers');
const transfers = require('./transfers');

const PORT = process.env.PORT || 8888;
const app = express();

app.use(session({
    secret: 'matandolev', // Replace with a secure secret key
    resave: false,
    saveUninitialized: true,
  })
);

const corsOptions = {
  origin: 'http://localhost:8080',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/apple', appleAuth);
app.use('/spotify', spotifyAuth);
app.use('/streamers', streamers);
app.use('/transfers', transfers);

conn.getDb();
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
