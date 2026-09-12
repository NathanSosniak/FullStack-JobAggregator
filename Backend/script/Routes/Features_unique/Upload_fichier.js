const express = require("express");
const connection = require("../../DB");
const minioClient = require("../../MINIO");
const { auth } = require("../../Middleware");
const upload = require("../../config_multer");
const fs = require("fs");
const router = express.Router();

router.put(
  "/uploadtest",
  auth,
  upload.fields([{ name: "doc", maxCount: 1 }]),
  async (req, res) => {
    try {
      const { offre_id } = req.body;

      if (!req.files?.doc) {
        return res.status(400).json({ msg: "Aucun fichier envoyé" });
      }

      const doc = req.files.doc[0];
      const minioPath = `offre_${offre_id}/user_${req.token.id}/${doc.filename}`;

      // Upload dans minio
      await minioClient.fPutObject("candidatures", minioPath, doc.path);

      // on supprime le fichier apres
      fs.unlinkSync(doc.path);

      // on met a jour la candidature
      const sql = `
        INSERT INTO candidature (id_utilisateur, id_poste, fichier_candidats)
        VALUES ($2, $3, ARRAY[$1])
        ON CONFLICT (id_utilisateur, id_poste)
        DO UPDATE SET fichier_candidats = array_append(
          COALESCE(candidature.fichier_candidats, '{}'),
          $1
        )
      `;
      await connection.query(sql, [minioPath, req.token.id, offre_id]);

      return res.status(200).json({
        msg: "Fichier uploadé",
        path: minioPath,
      });
    } catch (err) {
      console.error("Erreur upload candidature:", err);
      return res.status(500).json({ msg: "Internal server error" });
    }
  },
);

module.exports = router;
