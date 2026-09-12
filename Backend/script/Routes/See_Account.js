const express = require("express");
const connection = require("../DB");
const router = express.Router();
const { auth } = require("../Middleware");

router.get("/user/:id/account", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const user_role = req.token.role;
    const backend_url = process.env.NEXT_PUBLIC_API_URL;

    console.log("sdsdsd", user_role);
    if (user_role !== "enterprise") {
      return res.status(403).json({ msg: "Accès réservé aux entreprises" });
    }

    const global = await connection.query(
      `SELECT id_utilisateur, nom, prenom, pays, localisation, role, email, telephone, age
       FROM utilisateur WHERE id_utilisateur = $1`,
      [id],
    );
    if (global.rowCount === 0) {
      return res.status(404).json({ msg: "Utilisateur non trouvé" });
    }

    const profil = await connection.query(
      `SELECT id_profil, banniere, photo_profil, biographie, plateforme,
              profession_actuelle, experiences_annees, document, langues
       FROM profil_utilisateur WHERE id_utilisateur = $1`,
      [id],
    );

    const experience = await connection.query(
      `SELECT id_experience, experience_utilisateur.id_entreprise, nom_entreprise,
              titre, date_debut, date_fin, description, compétences,
              CASE WHEN entreprise.logo IS NOT NULL AND entreprise.logo NOT LIKE 'https%'
                   THEN $2 || '/logo/' || entreprise.logo
                   ELSE entreprise.logo END AS logo
       FROM experience_utilisateur
       LEFT JOIN entreprise ON experience_utilisateur.id_entreprise = entreprise.id_entreprise
       WHERE id_utilisateur = $1`,
      [id, backend_url],
    );

    const formation = await connection.query(
      `SELECT id_formation, formation_utilisateur.id_entreprise, nom_établissement,
              titre, date_debut, date_fin, description, compétences, diplome,
              CASE WHEN entreprise.logo IS NOT NULL AND entreprise.logo NOT LIKE 'https%'
                   THEN $2 || '/logo/' || entreprise.logo
                   ELSE entreprise.logo END AS logo
       FROM formation_utilisateur
       LEFT JOIN entreprise ON formation_utilisateur.id_entreprise = entreprise.id_entreprise
       WHERE id_utilisateur = $1`,
      [id, backend_url],
    );

    return res.status(200).json({
      global: global.rows,
      profil: profil.rows,
      experience: experience.rows,
      formation: formation.rows,
    });
  } catch (err) {
    console.error("Internal server error:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;
