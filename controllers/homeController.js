const fs = require('fs');
const path = require('path');
const { getUsers, getCompInfo } = require('../model/dataModel');
const puppeteer = require('puppeteer');
const hbs = require('handlebars');
const fs_extra = require('fs-extra');
const multer = require('multer');
const { fileStorage, fileFilter } = require('../helpers/multerConfig');

upload = multer({ storage: fileStorage, fileFilter: fileFilter }).single(
  'file'
);
const homeview = (req, res) => {
  res.render('home', { error: null, user: req?.user || null });
};

const compile = async function (templateName, data) {
  const filePath = path.join(process.cwd(), 'views', `${templateName}.hbs`);
  const html = await fs_extra.readFile(filePath, 'utf8');
  return hbs.compile(html)(data);
};

const DownloadPDF = async (req, res) => {
  const reqBody = req.body;
  console.log('reqBody', reqBody);
  res.status(200).json({
    data: req.body,
  });
};

const FileUploadView = async (_, res) => {
  res.render('fileUpload', { status: '' });
};

const FileUpload = async (req, res, next) => {
  try {
    return upload(req, res, function (err) {
      console.log(' Upload func', err);
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        return res.render('fileUpload', {
          message: `Uploading has failed, ${err.message}`,
          status: 'fail',
        });
      } else if (err) {
        // Check if the file with the same name already exists
        if (req.fileExists) {
          return res.render('fileUpload', {
            message: `Uploading has failed because ${req.fileExists} file already exists.  `,
            status: 'fail',
          });
        } else if (req.fileExtensionCheck)
          return res.render('fileUpload', {
            message: `Uploading has failed ( pdf allow). You Uploaded ${req.fileExtensionCheck} file `,
            status: 'fail',
          });
      }
      return res.render('fileUpload', {
        message: 'File is uploaded successfully',
        status: 'success',
      });
    });
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      message: 'Something unexpected happened',
      error: error,
    });
  }
};

const CreatePDF = async (req, res) => {
  try {
    const { fileName } = req.body;
    console.log('fileName', fileName);

    if (fs.existsSync(`${path.join(__dirname, '../docs/', fileName + '.pdf')}`))
      return res.render('home', {
        error: 'File already exists, choose another filename',
      });

    const browser = await puppeteer.launch({
      headless: 'new',
    });
    const page = await browser.newPage();

    const userData = await getUsers();
    const compInfo = await getCompInfo();
    const content = await compile('pdfTemp', {
      users: userData,
      compInfo: { ...compInfo[0] },
    });

    await page.setViewport({ width: 1080, height: 1024 });
    await page.setContent(content);

    console.log('done creating pdf');
    const filepath = 'http://localhost:3000/docs/' + fileName + '.pdf';

    res.render('download', {
      path: filepath,
    });
  } catch (er) {
    console.log('er', er);
    res.status(500).json({
      status: 'failed',
      message: 'Something went wrong',
    });
  }
};

module.exports = {
  homeview,
  CreatePDF,
  DownloadPDF,
  FileUploadView,
  FileUpload,
};
