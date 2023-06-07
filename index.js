const express = require('express');
const _ = require('dotenv').config();
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const { googlePassportConfig } = require('./helpers/passport');

const homeRoutes = require('./routes/home-routes');
const authRoutes = require('./routes/auth-routes');

const app = express();

app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.PORT,
  })
);

// ^ Passport Config
googlePassportConfig();
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '/public')));

app.use('/docs', express.static(path.join(__dirname, 'docs')));

app.use(homeRoutes.routes);
app.use(authRoutes.routes);

app.listen(process.env.PORT || 5000, () =>
  console.log(`App is listening on url http://localhost:${process.env.PORT}`)
);
