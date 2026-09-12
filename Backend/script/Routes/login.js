const express = require("express");
const jwt = require("jsonwebtoken");
const connection = require("../DB");
const bcrypt = require("bcrypt");

// pour faire un token correcte
const cookieOptions = require("../cookieConfig");

// cest une librairie de cyber qui sert pour les antispams faut faire npm install express-rate-limit dans le terminal backend
const rateLimit = require("express-rate-limit");

const router = express.Router();

const loginLimiter = rateLimit({
  //config de la fenetre d'interval de temps qu'on surveille, ici cest 1 secondes car 1000 milliseconde
  windowMs: 1000,

  // le nombre de requete max durant cette interval
  max: 3,

  //message envoyé au mec si bah il fait trop de requete
  message: {
    error:
      "Trop de requêtes détectées. Par mesure de sécurité, votre adresse IP est bloquée temporairement.",
  },

  // renvoie des informations dans les en tete le header
  standardHeaders: true,
  // enelve les trucs parasites
  legacyHeaders: false,
});

//  la requête passe d'abord par le limiteur sinon bah inutle
//si tout va bien ca continue le code sinon connexion coupé (grace au loginlimiter devant le async)
router.post("/login", loginLimiter, async (req, res) => {
  try {
    // je vérifie si l'utilisateur existe
    const sqlCheck = "SELECT * FROM utilisateur WHERE email = $1;";
    const checkRequest = await connection.query(sqlCheck, [req.body.email]);

    if (checkRequest.rows.length === 0) {
      console.log("Error : Invalid credentials");
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    // je vérifie si le mot de passe est bon
    const passwordVerification = await bcrypt.compare(
      req.body.password,
      checkRequest.rows[0].mdp,
    );

    if (!passwordVerification) {
      console.log("Error : Invalid credentials");
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    // je crée les tokens
    const jsonData = {
      id: checkRequest.rows[0].id_utilisateur,
      email: checkRequest.rows[0].email,
      role: checkRequest.rows[0].role,
    };

    // access token
    const access_secretKey = process.env.ACCESS_SECRET_KEY;
    const access_options = { expiresIn: "15m" };
    const access_token = jwt.sign(jsonData, access_secretKey, access_options);

    // je stocke l'access_token dans un cookie
    res.cookie("access_token", access_token, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // secondes dans 15min * 1000 car javascript compte en ms = durée de vie du cookie : de 1 heure
    });
    console.log("Access token created");

    // refresh token
    const refresh_secretKey = process.env.REFRESH_SECRET_KEY;
    const refresh_options = { expiresIn: "7d" };
    const refresh_token = jwt.sign(
      jsonData,
      refresh_secretKey,
      refresh_options,
    );

    // je stocke le refresh_token dans un cookie
    res.cookie("refresh_token", refresh_token, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    console.log("Refresh token created");

    console.log("Login succesful");
    return res.status(200).json({ msg: "Login succesful" });
  } catch (err) {
    console.error("Internal server error:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;
