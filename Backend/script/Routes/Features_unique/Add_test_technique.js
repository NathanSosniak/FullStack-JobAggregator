const express = require("express");
const connection = require("../../DB");
const router = express.Router();

router.put("/poste/test-technique/:id", async (req, res) => {
  const { id } = req.params;
  const { description, dateRendu, consignes, fichiersAttendus, statut } =
    req.body;

  if (!id) {
    return res.status(400).json({ error: "L'ID du poste est requis" });
  }

  try {
    const query = `
    UPDATE candidature 
    SET 
      attendues = $1,
      date_rendue = $2,
      consigne = $3,
      fichier_attendues = $4,
      statut = $5
    WHERE id_poste = $6
    RETURNING id_candidature, id_poste;
  `;

    const formattedDate = dateRendu === "" ? null : dateRendu;

    const values = [
      description,
      formattedDate,
      consignes,
      fichiersAttendus,
      statut,
      id,
    ];

    const result = await connection.query(query, values);

    // Si le poste n'existe pas
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Poste non trouvé" });
    }

    return res.status(200).json({
      message: "Test technique enregistré avec succès !",
      poste: result.rows[0],
    });
  } catch (err) {
    console.error("Erreur lors de la mise à jour du test technique :", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
