
const express = require('express');
const router = express.Router();


const ROUTES = ['source', 'dest'];

const authApis = {
    Spotify: 'http://localhost:8888/spotify/auth',
    Apple: 'http://localhost:8888/apple/auth'
}

router.post('/:route', (req, res) => {
    const { streamer, redirect } = req.body;
    const authURL = authApis[streamer];
    req.session.redirect = redirect;

    const routeParam = req.params.route;

    if (!ROUTES.includes(routeParam)) {
        return res.status(400).json({ error: 'Invalid route specified' });
    }

    if (!req.session.streamers) {
        req.session.streamers = {};
    }

    req.session.currentAuth = routeParam;
    req.session.streamers = {
        ...req.session.streamers,
        [routeParam]: {
            streamer: streamer,
            authData: {}
        }
    };

    res.json({ authURL });
});

router.get('/:route', (req, res) => {
    const routeParam = req.params.route;

    if (!ROUTES.includes(routeParam)) {
        return res.status(400).json({ error: 'Invalid route specified' });
    }
    res.status(200).json(req.session.streamers[req.params.route]);
});

module.exports = router;
