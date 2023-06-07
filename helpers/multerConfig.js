const multer = require('multer');
let fs = require('fs-extra');
exports.fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let path = './files';
    fs.mkdirsSync(path);
    cb(null, path);
  },

  filename: async (req, file, cb) => {
    console.log('file', file);
    cb(null, file.fieldname + '-' + file.originalname);
  },
});

exports.fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    const filePath = './files/file-' + file.originalname;

    // Check if the file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        // File does not exist, allow the upload
        cb(null, true);
      } else {
        // File already exists, reject the upload
        req.fileExists = file.originalname;
        cb(null, false);
        return cb(new Error('file already exists'), req.fileExists);
      }
    });
  } else {
    req.fileExtensionCheck = file.originalname.split('.').pop();
    cb(null, false);
    return cb(new Error('only pdf allow'), req.fileExtensionCheck);
  }
};
