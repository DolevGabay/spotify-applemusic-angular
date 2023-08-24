const express = require('express');
const dotenv = require('dotenv');

dotenv.config({path: './config/config.env'});

const app = express();

app.get('/', (req, res) => {
    res.send('Server running');
});

app.get('/spotify', async (req, res) => {
    const { code, state } = req.query;
    console.log(code + " + " + state)

    if (!code || !state) {
        return res.status(400).send('Missing code or state');
    }

    try {
        const tokenResponse = await axios({
            method: 'post',
            url: 'https://accounts.spotify.com/api/token',
            params: {
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: process.env.REDIRECT_URI, // Use your registered redirect URI
                code_verifier: req.session.codeVerifier, // Retrieve this from where you stored it
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${Buffer.from(
                    `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
                ).toString('base64')}`,
            },
        });

        // tokenResponse.data.access_token contains the access token
        // tokenResponse.data.refresh_token contains the refresh token

        res.send('Authorization successful!');
    } catch (error) {
        console.error('Error exchanging code for token:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running  in ${process.env.NODE_ENV} on port ${port}`));