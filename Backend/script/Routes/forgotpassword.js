const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const connection = require("../DB");
const bcrypt = require("bcrypt");
require("dotenv").config();

// permet de configurer la fonction qui va envoyé le mail
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // false pour le port 587
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// route pour récup l'émail depuis le front
// Vérifie si un utilisateur existe avec cet email.
// Si aucun utilisateur n'est trouvé, on renvoie quand même
// une réponse positive pour des raisons de sécurité pour que le potentiel hacker ne sache pas
// afin de ne pas révéler quels emails existent dans la base.

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  if (!email || email.trim() === "") {
    return res.status(400).json({ error: "L'adresse email est requise." });
  }

  try {
    // nettoyage du mail pour éviter les mails qui vont etre envoyé soit envoyé dans le vide
    const cleanEmail = email.trim().toLowerCase();

    // recherche du mail clean de la db
    const result = await connection.query(
      "SELECT id_utilisateur, mdp FROM utilisateur WHERE LOWER(email) = $1",
      [cleanEmail],
    );

    // en gros si l'email est pas ok bah on envoie quand meme 200 au front pour un arret silencieux, securisé car hacker ne sera pas si email vrm dans la db ou non
    if (result.rows.length === 0) {
      return res
        .status(200)
        .json({ message: "Si cet email existe, un lien a été envoyé." });
    }

    const user = result.rows[0];

    // creation du token
    const secret = process.env.SECRET_KEY + user.mdp; // peremt de créer notre token via notre clé
    const token = jwt.sign(
      { id: user.id_utilisateur },
      secret,
      { expiresIn: "1h" }, //parametre du token
    );

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}&id=${user.id_utilisateur}`; //url du token envoyé par mail

    // configuration du mail
    await transporter.sendMail({
      from: `"Tech Your Job" <${process.env.MAIL_SENDER}>`,
      to: cleanEmail,
      subject: "Réinitialisation de ton mot de passe",
      html: `
        <p>Clique sur ce lien pour réinitialiser ton mot de passe.</p>
        <p>Ce lien expire dans <strong>1 heure</strong>.</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>Si tu n'es pas à l'origine de cette demande, ignore cet email.</p>
      `,
    });

    res
      .status(200)
      .json({ message: "Si cet email existe, un lien a été envoyé." });
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur ", details: error.message });
  }
});

router.post("/reset-password", async (req, res) => {
  const { token, id, password } = req.body;

  try {
    // recup user id pour avoir le hach du mdp
    const result = await connection.query(
      "SELECT id_utilisateur, mdp FROM utilisateur WHERE id_utilisateur = $1",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Utilisateur introuvable." });
    }

    const user = result.rows[0]; //stocker le 1er user

    const secret = process.env.SECRET_KEY + user.mdp;

    // verif du token
    try {
      jwt.verify(token, secret); // verifie si tkn est valide ,pas expiré, et pas modifié
    } catch (err) {
      return res
        .status(400)
        .json({ error: "Lien invalide ou expiré.", details: err.message });
    }

    // hashage du nv password
    const hashedPassword = await bcrypt.hash(password, 12);

    // ca va invalidé le token donc réussite du changement , changement du mdp directement dans la db
    await connection.query(
      "UPDATE utilisateur SET mdp = $1 WHERE id_utilisateur = $2",
      [hashedPassword, id],
    );

    res.status(200).json({ message: "Mot de passe mis à jour avec succès." });
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur.", details: error.message });
  }
});

module.exports = router;
