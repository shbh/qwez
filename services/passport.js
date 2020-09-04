const passport = require('passport');
const mongoose = require('mongoose');
const GoogleStrategy = require('passport-google-oauth2');
const User = mongoose.model('User');
const LocalStrategy = require('passport-local').Strategy;

/**
 * The first time user logs in, we take user's id and
 * store it in req.session.passport.user as cookie.
 * All the follow up request will contain this cookie.
 * cookie-session does the job of decrypting this information.
 */
passport.serializeUser((user, done) => {
  done(null, user.id);
});

/**
 * After logging in, all the follow up requests by user contains
 * the cookie. cookie-session docodes it and put the information
 * inside req.session.passport.id . This id (user's id) is retrieved
 * from session object and then we find the user from database using
 * the id and put it into req.user
 */
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {


  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
      },
      async (accessToken, refreshToken, profile, done) => {
        const existingUser = await User.findOne({ googleId: profile.id });
        if (existingUser) {
          done(null, existingUser);
        } else {
          const newUser = await new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0]['value']
          }).save();
          done(null, newUser);
        }
      }
    )
  );
}

passport.use(new LocalStrategy(
  function (email, password, done) {
    User.findOne({ email: email }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        const newUser = new User({
          name: email,
          email: email,
          password: password
        }).save()
          .then(d => {
            return done(null, d);
          })
          .catch(err => {

            return done(null, false);
          })
        return newUser;
      }
      return user.comparePassword(password, (err, match) => {
        if (err) {
          return done(null, false);
        }
        return done(null, user);
      })
    });
  }
));
