const express = require("express");
const fetch = require("make-fetch-happen");
const fs = require("fs");
const connection = require("../DB");
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

  const res = await fetch(url, {
    headers: {
      "User-Agent": "TechYourJob/1.0 (nathan.sosniak@epitech.eu)",
    },
  });
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

// route
router.get("/grouped_posts/:reverse/:start", async (req, res) => {
  try {
    const reverse = req.params.reverse;
    const start = req.params.start;
    const minsalary = req.query.minsalary;
    const maxsalary = req.query.maxsalary;
    const location = req.query.location;
    const distance = req.query.distance;
    const contract = req.query.contract;
    const remote = req.query.remote;
    const language = req.query.language;
    const experience = req.query.experience;
    const age = req.query.age;
    const backend_url = process.env.NEXT_PUBLIC_API_URL;

    // je vérifie si reverse est bien un booléen
    if (reverse !== "true" && reverse !== "false") {
      console.error("The reverse parameter must be a Boolean");
      return res
        .status(400)
        .json({ msg: "The reverse parameter must be a Boolean" });
    }

    // je vérifie si start est un entier
    if (!Number.isInteger(Number(start))) {
      console.error("The start parameter must be an Integer");
      return res
        .status(400)
        .json({ msg: "The start parameter must be an Integer" });
    }

    // j'initialise la latitude et longitude à null
    let lat;
    let lon;

    // si un lieu et une distance sont en paramètre
    // je récupère la latitude et longitude
    if (location && distance) {
      const coordinates = await getLoc(normalizeText(location));

      if (coordinates) {
        lat = parseFloat(coordinates[0]);
        lon = parseFloat(coordinates[1]);
      } else {
        console.error("Location not found");
        return res.status(500).json({ msg: "Location not found" });
      }
    }

    const sqlSelectPoste = `
            SELECT 
                id_poste,
                display_name_fr,
                entreprise.nom_compagnie,
                CASE 
                    WHEN entreprise.logo IS NOT NULL AND entreprise.logo NOT LIKE 'https%'
                        THEN $13 || '/logo/' || entreprise.logo

                    ELSE 
                        entreprise.logo
                END AS logo,
                skills,
                description,
                salaire_currency,
                (salaire_min + salaire_max) / 2 || 'K' AS salaire_annuel_moyen,
                CASE
                    WHEN NOW() - date_publication < INTERVAL '1 day'
                        THEN
                            TO_CHAR(EXTRACT(HOUR FROM (NOW() - date_publication)), 'FM00') || 'h' ||
                            TO_CHAR(EXTRACT(MINUTE FROM (NOW() - date_publication)), 'FM00')

                    WHEN NOW() - date_publication < INTERVAL '2 day'
                        THEN    
                            EXTRACT(DAY FROM (NOW() - date_publication))::int || ' jour ' ||
                            TO_CHAR(EXTRACT(HOUR FROM (NOW() - date_publication)), 'FM00') || 'h' ||
                            TO_CHAR(EXTRACT(MINUTE FROM (NOW() - date_publication)), 'FM00')

                    ELSE 
                        EXTRACT(DAY FROM (NOW() - date_publication))::int || ' jours ' ||
                        TO_CHAR(EXTRACT(HOUR FROM (NOW() - date_publication)), 'FM00') || 'h' ||
                        TO_CHAR(EXTRACT(MINUTE FROM (NOW() - date_publication)), 'FM00')
                END AS since_posted,
                latitude,
                longitude
            FROM poste 
            JOIN entreprise ON poste.id_entreprise = entreprise.id_entreprise
            WHERE 
            (
                ($1::boolean = false AND id_poste >= $2::integer)
                OR
                ($1::boolean = true AND id_poste <= $2::integer)
            )
            AND (
                $3::integer IS NULL
                OR salaire_min >= $3 
            )
            AND (
                $4::integer IS NULL
                OR salaire_max <= $4 
            )
            AND (
                $5::float8 IS NULL OR $6::float8 IS NULL OR $7::float8 IS NULL
                OR ST_DWithin(
                    geography(ST_MakePoint(longitude, latitude)),
                    geography(ST_MakePoint($5::float8, $6::float8)),
                    $7::float8 * 1000
                )
            )
            AND (
                $8::text IS NULL
                OR poste.type_contrat = $8::text
            )
            AND (
                $9::text IS NULL
                OR poste.frequency_remote = $9::text
            )
            AND (
                $10::text IS NULL
                OR langues = $10::text
            )
            AND (
                $11::integer IS NULL
                OR annee_experience <= $11::integer
            )
            AND (
                $12::integer IS NULL
                OR date_publication >= NOW() - INTERVAL '1 day' * $12::integer
            )
            ORDER BY
                CASE WHEN $1::boolean = false THEN id_poste END ASC,
                CASE WHEN $1::boolean = true  THEN id_poste END DESC
            LIMIT (
                CASE 
                    WHEN $5::float8 IS NULL OR $6::float8 IS NULL OR $7::float8 IS NULL 
                    THEN 15 
                    ELSE NULL 
                  END
                )
        `;
    // paramètre ?? null signifie :
    // est-ce que ce paramètre existe ?
    // si non, je le mets null
    const selectPosteRequest = await connection.query(sqlSelectPoste, [
      reverse,
      start,
      minsalary ?? null,
      maxsalary ?? null,
      lon ?? null,
      lat ?? null,
      distance ?? null,
      contract ?? null,
      remote ?? null,
      language ?? null,
      experience ?? null,
      age ?? null,
      backend_url,
    ]);

    // if (selectPosteRequest.rows.length === 0) {
    //   console.log("0 post found");
    //   return res.status(200).json({ msg: "0 post found" });
    // }

    if (selectPosteRequest.rows.length === 0) {
      console.log("0 post found");
    }

    console.log("Posts found");

    return res.status(200).json({
      filters: {
        entry_lat: lat ?? null,
        entry_lon: lon ?? null,
      },
      posts: selectPosteRequest.rows,
    });
  } catch (err) {
    console.error("Internal server error:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;
