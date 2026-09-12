const express = require("express");
const router = express.Router();

const connection = require("../DB");
const { auth } = require("../Middleware");
const fetch = require("node-fetch");

const IA_SERVICE_URL = process.env.IA_SERVICE_URL || "http://ia:8000";

router.post("/recommend", auth, async (req, res) => {
  try {
    const userId = req.token.id;

    const sqlProfil = `
      SELECT
        profession_actuelle,
        experiences_annees,
        langues,
        biographie
      FROM profil_utilisateur
      WHERE id_utilisateur = $1
    `;

    const sqlExperiences = `
      SELECT
        titre,
        description,
        "compétences",
        nom_entreprise,
        date_debut,
        date_fin
      FROM experience_utilisateur
      WHERE id_utilisateur = $1
      ORDER BY date_debut DESC
      LIMIT 5
    `;

    const sqlFormations = `
      SELECT
        titre,
        description,
        "compétences"
      FROM formation_utilisateur
      WHERE id_utilisateur = $1
      ORDER BY date_debut DESC
      LIMIT 3
    `;

    // Fetch
    const [profilResult, experiencesResult, formationsResult] =
      await Promise.all([
        connection.query(sqlProfil, [userId]),
        connection.query(sqlExperiences, [userId]),
        connection.query(sqlFormations, [userId]),
      ]);

    // Validation
    if (profilResult.rows.length === 0) {
      return res.status(400).json({
        error: "Profil introuvable. Complétez votre profil.",
      });
    }

    const profil = profilResult.rows[0];
    const experiences = experiencesResult.rows;
    const formations = formationsResult.rows;

    const hasData =
      profil.profession_actuelle ||
      experiences.length > 0 ||
      formations.length > 0;

    if (!hasData) {
      return res.status(400).json({
        error: "Profil incomplet pour les recommandations.",
      });
    }

    // Clean data
    const profession = profil.profession_actuelle || "";

    const titresExperiences = experiences
      .map((e) => e.titre || "")
      .filter(Boolean)
      .join(" ");

    const competencesExperiences = experiences
      .flatMap((e) => e["compétences"] || [])
      .filter(Boolean)
      .join(" ");

    const competencesFormations = formations
      .flatMap((f) => f["compétences"] || [])
      .filter(Boolean)
      .join(" ");

    const competences = [competencesExperiences, competencesFormations]
      .filter(Boolean)
      .join(" ");

    const descriptions = [...experiences, ...formations]
      .map((item) => item.description || "")
      .filter(Boolean)
      .join(" ");

    const texte = [
      profession.repeat(8),

      // titres d'expériences
      titresExperiences.repeat(3),

      // skills expériences + formations = énorme importance
      competences.repeat(5),

      // descriptions
      descriptions,
    ]
      .filter(Boolean)
      .join(" ")
      .trim();

    // Gestion erreur
    if (!texte || texte.length < 3) {
      return res.status(400).json({
        error: "Impossible de générer les recommandations.",
      });
    }

    // Appel service IA
    let iaResponse;

    try {
      iaResponse = await fetch(`${IA_SERVICE_URL}/recommend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ texte }),
      });
    } catch (fetchErr) {
      console.error("Service IA inaccessible :", fetchErr.message);

      return res.status(503).json({
        error: "Le service IA est temporairement indisponible.",
      });
    }

    if (!iaResponse.ok) {
      const errText = await iaResponse.text().catch(() => "");
      console.error(`Erreur IA (${iaResponse.status}) :`, errText);

      return res.status(502).json({
        error: "Erreur interne du moteur IA.",
      });
    }

    // Réussite
    const recommendations = await iaResponse.json();
    return res.status(200).json(recommendations);
  } catch (err) {
    console.error("Erreur /recommend :", err);

    return res.status(500).json({
      error: "Erreur interne du serveur.",
    });
  }
});

module.exports = router;
