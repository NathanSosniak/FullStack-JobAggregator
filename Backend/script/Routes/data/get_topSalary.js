const express = require("express");
const connection = require("../../DB");
const { auth } = require("../../Middleware");
const router = express.Router();

router.get("/salary/:page", auth, async (req, res) => {
  try {
    const page = req.params.page;

    // je vérifie si la page est un entier positif
    if (!Number.isInteger(Number(page)) || page < 1) {
      console.error('The query parameter "page" must be a positive integer');
      return res
        .status(400)
        .json({ msg: 'The query parameter "page" must be a positive integer' });
    }

    // je calcule le nombre de lignes à sauter pour aller à la page désirée
    const offset = (page - 1) * 6;

    const sqlSelectSalary = `
        SELECT
            titre,
            entreprise.nom_compagnie,
            (salaire_min + salaire_max) / 2 AS salaire_annuel_moyen,
            salaire_currency,
            entreprise.id_entreprise,
            id_poste
        FROM poste 
        JOIN entreprise ON poste.id_entreprise = entreprise.id_entreprise
        WHERE (
            salaire_min IS NOT NULL
        )
        AND (
            salaire_max IS NOT NULL
        )
        AND (
            recurrence = 'year'::text
        )
        ORDER BY salaire_annuel_moyen DESC
        LIMIT 6 OFFSET $1::integer
    `;

    const selectSalaryRequest = await connection.query(sqlSelectSalary, [
      offset,
    ]);

    if (selectSalaryRequest.rows.length === 0) {
      console.error("No post found");
      return res.status(404).json({ msg: "No post found" });
    }

    console.log("Request succesful !");
    return res.status(200).json(selectSalaryRequest.rows);
  } catch (err) {
    console.error("Internal server error:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;
