const express = require('express');
const {
  homeview,
  CreatePDF,
  DownloadPDF,
  FileUploadView,
  FileUpload,
} = require('../controllers/homeController');

const router = express.Router();

router.get('/', homeview);
router.get('/download', CreatePDF);
router.get('/uploadFile', FileUploadView);
router.post('/uploadFile', FileUpload);

module.exports = {
  routes: router,
};
