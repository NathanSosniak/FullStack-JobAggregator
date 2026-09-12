const express = require("express");
const connection = require("../DB");
const bcrypt = require("bcrypt");
const rateLimit = require("express-rate-limit");
const router = express.Router();

// 1 heure pr inscriptuon, personne abesoin de créer plus de 3 comtpe en 1 h en vrai
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // une heure en millisecondes
  max: 3, // 3 comptes créés max par heure
  message: {
    error: "Trop de comptes créés. Par mesure de sécurité, veuillez patienter.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ajout de registerLimiter juste avant le async
router.post("/register", registerLimiter, async (req, res) => {
  const client = await connection.connect();

  try {
    await client.query("BEGIN");

    const sqlCheck = "SELECT * FROM utilisateur WHERE email = $1;";
    const checkRequest = await client.query(sqlCheck, [req.body.email]);

    if (checkRequest.rows.length > 0) {
      console.error("Error : user already exists");
      return res.status(409).json({ msg: "Account already exists" });
    }

    // ajout dans la table utilisateur
    const sqlInsert = `
      INSERT INTO 
        utilisateur (nom, prenom, email, mdp, role) 
      VALUES 
        ($1, $2, $3, $4, $5)
      RETURNING
        id_utilisateur
    `;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const allowedRoles = ["user", "enterprise"];

    const role = allowedRoles.includes(req.body.role)
      ? req.body.role
      : "user";

    const values = [
      req.body.name,
      req.body.firstname,
      req.body.email,
      hashedPassword,
      role,
    ];

    const insertRequest = await client.query(sqlInsert, values);

    // ajout dans la table profil_utilisateur
    const sqlInsert2 = `
      INSERT INTO
        profil_utilisateur (id_utilisateur)
      VALUES
        ($1)
    `;
    await client.query(sqlInsert2, [insertRequest.rows[0].id_utilisateur]);

    await client.query("COMMIT");

    console.log("New registered user");
    return res.status(201).json({ msg: "New registered user" });
  } catch (err) {
    await client.query("ROLLBACK");

    console.error("Internal server error:", err);
    return res.status(500).json({ msg: "Internal server error" });
  } finally {
    client.release();
  }
});

module.exports = router;
