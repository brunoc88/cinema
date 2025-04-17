const multer = require('multer');
const path = require('path');

const upload = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, 'uploads/');
      },
      filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
      }
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: function (req, file, cb) {
      const allowedTypes = /jpeg|jpg|png/;
      const ext = path.extname(file.originalname).toLowerCase();
      if (!allowedTypes.test(ext)) {
        return cb(new Error('Solo se permiten archivos JPEG, JPG y PNG'));
      }
      cb(null, true);
    }
  });


module.exports = upload;
