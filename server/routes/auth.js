const express = require("express");
const session = require("express-session");
const router = express.Router();

router.get("/", (req, res) => {
  const { streamer, redirect } = req.query;

  req.session[streamer] = {};
  req.session.redirect = redirect;
  res.redirect(`/${streamer}/auth`);
});

module.exports = router;