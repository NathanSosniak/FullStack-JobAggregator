const express = require("express");
const connection = require("../../DB");
const { auth, isAdmin } = require("../../Middleware");
const router = express.Router();

// route pour rechercher un user
router.get("/user/search", auth, isAdmin, async (req, res) => {
  try {
    const { info } = req.query;

    const sql = `
      SELECT 
        id_utilisateur,
        nom,
        prenom,
        email,
        role
      FROM utilisateur
      WHERE 
        LOWER(nom) LIKE LOWER($1)
        OR LOWER(prenom) LIKE LOWER($1)
        OR LOWER(email) LIKE LOWER($1)
      ORDER BY nom ASC
      LIMIT 20
    `;
    const result = await connection.query(sql, [`%${info}%`]);

    return res.status(200).json(result.rows);
  } catch (err) {
    console.error("Internal server error:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;
