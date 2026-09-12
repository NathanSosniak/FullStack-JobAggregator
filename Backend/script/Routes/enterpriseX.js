const express = require("express");
const connection = require("../DB");
const router = express.Router();

router.get("/enterprise/:reverse/:start", async (req, res) => {
  try {
    const reverse = req.params.reverse;
    const start = req.params.start;
    const backend_url = process.env.NEXT_PUBLIC_API_URL;
    let sectors = req.query.sectors;
    let types = req.query.types;

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

    // je transforme les sectors en liste
    if (sectors) {
      sectors = sectors.split(",");
    }

    // je transforme les types en liste
    if (types) {
      types = types.split(",");
    }

    const sqlSelectEntreprise = `
            SELECT 
                id_entreprise,
                type_contrat,
                nom_compagnie,
                seo_alias,
                CASE 
                    WHEN logo IS NOT NULL AND logo NOT LIKE 'https%'
                        THEN $5 || '/logo/' || logo

                    ELSE 
                        logo
                    END AS logo,
                type_entreprise,
                secteur_entreprise,
                ville,
                nb_offre,
                nb_visit,
                nb_postulation,
                nb_click,
                score,
                rank,
                COALESCE(
                    (
                        SELECT json_agg(
                            json_build_object(
                                'id_poste', id_poste,
                                'display_name_fr', display_name_fr,
                                'nom_compagnie', entreprise.nom_compagnie,
                                'logo', CASE 
                                    WHEN entreprise.logo IS NOT NULL AND entreprise.logo NOT LIKE 'https%'
                                        THEN $5 || '/logo/' || entreprise.logo

                                    ELSE 
                                        entreprise.logo
                                    END,
                                'skills', skills,
                                'description', description,
                                'salaire_currency', salaire_currency,
                                'salaire_annuel_moyen', (salaire_min + salaire_max) / 2 || 'K',
                                'since_posted', CASE
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
                                END,
                                'latitude', latitude,
                                'longitude', longitude
                            )
                        )
                        FROM poste
                        WHERE poste.id_entreprise = entreprise.id_entreprise
                    ), 
                    '[]'::json
                ) AS offre
            FROM entreprise
            WHERE
            (
                ($1::boolean = false AND id_entreprise >= $2::integer)
                OR
                ($1::boolean = true AND id_entreprise <= $2::integer)
            )
            AND (
                $3::text[] IS NULL
                OR secteur_entreprise::text[] && $3::text[]
            )
            AND (
                $4::text[] IS NULL
                OR type_entreprise::text = ANY($4::text[])
            )
            ORDER BY
                CASE WHEN $1::boolean = false THEN id_entreprise END ASC,
                CASE WHEN $1::boolean = true  THEN id_entreprise END DESC
            LIMIT 5
        `;
    const selectEntrepriseRequest = await connection.query(
      sqlSelectEntreprise,
      [reverse, start, sectors ?? null, types ?? null, backend_url],
    );

    if (selectEntrepriseRequest.rows.length === 0) {
      console.error("No enterprise found");
      return res.status(404).json({ msg: "No enterprise found" });
    }

    console.log("Enterprise found");
    return res.status(200).json(selectEntrepriseRequest.rows);
  } catch (err) {
    console.error("Internal server error:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;
