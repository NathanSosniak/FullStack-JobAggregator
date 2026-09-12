const express = require("express");
const connection = require("../DB");
const minioClient = require("../MINIO");
const { auth } = require("../Middleware");
const upload = require("../config_multer");
const fs = require("fs");
const router = express.Router();

router.put(
  "/user/profil",
  auth,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "banner", maxCount: 1 },
    { name: "doc", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      let { bio, social, job, xp, language, docTitle, docToDelete } = req.body;

      let avatarURL;
      let bannerURL;
      let docURL;

      if (req.files?.avatar) {
        const avatar = req.files.avatar[0];

        await minioClient.fPutObject(
          "documents",
          `${req.token.id}/${avatar.filename}`,
          avatar.path,
        );

        avatarURL = `http://localhost:${process.env.PORT_BACK}/user/img/${req.token.id}/avatar/${avatar.filename}`;

        fs.unlinkSync(avatar.path);
      }

      if (req.files?.banner) {
        const banner = req.files.banner[0];

        await minioClient.fPutObject(
          "documents",
          `${req.token.id}/${banner.filename}`,
          banner.path,
        );

        bannerURL = `http://localhost:${process.env.PORT_BACK}/user/img/${req.token.id}/banner/${banner.filename}`;

        fs.unlinkSync(banner.path);
      }

      if (req.files?.doc || docToDelete) {
        // je récupère les documents enregistrés
        const sqlSelectDocumentProfilUtilisateur = `
          SELECT
              document
          FROM profil_utilisateur 
          WHERE id_utilisateur = $1
          `;
        const selectDocumentProfilUtilisateurRequest = await connection.query(
          sqlSelectDocumentProfilUtilisateur,
          [req.token.id],
        );

        // docURL = selectDocumentProfilUtilisateurRequest.rows[0].document || [];
        // MOdifier par Gabin
        // en gros la version precedenent ne permet pas d'etre securise, si c'est un string le push ne marche tout simpleemnt pas
        // on a besoin de parser la chaine de caractere qu'on recoit parce que js ne comprend pas ce que la DB lui donne c'est pas la meme
        // concretement on a `"[{\"title\":\"CV\",\"URL\":\"...\"}]"` et nous on veut `[{ title: "CV", URL: "..." }]` donc on doit le perser
        const rawDoc = selectDocumentProfilUtilisateurRequest.rows[0]?.document;
        let parsed;
        try {
          parsed = typeof rawDoc === "string" ? JSON.parse(rawDoc) : rawDoc;
        } catch {
          parsed = null;
        }
        docURL = Array.isArray(parsed) ? parsed : [];

        if (req.files?.doc) {
          const doc = req.files.doc[0];

          // j'ajoute dans minio
          await minioClient.fPutObject(
            "documents",
            `${req.token.id}/docs/${doc.filename}`,
            doc.path,
          );

          // j'ajoute dans le json de la DB
          const newDocURL = {
            title: docTitle ?? null,
            fileName: doc.filename,
            URL: `http://localhost:${process.env.PORT_BACK}/user/img/${req.token.id}/doc/${doc.filename}`,
          };

          docURL.push(newDocURL);

          fs.unlinkSync(doc.path);
        }

        if (docToDelete) {
          // je supprime dans minio
          try {
            await minioClient.removeObject(
              "documents",
              `${req.token.id}/docs/${docToDelete}`,
            );
          } catch (err) {
            console.error(err);
          }

          // je supprime dans le json de la DB
          docURL = docURL.filter((doc) => doc.fileName !== docToDelete);
          console.log(docURL);
        }
      }

      if (
        !bio ||
        !social ||
        !job ||
        !xp ||
        !language ||
        !avatarURL ||
        !bannerURL ||
        !docURL
      ) {
        const sqlSelectProfilUtilisateur = `
            SELECT
                biographie,
                plateforme,
                profession_actuelle,
                experiences_annees,
                langues,
                photo_profil,
                banniere,
                document
            FROM profil_utilisateur 
            WHERE id_utilisateur = $1
            `;
        const selectProfilUtilisateurRequest = await connection.query(
          sqlSelectProfilUtilisateur,
          [req.token.id],
        );

        if (selectProfilUtilisateurRequest.rows.length !== 0) {
          bio = bio || selectProfilUtilisateurRequest.rows[0].biographie;
          social = social || selectProfilUtilisateurRequest.rows[0].plateforme;
          job =
            job || selectProfilUtilisateurRequest.rows[0].profession_actuelle;
          xp = xp || selectProfilUtilisateurRequest.rows[0].experiences_annees;
          language = language || selectProfilUtilisateurRequest.rows[0].langues;
          avatarURL =
            avatarURL || selectProfilUtilisateurRequest.rows[0].photo_profil;
          bannerURL =
            bannerURL || selectProfilUtilisateurRequest.rows[0].banniere;
          docURL = docURL || selectProfilUtilisateurRequest.rows[0].document;

          if (typeof docURL === "string") {
            try {
              docURL = JSON.parse(docURL);
            } catch {
              docURL = [];
            }
          }
          if (!Array.isArray(docURL)) {
            docURL = [];
          }
        }
      }

      const sqlUpdateUtilisateur = `
            UPDATE
                profil_utilisateur
            SET
                biographie = $1,
                plateforme = $2,
                profession_actuelle = $3,
                experiences_annees = $4,
                langues = $5,
                photo_profil = $6,
                banniere = $7,
                document = $8::jsonb
            WHERE id_utilisateur = $9
        `;
      await connection.query(sqlUpdateUtilisateur, [
        bio,
        social,
        job,
        xp,
        language,
        avatarURL,
        bannerURL,
        docURL ? JSON.stringify(docURL) : "[]",
        req.token.id,
      ]);

      console.log("Profil user information has been modified");
      return res
        .status(200)
        .json({ msg: "Profil user information has been modified" });
    } catch (err) {
      console.error("Internal server error:", err);
      return res.status(500).json({ msg: "Internal server error" });
    }
  },
);

module.exports = router;
