const { Pool } = require("pg");

//Paramètres de connexion à la DB
const connection = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.PORT_DB,
});

module.exports = connection;
