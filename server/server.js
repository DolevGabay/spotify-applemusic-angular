const express = require('express');
const cors = require('cors');
const session = require('express-session');
const app = express();
const appleAuth = require('./appleAuth');
const spotifyAuth = require('./spotifyAuth');
const { v4: uuidv4 } = require('uuid');

const authData = {};
app.use(express.json());

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

app.use('/apple', appleAuth);
app.use('/spotify', spotifyAuth);


app.get('/source-streamer', (req, res) => {
  const { sourceStreamer } = req.session;
  console.log('test');
  res.status(200).json({ sourceStreamer });
});

app.get('/dest-streamer', (req, res) => {
  const { destStreamer } = req.session;
  console.log(req.session);
  if(destStreamer === undefined) {
    res.sendStatus(404);
  } else {
    res.status(200).json({ destStreamer });
  }
});

app.post('/transfer-info', (req, res) => {
  const { transferData } = req.body;
  req.session.transferData = transferData;
  res.sendStatus(201);
});

app.get('/transfer-info', (req, res) => {
  const { transferData } = req.session;

  if(transferData === undefined) {
    res.sendStatus(404);
  } else {
    res.status(200).json({ transferData });
  }
});


app.post('/set-playlists', (req, res) => {
  const { playlists } = req.body;
  req.session.playlists = playlists;
  res.sendStatus(201);
});

const port = process.env.PORT || 8888;  
console.log(`Listening on port ${port}`);
app.listen(port);
