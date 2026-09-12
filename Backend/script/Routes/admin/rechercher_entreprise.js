const express = require("express");
const connection = require("../../DB");
const { auth, isAdmin } = require("../../Middleware");
const router = express.Router();

// route pour rechercher un user
router.get("/entreprise/search", auth, isAdmin, async (req, res) => {
  try {
    const { info } = req.query;

    const sql = `
      SELECT 
        id_entreprise,
        nom_compagnie
      FROM entreprise
      WHERE 
        LOWER(nom_compagnie) LIKE LOWER($1)
        ORDER BY nom_compagnie ASC
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
