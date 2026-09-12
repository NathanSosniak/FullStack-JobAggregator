// const express = require("express");
// const connection = require("../../DB");
// const router = express.Router();

// // router.get("/test_post/:id", async (req, res) => {
// //   try {
// //     const id = req.params.id;

// //     if (!Number.isInteger(Number(id))) {
// //       console.error("The id parameter must be an Integer");
// //       return res
// //         .status(400)
// //         .json({ msg: "The id parameter must be an Integer" });
// //     }

// //     const sqlTEST = `
// //         SELECT
// //             consigne,
// //             date_rendue,
// //             fichier_attendues,
// //             attendues,
// //             statut
// //         FROM candidature
// //         WHERE id_poste = $1
// //     `;
// //     const sqlTESTRequest = await connection.query(sqlTEST, [id]);

// //     if (sqlTESTRequest.rows.length === 0) {
// //       console.error("0 post found");
// //       return res.status(404).json({ msg: "0 post found" });
// //     }

// //     return res.status(200).json(sqlTESTRequest.rows[0]);
// //   } catch (err) {
// //     console.error("Internal server error:", err);
// //     return res.status(500).json({ msg: "Internal server error" });
// //   }
// // });

// router.get("/test_post/:id", async (req, res) => {
//   try {
//     const id = req.params.id;

//     if (!Number.isInteger(Number(id))) {
//       return res.status(400).json({ msg: "The id parameter must be an Integer" });
//     }

//     const sqlTEST = `
//       SELECT consigne, date_rendue, fichier_attendues, attendues, statut
//       FROM candidature
//       WHERE id_poste = $1
//       ORDER BY id_utilisateur NULLS FIRST
//       LIMIT 1
//     `;
//     const result = await connection.query(sqlTEST, [id]);

//     if (result.rows.length === 0) {
//       return res.status(404).json({ msg: "0 post found" });
//     }

//     return res.status(200).json(result.rows[0]);
//   } catch (err) {
//     console.error("Internal server error:", err);
//     return res.status(500).json({ msg: "Internal server error" });
//   }
// });

// module.exports = router;

const express = require("express");
const connection = require("../../DB");
const router = express.Router();

// GET test info
router.get("/test_post/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!Number.isInteger(Number(id))) {
      return res
        .status(400)
        .json({ msg: "The id parameter must be an Integer" });
    }

    const result = await connection.query(
      `SELECT consigne, date_rendue, fichier_attendues, attendues, statut
       FROM candidature WHERE id_poste = $1
       ORDER BY id_utilisateur NULLS FIRST LIMIT 1`,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: "0 post found" });
    }

    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Internal server error:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

// PUT create/update test technique
router.put("/poste/test-technique/:id", async (req, res) => {
  const { id } = req.params;
  const { description, dateRendu, consignes, fichiersAttendus, statut } =
    req.body;

  if (!id) {
    return res.status(400).json({ error: "L'ID du poste est requis" });
  }

  try {
    const formattedDate = dateRendu === "" ? null : dateRendu;

    // try update first
    const updateResult = await connection.query(
      `UPDATE candidature 
       SET attendues = $1, date_rendue = $2, consigne = $3, fichier_attendues = $4, statut = $5
       WHERE id_poste = $6
       RETURNING id_candidature`,
      [description, formattedDate, consignes, fichiersAttendus, statut, id],
    );

    // no row — insert a template row
    if (updateResult.rowCount === 0) {
      // check poste exists
      const posteCheck = await connection.query(
        "SELECT id_poste, id_entreprise FROM poste WHERE id_poste = $1",
        [id],
      );
      if (posteCheck.rows.length === 0) {
        return res.status(404).json({ error: "Poste non trouvé" });
      }

      await connection.query(
        `INSERT INTO candidature 
         (id_utilisateur, id_poste, id_entreprise, attendues, date_rendue, consigne, fichier_attendues, statut)
         VALUES (NULL, $1, $2, $3, $4, $5, $6, $7)`,
        [
          id,
          posteCheck.rows[0].id_entreprise,
          description,
          formattedDate,
          consignes,
          fichiersAttendus,
          statut,
        ],
      );
    }

    return res
      .status(200)
      .json({ message: "Test technique enregistré avec succès !" });
  } catch (err) {
    console.error("Erreur test technique :", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
