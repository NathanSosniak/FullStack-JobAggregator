const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.post("/refresh", (req, res) => {
  try {
    // je récupère le refresh token
    const refresh_token = req.cookies["refresh_token"];

    // s'il y en a pas
    if (!refresh_token) {
      res.clearCookie("access_token", {
        httpOnly: true,
        sameSite: "strict",
        secure: false,
      });
      res.clearCookie("refresh_token", {
        httpOnly: true,
        sameSite: "strict",
        secure: false,
      });

      console.error("Refresh token missing");
      return res.status(401).json({ msg: "Refresh token missing" });
    }

    // je vérifie la validité du refresh token
    jwt.verify(
      refresh_token,
      process.env.REFRESH_SECRET_KEY,
      (err, decoded) => {
        if (err) {
          res.clearCookie("access_token", {
            httpOnly: true,
            sameSite: "strict",
            secure: false,
          });
          res.clearCookie("refresh_token", {
            httpOnly: true,
            sameSite: "strict",
            secure: false,
          });

          console.error("Invalid or expired refresh token");
          return res
            .status(401)
            .json({ msg: "Invalid or expired refresh token" });
        }

        // je recrée un access token
        const jsonData = {
          id: decoded.id,
          email: decoded.email,
          role: decoded.role,
        };
        const access_secretKey = process.env.ACCESS_SECRET_KEY;
        const access_options = { expiresIn: "15m" };
        const access_token = jwt.sign(
          jsonData,
          access_secretKey,
          access_options,
        );

        // je stocke l'access token dans un cookie
        res.cookie("access_token", access_token, {
          httpOnly: true,
          sameSite: "strict",
          secure: false,
          maxAge: 15 * 60 * 1000,
        });

        console.error("Access token refreshed");
        return res.status(200).json({ msg: "Token refreshed" });
      },
    );
  } catch (err) {
    console.error("Internal server error:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;
