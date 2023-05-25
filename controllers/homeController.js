const fs = require('fs');
const pdf = require('pdf-creator-node');
const path = require('path');
const options = require('../helpers/options');
const data = require('../helpers/data');
const { getUsers, getCompInfo } = require('../model/dataModel');
const puppeteer = require('puppeteer');
const hbs = require('handlebars');
const fs_extra = require('fs-extra');

const homeview = (req, res, next) => {
  res.render('home');
};

const compile = async function (templateName, data) {
  const filePath = path.join(process.cwd(), 'views', `${templateName}.hbs`);
  const html = await fs_extra.readFile(filePath, 'utf8');
  return hbs.compile(html)(data);
};

const generatePdf = async (req, res, next) => {
  const html = fs.readFileSync(
    path.join(__dirname, '../views/template.html'),
    'utf-8'
  );
  const filename = Math.random() + '_doc' + '.pdf';
  let array = [];

  const userData = await getUsers();
  const compInfo = await getCompInfo();

  userData.forEach((el) => {
    const user = {
      first_name: el.first_name,
      last_name: el.last_name,
      email: el.email,
      mobile_no: el.mobile_no,
    };
    array.push(user);
  });

  const document = {
    html: html,
    data: {
      users: array,
      compInfo,
    },
    path: './docs/' + filename,
  };
  pdf
    .create(document, options)
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.log(error);
    });
  const filepath = 'http://localhost:3000/docs/' + filename;

  res.render('download', {
    path: filepath,
  });
};

const CreatePDF = async (req, res, next) => {
  try {
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

    console.log('compInfo', compInfo);

    const todayDate = new Date().getTime();

    await page.setViewport({ width: 1080, height: 1024 });
    await page.setContent(content);
    const pdf = await page.pdf({
      path: `${path.join(__dirname, '../docs/', todayDate + '.pdf')}`,
      format: 'A4',
    });

    console.log('done creating pdf');
    const filepath = 'http://localhost:3000/docs/' + todayDate + '.pdf';
    // const pdfURL = path.join(__dirname, '../docs/', todayDate + '.pdf');

    res.render('download', {
      path: filepath,
    });

    // await browser.close();
    // res.set({
    //   'Content-Type': 'application/pdf',
    //   'Content-Length': pdf.length,
    // });
    // res.send(pdf);
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
  generatePdf,
  CreatePDF,
};
