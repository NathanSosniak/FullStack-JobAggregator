const express = require("express");
const connection = require("../../DB");
const { auth, isAdmin } = require("../../Middleware");
const router = express.Router();

router.delete("/post/:id", auth, isAdmin, async (req, res) => {
  try {
    const id = req.params.id;

    // je vérifie si id est un entier
    if (!Number.isInteger(Number(id))) {
      console.error("The id parameter must be an Integer");
      return res
        .status(400)
        .json({ msg: "The id parameter must be an Integer" });
    }

    const sqlDeletePost = `
            DELETE 
            FROM poste 
            WHERE id_poste = $1;
        `;
    const deletePostRequest = await connection.query(sqlDeletePost, [id]);

    if (deletePostRequest.rowCount === 0) {
      console.error("The post does not exist");
      return res.status(404).json({ msg: "The post does not exist" });
    }

    console.log("Post deleted");
    return res.status(200).json({ msg: "Post deleted" });
  } catch (err) {
    console.error("Internal server error:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;
