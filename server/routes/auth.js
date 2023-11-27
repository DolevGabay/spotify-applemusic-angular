const express = require("express");
const session = require("express-session");
const router = express.Router();

router.get("/", (req, res) => {
  const { streamer, redirect } = req.query;

  req.session[streamer] = {};
  req.session.redirect = redirect;
  console.log('Starting auth', session);
  req.session.save(err => {
    if (err) {
      // handle error
      console.error(err);
      res.status(500).send('Error saving session');
    } else {
      res.redirect(`/${streamer}/auth`);
    }
  });
});

module.exports = router;