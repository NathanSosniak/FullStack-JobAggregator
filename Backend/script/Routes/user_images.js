const express = require("express");
const minioClient = require("../MINIO");
const router = express.Router();

router.get("/user/img/:id/:type/:name", async (req, res) => {
  try {
    const id = req.params.id;
    const type = req.params.type;
    const name = req.params.name;
    let stream;

    if (type === "doc") {
      stream = await minioClient.getObject("documents", `${id}/docs/${name}`);
    } else {
      stream = await minioClient.getObject("documents", `${id}/${name}`);
    }

    res.status(200);
    stream.pipe(res);
  } catch (err) {
    console.error("Internal server error:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;
