const express = require("express");
const router = express.Router();
const cookieOptions = require("../cookieConfig");

router.get("/logout", (req, res) => {
  res.clearCookie("access_token", cookieOptions);
  res.clearCookie("refresh_token", cookieOptions);
  return res.status(200).json({ msg: "Logged out" });
});

module.exports = router;
