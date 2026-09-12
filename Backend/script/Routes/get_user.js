const express = require("express");
const connection = require("../DB");
const router = express.Router();
const { auth } = require("../Middleware");

router.get("/user", auth, async (req, res) => {
  try {
    const backend_url = process.env.NEXT_PUBLIC_API_URL;

    // infos de la table utilisateur
    const sqlSelectUtilisateur = `
            SELECT 
                id_utilisateur,
                nom,
                prenom,
                pays,
                localisation,
                latitude_secteur,
                longitude_secteur,
                role,
                email,
                telephone,
                age
            FROM utilisateur 
            WHERE id_utilisateur = $1
        `;
    const selectUtilisateurRequest = await connection.query(
      sqlSelectUtilisateur,
      [req.token.id],
    );

    // infos de la table profil_utilisateur
    const sqlSelectProfil_Utilisateur = `
            SELECT 
                id_profil,
                banniere,
                photo_profil,
                biographie,
                plateforme,
                profession_actuelle,
                experiences_annees,
                document,
                langues,
                nb_vues_profil,
                candidatures_envoyees,
                candidatures_consultees,
                candidatures_positives,
                candidatures_refusees
            FROM profil_utilisateur 
            WHERE id_utilisateur = $1
        `;
    const selectProfil_UtilisateurRequest = await connection.query(
      sqlSelectProfil_Utilisateur,
      [req.token.id],
    );

    // infos de la table experience_utilisateur
    const sqlSelectExperience_Utilisateur = `
            SELECT 
                id_experience,
                experience_utilisateur.id_entreprise,
                nom_entreprise,
                titre,
                date_debut,
                date_fin,
                description,
                compétences,
                CASE 
                    WHEN entreprise.logo IS NOT NULL AND entreprise.logo NOT LIKE 'https%'
                        THEN $2 || '/logo/' || entreprise.logo

                    ELSE 
                        entreprise.logo
                END AS logo
            FROM experience_utilisateur 
            LEFT JOIN entreprise ON experience_utilisateur.id_entreprise = entreprise.id_entreprise
            WHERE id_utilisateur = $1
        `;
    const selectExperience_UtilisateurRequest = await connection.query(
      sqlSelectExperience_Utilisateur,
      [req.token.id, backend_url],
    );

    // infos de la table formation_utilisateur
    const sqlSelectFormation_Utilisateur = `
            SELECT 
                id_formation,
                formation_utilisateur.id_entreprise,
                nom_établissement,
                titre,
                date_debut,
                date_fin,
                description,
                compétences,
                diplome,
                CASE 
                    WHEN entreprise.logo IS NOT NULL AND entreprise.logo NOT LIKE 'https%'
                        THEN $2 || '/logo/' || entreprise.logo

                    ELSE 
                        entreprise.logo
                END AS logo
            FROM formation_utilisateur 
            LEFT JOIN entreprise ON formation_utilisateur.id_entreprise = entreprise.id_entreprise
            WHERE id_utilisateur = $1
        `;
    const selectFormation_UtilisateurRequest = await connection.query(
      sqlSelectFormation_Utilisateur,
      [req.token.id, backend_url],
    );

    console.log("User data retrieved");
    return res.status(200).json({
      global: selectUtilisateurRequest.rows,
      profil: selectProfil_UtilisateurRequest.rows,
      experience: selectExperience_UtilisateurRequest.rows,
      formation: selectFormation_UtilisateurRequest.rows,
    });
  } catch (err) {
    console.error("Internal server error:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;
