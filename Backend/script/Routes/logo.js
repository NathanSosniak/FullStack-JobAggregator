const express = require("express");
const fetch = require("make-fetch-happen");
const { Buffer } = require("buffer");
const fs = require("fs");
const router = express.Router();

router.get("/logo/:domain", async (req, res) => {
  try {
    const domain = req.params.domain;
    const cache = `/usr/local/app/Cache/Images/${domain}.png`;
    const token = process.env.LOGODEV_KEY;
    const url = `https://img.logo.dev/${domain}?token=${token}&format=png`;

    if (fs.existsSync(cache)) {
      return res.status(200).sendFile(cache);
    }

    const response = await fetch(url);

    if (!response.ok) {
      return res.status(404).json({ msg: "Logo not found" });
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await fs.promises.writeFile(cache, buffer);

    return res.status(200).set("Content-Type", "image/png").send(buffer);
  } catch (err) {
    console.error("Internal server error:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;
