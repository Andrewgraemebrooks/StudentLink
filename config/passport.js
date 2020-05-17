// Brings in the passport strategy for json web token (jwt).
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
// Brings in mongoose, the keys file, and the User model.
const mongoose = require('mongoose');
const User = mongoose.model('users');
const keys = require('./keys');

// Make an object of options for the JwtStrategy
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secret = keys.secret;

// Export module as variable called passport along with its configuration.
module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      User.findById(jwt_payload.id)
        .then((user) => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch((err) => console.log(err));
    })
  );
};
