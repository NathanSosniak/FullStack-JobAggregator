const express = require("express");
const connection = require("../../DB");
const { auth, isAdmin } = require("../../Middleware");
const router = express.Router();

router.put("/privilege/:id/:role", auth, isAdmin, async (req, res) => {
  try {
    const user_id = req.params.id;
    const role = req.params.role;

    // je vérifie si user_id est un entier
    if (!Number.isInteger(Number(user_id))) {
      console.error("The id parameter must be an Integer");
      return res
        .status(400)
        .json({ msg: "The id parameter must be an Integer" });
    }

    // je vérife si role correspond à un rôle
    if (
      String(role) !== "user" &&
      String(role) !== "admin" &&
      String(role) !== "enterprise"
    ) {
      console.error(
        'The role parameter must be "admin", "user" or "enterprise"',
      );
      return res.status(400).json({
        msg: 'The role parameter must be "admin", "user" or "enterprise"',
      });
    }

    const sqlUpdateRole = `
            UPDATE utilisateur
            SET role = $1::text
            WHERE id_utilisateur = $2::integer;
        `;
    const updateRoleRequest = await connection.query(sqlUpdateRole, [
      role,
      user_id,
    ]);

    if (updateRoleRequest.rowCount === 0) {
      console.error("The user does not exist");
      return res.status(404).json({ msg: "The user does not exist" });
    }

    console.log("Role updated");
    return res.status(200).json({ msg: "Role updated" });
  } catch (err) {
    console.error("Internal server error:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;
