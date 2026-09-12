const express = require("express");
const connection = require("../DB");
const { auth } = require("../Middleware");
const router = express.Router();

function toArray(val) {
  if (Array.isArray(val)) return val;
  if (typeof val === "string" && val.trim()) return [val];
  return [];
}

function normalizeText(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(",")[0]
    .replace(/\s*\(.*?\)/g, "")
    .trim()
    .replace(/[!"#$%&'()*+,./:;<=>?@[\]^_`{|}~\\-]+$/, "")
    .replace(/[!"#$%&'()*+,/:;<=>?@[\]^_`{|}~\\]/g, "")
    .replace(" ", "")
    .toLowerCase();
}

router.put("/user/formation/:id", auth, async (req, res) => {
  try {
    let { institution_name, title, start, end, description, skills, degree } =
      req.body;
    let institution_id;
    const formation_id = req.params.id;

    // je vérifie si institution_name est entré
    // si oui, je regarde s'il correspond à un établissement déjà enregistrée
    if (institution_name) {
      const sqlSelectInstitution = `
        SELECT
          id_entreprise,
          nom_compagnie
        FROM entreprise
      `;
      const selectInstitutionRequest =
        await connection.query(sqlSelectInstitution);

      const institutionFind = selectInstitutionRequest.rows.find(
        (etablissement) =>
          normalizeText(etablissement.nom_compagnie) ===
          normalizeText(institution_name),
      );

      if (institutionFind) {
        institution_name = institutionFind.nom_compagnie;
        institution_id = institutionFind.id_entreprise;
      }
    }

    if (
      !institution_name ||
      !title ||
      !start ||
      !end ||
      !description ||
      !skills ||
      !degree
    ) {
      const sqlSelectFormationUtilisateur = `
            SELECT
                id_entreprise,
                nom_établissement,
                titre,
                date_debut,
                date_fin,
                description,
                compétences,
                diplome
            FROM formation_utilisateur 
            WHERE 
                id_utilisateur = $1
            AND 
                id_formation = $2
            `;
      const selectFormationUtilisateurRequest = await connection.query(
        sqlSelectFormationUtilisateur,
        [req.token.id, formation_id],
      );

      if (selectFormationUtilisateurRequest.rows.length !== 0) {
        if (!institution_name) {
          institution_id =
            selectFormationUtilisateurRequest.rows[0].id_entreprise;
          institution_name =
            selectFormationUtilisateurRequest.rows[0].nom_établissement;
        }

        title = title || selectFormationUtilisateurRequest.rows[0].titre;
        start = start || selectFormationUtilisateurRequest.rows[0].date_debut;
        end = end || selectFormationUtilisateurRequest.rows[0].date_fin;
        description =
          description || selectFormationUtilisateurRequest.rows[0].description;
        skills =
          skills || selectFormationUtilisateurRequest.rows[0].compétences;
        degree = degree || selectFormationUtilisateurRequest.rows[0].diplome;
      }
    }

    const sqlUpdateFormationUtilisateur = `
            UPDATE
                formation_utilisateur
            SET
                id_entreprise = $1,
                nom_établissement = $2,
                titre = $3,
                date_debut = $4,
                date_fin = $5,
                description = $6,
                compétences = $7,
                diplome = $8
            WHERE 
                id_utilisateur = $9
            AND 
                id_formation = $10
        `;

    skills = Array.isArray(skills) ? skills : toArray(skills);
    degree = Array.isArray(degree) ? degree : toArray(degree);

    await connection.query(sqlUpdateFormationUtilisateur, [
      institution_id ?? null,
      institution_name,
      title,
      start,
      end,
      description,
      skills,
      degree,
      req.token.id,
      formation_id,
    ]);

    console.log("Modified user formation");
    return res.status(200).json({ msg: "Modified user formation" });
  } catch (err) {
    console.error("Internal server error:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

// =================================================================================== //

// Creer une formation
router.post("/user/formation", auth, async (req, res) => {
  try {
    const { institution_name, title, start, end, description, skills, degree } =
      req.body;

    let institution_id = null;
    if (institution_name) {
      const result = await connection.query(
        `SELECT id_entreprise, nom_compagnie FROM entreprise`,
      );
      const found = result.rows.find(
        (e) =>
          normalizeText(e.nom_compagnie) === normalizeText(institution_name),
      );
      if (found) institution_id = found.id_entreprise;
    }

    await connection.query(
      `INSERT INTO formation_utilisateur (id_utilisateur, id_entreprise, nom_établissement, titre, date_debut, date_fin, description, compétences, diplome)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        req.token.id,
        institution_id,
        institution_name ?? "",
        title ?? "",
        start || null,
        end || null,
        description ?? "",
        toArray(skills),
        toArray(degree),
      ],
    );

    return res.status(201).json({ msg: "Created user formation" });
  } catch (err) {
    console.error("Internal server error:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

// ===================================================================================//

// delete une formation
router.delete("/user/formation/:id", auth, async (req, res) => {
  try {
    const result = await connection.query(
      `DELETE FROM formation_utilisateur WHERE id_utilisateur = $1 AND id_formation = $2`,
      [req.token.id, req.params.id],
    );

    if (result.rowCount === 0)
      return res.status(404).json({ msg: "Not found" });
    return res.status(200).json({ msg: "Deleted user formation" });
  } catch (err) {
    console.error("Internal server error:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;
