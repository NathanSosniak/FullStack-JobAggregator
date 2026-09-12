const express = require("express");
const fetch = require("make-fetch-happen");
const connection = require("../DB");
const fs = require("fs");
const router = express.Router();

// je récupère la ville à partir des coordonnées via une requête
// uniquement si les coordonnées ne sont pas déjà enregistrées dans le json
async function reverseGeoCoding(lat, lon, json) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&limit=1`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.length === 0 || data.error) {
    return null;
  }

  const result = [data.address.town || data.address.city, data.address.country];

  json[`${lat}, ${lon}`] = result;
  fs.writeFileSync(
    "/usr/local/app/Cache/JSON/reverseloc.json",
    JSON.stringify(json, null, 2),
  );

  return result;
}

// je récupère la latitude et longitude
async function getPlace(lat, lon) {
  const cache = JSON.parse(
    fs.readFileSync("/usr/local/app/Cache/JSON/reverseloc.json"),
  );
  if (cache[`${lat}, ${lon}`]) {
    return cache[`${lat}, ${lon}`];
  }

  return await reverseGeoCoding(lat, lon, cache);
}

// route
router.get("/post/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (!Number.isInteger(Number(id))) {
      console.error("The id parameter must be an Integer");
      return res
        .status(400)
        .json({ msg: "The id parameter must be an Integer" });
    }

    const sqlSelectFullPost = `
            SELECT
                id_poste,
                entreprise.nom_compagnie,
                poste.type_contrat,
                description,
                langues,
                remote_policy,
                frequency_remote,
                annee_experience,
                salaire_currency ,
                (salaire_min + salaire_max) / 2 || ' 000' AS salaire_moyen_annuel,
                recurrence,
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
                categorie,
                display_name_en,
                display_name_fr,
                latitude,
                longitude,
                skills,
                titre
            FROM poste 
            JOIN entreprise ON poste.id_entreprise = entreprise.id_entreprise
            WHERE id_poste = $1
        `;
    const selectFullPostRequest = await connection.query(sqlSelectFullPost, [
      id,
    ]);

    if (selectFullPostRequest.rows.length !== 0) {
      let place;

      if (
        selectFullPostRequest.rows[0].latitude &&
        selectFullPostRequest.rows[0].longitude
      ) {
        const result = await getPlace(
          selectFullPostRequest.rows[0].latitude,
          selectFullPostRequest.rows[0].longitude,
        );

        if (result) {
          place = { place: result };

          console.log("Posts found");
          return res.status(200).json({
            ...selectFullPostRequest.rows[0],
            ...place,
          });
        } else {
          place = { place: "Not found" };

          console.log("Post found, but not the place");
          return res.status(200).json({
            ...selectFullPostRequest.rows[0],
            ...place,
          });
        }
      }

      console.log("Post found");
      // return res.status(200).json(selectFullPostRequest.rows);
      return res.status(200).json(selectFullPostRequest.rows[0]);
    }

    console.error("0 post found");
    return res.status(500).json({ msg: "0 post found" });
  } catch (err) {
    console.error("Internal server error:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;
