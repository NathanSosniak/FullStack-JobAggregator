// const express = require("express");
// const app = express();
// const port = process.env.PORT_BACK || 5000;
// const connection = require("./DB")
// const routes = require("./Routes/index")

// app.listen(port, "0.0.0.0",() => {
//     console.log("Le serveur est en ligne !");
// })

// //Test de connexion à la DB
// connection.connect((err, client) => {
//     if(err){
//         console.error("Erreur de connexion !" + err.stack)
//         return;
//     }
//     console.log("Connexion à la DB réussie !");
//     client.release();
//     console.log("Test de connexion terminé !");
// });

// app.use(express.json());
// app.use("/", routes);

require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const port = process.env.PORT_BACK || 5000;
const connection = require("./DB");
const routes = require("./Routes/index");

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());
app.use("/", routes);

app.listen(port, "0.0.0.0", () => {
  console.log("Le serveur est en ligne !");
});

connection.connect((err, client) => {
  if (err) {
    console.error("Erreur de connexion !" + err.stack);
    return;
  }
  console.log("Connexion à la DB réussie !");
  client.release();
  console.log("Test de connexion terminé !");
});

module.exports = app;
