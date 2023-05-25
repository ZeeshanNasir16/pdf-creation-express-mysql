const express = require('express');
const _ = require('dotenv').config();
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const homeRoutes = require('./routes/home-routes');

const app = express();

app.use(expressLayouts);
app.set('view engine', 'ejs');
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/docs', express.static(path.join(__dirname, 'docs')));

app.use(homeRoutes.routes);

app.listen(3000, () =>
  console.log('App is listening on url http://localhost:3000')
);
