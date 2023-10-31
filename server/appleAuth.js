const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const fs = require('fs');

const STREAMER = 'Apple';
const PRIVATE_KEY = fs.readFileSync('AuthKey_FL3PM9DXWX.p8').toString();
const TEAM_ID = 'A4VBZCQY97';
const KEY_ID = 'FL3PM9DXWX';

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

router.get('/auth', async (req, res) => {
    const token = generateToken();
    const redirect = req.query.redirect || 'playlists';
    req.session.sourceStreamer = {
        streamer: STREAMER,
        authData: {
            token: token
        }
    }

    res.redirect(`http://localhost:8080/${req.redirect}`);
});

module.exports = router;