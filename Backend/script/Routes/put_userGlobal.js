const express = require("express");
const connection = require("../DB");
const fetch = require("make-fetch-happen");
const { auth } = require("../Middleware");
const fs = require("fs");
const router = express.Router();

// j'enlève les accents et je mets en minuscule
function normalizeText(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

// je fais une requête vers une API externe pour avoir les coordonnées d'un lieu
// uniquement si le lieu n'est pas enregistré dans "loc.json"
async function geoCoding(location, json) {
  const url = `https://nominatim.openstreetmap.org/search?q=${location}&format=json&limit=1`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.length === 0 || data.error) {
    return null;
  }

  const result = [parseFloat(data[0].lat), parseFloat(data[0].lon)];

  json[normalizeText(data[0].name)] = result;
  fs.writeFileSync(
    "/usr/local/app/Cache/JSON/loc.json",
    JSON.stringify(json, null, 2),
  );

  return result;
}

// je récupère la latitude et longitude
async function getLoc(location) {
  const cache = JSON.parse(
    fs.readFileSync("/usr/local/app/Cache/JSON/loc.json"),
  );
  if (cache[location]) {
    return cache[location];
  }

  return await geoCoding(location, cache);
}

router.put("/user/global", auth, async (req, res) => {
  try {
    let { name, firstname, email, tel, age, country, location } = req.body;

    let lat;
    let lon;

    if (location) {
      const coordinates = await getLoc(normalizeText(location));

      if (coordinates) {
        lat = parseFloat(coordinates[0]);
        lon = parseFloat(coordinates[1]);
      }
    }

    if (
      !name ||
      !firstname ||
      !email ||
      !tel ||
      !age ||
      !country ||
      !location
    ) {
      const sqlSelectUtilisateur = `
            SELECT
                nom,
                prenom,
                email,
                telephone,
                age,
                pays,
                localisation,
                latitude_secteur,
                longitude_secteur
            FROM utilisateur 
            WHERE id_utilisateur = $1
            `;
      const selectUtilisateurRequest = await connection.query(
        sqlSelectUtilisateur,
        [req.token.id],
      );

      if (selectUtilisateurRequest.rows.length !== 0) {
        name = name || selectUtilisateurRequest.rows[0].nom;
        firstname = firstname || selectUtilisateurRequest.rows[0].prenom;
        email = email || selectUtilisateurRequest.rows[0].email;
        tel = tel || selectUtilisateurRequest.rows[0].telephone;
        age = age || selectUtilisateurRequest.rows[0].age;
        country = country || selectUtilisateurRequest.rows[0].pays;

        // je prends les anciennes latitudes et longitudes
        // seulement s'il n'y a pas de localisation rentrée
        // en effet, lat et lon peuvent être nulle même si une localisation est rentrée (si la requête échoue)
        // donc pour ne pas mélanger les anciennes coordonnées avec une nouvelle localisation
        if (!location) {
          lat = selectUtilisateurRequest.rows[0].latitude_secteur;
          lon = selectUtilisateurRequest.rows[0].longitude_secteur;
          location = selectUtilisateurRequest.rows[0].localisation;
        }
      }
    }

    const sqlUpdateUtilisateur = `
            UPDATE
                utilisateur
            SET
                nom = $1,
                prenom = $2,
                email = $3,
                telephone = $4,
                age = $5,
                pays = $6,
                localisation = $7,
                latitude_secteur = $8,
                longitude_secteur = $9
            WHERE id_utilisateur = $10
        `;
    await connection.query(sqlUpdateUtilisateur, [
      name,
      firstname,
      email,
      tel,
      age,
      country,
      location,
      lat,
      lon,
      req.token.id,
    ]);

    console.log("Global user information has been modified");
    return res
      .status(200)
      .json({ msg: "Global user information has been modified" });
  } catch (err) {
    console.error("Internal server error:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;
