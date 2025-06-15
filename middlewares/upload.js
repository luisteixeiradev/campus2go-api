const multer = require('multer');
const path = require('path');
const fs = require('fs');

const createStorage = (folderName) => {
  const uploadPath = path.join(__dirname, '..', 'public/images', folderName);
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, `${folderName}-${req.params.uuid}${path.extname(file.originalname)}`);
    }
  });
};

const imageFileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de ficheiro não suportado (apenas JPEG, PNG ou WEBP)'), false);
  }
}

exports.promoter = multer({storage: createStorage('promoters'), fileFilter: imageFileFilter})
