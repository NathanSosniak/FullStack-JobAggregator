const cookieOptions = {
  httpOnly: true, // empêche js de lire le cookie
  sameSite: "strict", // le cookie est envoyé uniquement si la requête provient de notre site
  secure: false, // car en localhost en http et non https
  path: "/",
};

module.exports = cookieOptions;
