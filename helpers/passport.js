const passport = require('passport');
const { Strategy } = require('passport-google-oauth20');
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, SESSION_SECRET, PORT } =
  process.env;

authUser = (request, accessToken, refreshToken, profile, done) => {
  console.log('profile', profile);
  let userObj = {
    username: profile.displayName,
    googleId: profile.id,
    email: profile.emails !== undefined ? profile.emails[0].value : '',
    verified: profile.emails !== undefined ? profile.emails[0].verified : '',
    picture: profile.photos !== undefined ? profile.photos[0].value : '',
  };
  return done(null, userObj);
};

exports.googlePassportConfig = () => {
  passport.use(
    new Strategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: `http://localhost:5000/auth/google/profileInfo`,
        passReqToCallback: true,
      },
      authUser
    )
    //   (accessToken, refreshToken, profile, cb) => {
    //     let userObj = {
    //       username: profile.displayName,
    //       googleId: profile.id,
    //       email: profile.emails !== undefined ? profile.emails[0].value : '',
    //       verified:
    //         profile.emails !== undefined ? profile.emails[0].verified : '',
    //       picture: profile.photos !== undefined ? profile.photos[0].value : '',
    //     };
    //     console.log('profile', profile);
    //     return cb(null, userObj);
    //   }
    // )
  );
  passport.serializeUser((user, cb) => {
    cb(null, user);
  });

  passport.deserializeUser((obj, cb) => {
    cb(null, obj);
  });
};
