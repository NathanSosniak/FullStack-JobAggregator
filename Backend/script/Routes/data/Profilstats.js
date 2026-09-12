const express = require("express");
const connection = require("../../DB");
const { auth } = require("../../Middleware");

const router = express.Router();

router.put("/candidatures/:id", auth, async (req, res) => {
    try {
        const id_utilisateur = Number(req.params.id);

        if (!Number.isInteger(id_utilisateur)) {
        return res
            .status(400)
            .json({ msg: 'Le paramètre "id" doit être un entier' });
        }

        const allowedFields = [
        "nb_vues_profil",
        "candidatures_envoyees",
        "candidatures_consultees",
        "candidatures_positives",
        "candidatures_refusees",
        ];

        const updates = [];
        const values = [];

        for (const field of allowedFields) {
        const value = req.body[field];

        if (value !== undefined) {
            if (!Number.isInteger(Number(value)) || Number(value) < 0) {
            return res.status(400).json({
                msg: `Le champ "${field}" doit être un entier positif ou nul`,
            });
            }

            values.push(Number(value));

            updates.push(
            `${field} = ${field} + $${values.length}::integer`
            );
        }
        }

        if (updates.length === 0) {
        return res
            .status(400)
            .json({ msg: "Au moins un champ doit être fourni" });
        }

        values.push(id_utilisateur);

        const sql = `
        UPDATE profil_utilisateur
        SET ${updates.join(", ")}
        WHERE id_utilisateur = $${values.length}
        RETURNING *
        `;

        const result = await connection.query(sql, values);

        if (result.rowCount === 0) {
        return res.status(404).json({
            msg: "Le profil n'existe pas",
        });
        }

        const profil = result.rows[0];

        return res.status(200).json({...profil });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
        msg: "Internal server error",
        });
    }
});

module.exports = router;