const express = require("express");
const connection = require("../../DB");
const { auth, isAdmin } = require("../../Middleware");
const router = express.Router();

router.delete("/user/:id", auth, isAdmin, async (req, res) => {
  try {
    const id = req.params.id;

    // je vérifie si id est un entier
    if (!Number.isInteger(Number(id))) {
      console.error("The id parameter must be an Integer");
      return res
        .status(400)
        .json({ msg: "The id parameter must be an Integer" });
    }

    // je vérifie si l'id n'est pas celui de la personne connectée
    // cela évite qu'il supprime sont propre compte
    if (parseInt(id) === parseInt(req.token.id)) {
      console.error("You can't delete your own account");
      return res.status(403).json({ msg: "You can't delete your own account" });
    }

    const sqlDeleteUser = `
            DELETE 
            FROM utilisateur 
            WHERE id_utilisateur = $1;
        `;
    const deleteUserRequest = await connection.query(sqlDeleteUser, [id]);

    if (deleteUserRequest.rowCount === 0) {
      console.error("The user does not exist");
      return res.status(404).json({ msg: "The user does not exist" });
    }

    console.log("User deleted");
    return res.status(200).json({ msg: "User deleted" });
  } catch (err) {
    console.error("Internal server error:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;
