const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
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
app.use(cors());

app.use('/apple', appleAuth);
app.use('/spotify', spotifyAuth);


app.post('/save-auth-data', (req, res) => {
  const uuid = uuidv4();
  const { streamer, data } = req.body;

  const authDataItem = {
    streamer,
    data,
  };

  authData[uuid] = authDataItem;
  res.status(200).json({ uuid });
});

app.get('/get-auth-info', (req, res) => {
  const uuid = req.query.uuid;

  const authDataItem = authData[uuid];

  res.status(200).json({ authDataItem });
});


app.post('/update-playlist', (req, res) => {
  const { data } = req.body;
  playlistSelectedfromApple = data;
  console.log(playlistSelectedfromApple);
  res.status(200).send('Playlist updated successfully');
});

app.get('/update-playlist', (req, res) => {
  res.status(200).json({ playlist: playlistSelectedfromApple });
});



const port = process.env.PORT || 8888;  
console.log(`Listening on port ${port}. Go to /generate-token?key=YOUR_KEY to initiate the token generation.`);
app.listen(port);
