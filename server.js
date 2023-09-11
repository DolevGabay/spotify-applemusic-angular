const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const fs = require('fs');
const crypto = require('crypto');


const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 8888;
const PRIVATE_KEY = fs.readFileSync('AuthKey_FL3PM9DXWX.p8').toString();
const TEAM_ID = 'A4VBZCQY97';
const KEY_ID = 'FL3PM9DXWX';

// Generate Apple Music Token
const generateToken = () => {
  const claims = {
    iss: TEAM_ID,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (86400 * 180)
  };

  return jwt.sign(claims, PRIVATE_KEY, {
      algorithm: 'ES256',
      header: {
        alg: 'ES256',
        kid: KEY_ID
      }
  });
}

app.get('/generate-token', (req, res) => {
      res.send({ token: generateToken() });
  });
  
console.log(`Listening on port ${port}. Go to /generate-token?key=YOUR_KEY to initiate the token generation.`);
app.listen(port);
