const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "/usr/local/app/Cache/temp");
  },

  filename: (req, file, callback) => {
    if (file.fieldname === "doc") {
      const ext = path.extname(file.originalname);
      return callback(
        null,
        `${req.token.id}-${file.fieldname}-${uuidv4()}${ext}`,
      );
    }

    return callback(null, file.originalname);
  },
});

const fileFilter = (req, file, callback) => {
  if (file.fieldname === "doc") {
    // ici on accepte tout type de document car ca va servir pour le code
    return callback(null, true);
  }
  // et si et seulement si c'est un des type suivant alors on mix le nom et l'extension
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/i))
    return callback(new Error("Only image files are allowed"), false);
  callback(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

module.exports = upload;
