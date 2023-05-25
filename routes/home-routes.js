const express = require('express');
const {
  homeview,
  generatePdf,
  CreatePDF,
} = require('../controllers/homeController');

const router = express.Router();

router.get('/', homeview);
// router.get('/download', generatePdf);
router.get('/download', CreatePDF);

module.exports = {
  routes: router,
};
