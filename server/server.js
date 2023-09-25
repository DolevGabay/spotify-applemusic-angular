const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const app = express();
const appleToken = require('./appleToken');
const spotifyFallback = require('./spotifyAuth');

app.use(express.json());

app.use(session({
    secret: 'matandolev', // Replace with a secure secret key
    resave: false,
    saveUninitialized: true,
  })
);

app.use(cors());


const port = process.env.PORT || 8888;

app.use('/apple-token', appleToken);
app.use('/spotify', spotifyFallback);




app.post('/update-playlist', (req, res) => {
  const { data } = req.body;
  playlistSelectedfromApple = data;
  console.log(playlistSelectedfromApple);
  res.status(200).send('Playlist updated successfully');
});

app.get('/update-playlist', (req, res) => {
  res.status(200).json({ playlist: playlistSelectedfromApple });
});



  
console.log(`Listening on port ${port}. Go to /generate-token?key=YOUR_KEY to initiate the token generation.`);
app.listen(port);
