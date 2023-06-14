const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose')
require('dotenv').config();

const User = require('../models/user')

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/pariwar',
        passReqToCallback: true
      },
      async (req, accessToken, refreshToken, profile, done) => {
        // get the user data from google
        console.log(profile);
        if (!profile) {
          return done(new Error('Failed to retrieve user profile from Google.'));
        }
        const newUser = {
          googleId: profile.id,
          name: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value,
          email: profile.emails[0].value
        }

        try {
          // find the user in our database
          let user = await User.findOne({ googleId: profile.id })

          if (user) {
            // If user is present in our database.
             // Store the user in session
            done(null, user);
          } else {
            // If user is not present in our database, save user data to the database.
            user = await User.create(newUser);
             // Store the user in session
            done(null, user);
          }
        } catch (err) {
          console.error(err);
        }
      }
    )
  )

  // used to serialize the user for the session
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  // used to deserialize the user
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .then(user => {
        done(null, user);
      })
      .catch(err => {
        done(err, null);
      });
  });
}
