const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  const { streamer, redirect } = req.query;

  if (!req.session[streamer]) {
    req.session[streamer] = {};
  }

  req.session.redirect = redirect;
  res.redirect(`/${streamer}/auth`);
});

module.exports = router;