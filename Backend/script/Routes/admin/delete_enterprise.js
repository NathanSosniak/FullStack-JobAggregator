const express = require("express");
const connection = require("../../DB");
const { auth, isAdmin } = require("../../Middleware");
const router = express.Router();

router.delete("/enterprise/:id", auth, isAdmin, async (req, res) => {
  try {
    const id = req.params.id;

    // je vérifie si id est un entier
    if (!Number.isInteger(Number(id))) {
      console.error("The id parameter must be an Integer");
      return res
        .status(400)
        .json({ msg: "The id parameter must be an Integer" });
    }

    const sqlDeleteEnterprise = `
            DELETE 
            FROM entreprise 
            WHERE id_entreprise = $1;
        `;
    const deleteEnterpriseRequest = await connection.query(
      sqlDeleteEnterprise,
      [id],
    );

    if (deleteEnterpriseRequest.rowCount === 0) {
      console.error("The enterprise does not exist");
      return res.status(404).json({ msg: "The enterprise does not exist" });
    }

    console.log("Enterprise deleted");
    return res.status(200).json({ msg: "Enterprise deleted" });
  } catch (err) {
    console.error("Internal server error:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;
