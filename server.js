const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
const port = process.env.PORT || 8888;

app.use(express.json());

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Read your private key from a file
const private_key = fs.readFileSync('AuthKey_FL3PM9DXWX.p8').toString();
const team_id = 'A4VBZCQY97';
const key_id = 'FL3PM9DXWX';

// Define your expected key for authentication
const token_key = crypto.randomBytes(32).toString('hex');
console.log(token_key)

// Generate Apple Music Token
const generateAppleMusicToken = () => {
  const token = jwt.sign({}, private_key, {
    algorithm: 'ES256',
    expiresIn: '180d',
    issuer: team_id,
    header: {
      alg: 'ES256',
      kid: key_id,
    },
  });
  return token;
};

app.get('/generate-token', (req, res) => {
      const appleMusicToken = generateAppleMusicToken();
      //localStorage.setItem('apple_dev_token', appleMusicToken);
      const redirectUrl = `http://localhost:8080/Apple?token=${appleMusicToken}`;
      res.redirect(redirectUrl); 
  });
  

console.log(`Listening on port ${port}. Go to /generate-token?key=YOUR_KEY to initiate the token generation.`);
app.listen(port);
