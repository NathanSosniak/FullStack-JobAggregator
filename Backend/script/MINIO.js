const minio = require("minio");

//paramètres de connexion à minio
const minioClient = new minio.Client({
  endPoint: "minio",
  port: process.env.PORT_MINIO,
  useSSL: false, //pour communiquer en HTTP (protocole localhost)
  accessKey: process.env.MINIO_USER,
  secretKey: process.env.MINIO_PASSWORD,
});

module.exports = minioClient;
