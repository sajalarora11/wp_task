var LocalStrategy = require("passport-local").Strategy;
const axios = require("axios");
var { User } = require("../models/user.model");

var LocalConfig = passport => {
  // required for persistent login sessions

  // used to serialize the user for the session
  passport.serializeUser((user, done) => {
    console.log("SE", user);
    done(null, user._id);
  });

  // used to deserialize the user
  passport.deserializeUser((user, done) => {
    console.log("DE", user);
    done(null, user);
  });

  // LOCAL LOGIN (email)
  passport.use(
    "local-login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
      },
      async (req, email, password, done) => {
        console.log(email, password);
        if (email) email = email.toLowerCase();

        try {
          const user = await User.findOne({ email });
          // if no user is found, return the message
          if (!user)
            return done(null, false, { message: "Invalid email or password" });
          const isMatch = await user.validatePassword(password);
          console.log(isMatch);
          if (!isMatch)
            return done(null, false, { message: "Invalid email or password" });
          return done(null, user);
        } catch (err) {
          return done(err, { message: "Invalid email or password" });
        }
      }
    )
  );
  passport.use(
    "local-login-phone",
    new LocalStrategy(
      {
        usernameField: "phone",
        passwordField: "otp",
        passReqToCallback: true
      },
      async (req, phone, otp, done) => {
        try {
          const user = await User.findOne({ phone });
          // if no user is found, return the message
          if (!user) return done(null, false, { message: "Invalid request" });

          // Verify OTP and Login
          const body = await axios.get(
            `https://2factor.in/API/V1/${API_KEY}/SMS/VERIFY/${user.session_id}/${otp}`
          );
          console.log(body);
          if (body.data.Status === "Success") {
            user.session_id = "";
            await user.save();
            return done(null, user);
          } else
            return done(null, false, { message: "Invalid email or password" });
        } catch (err) {
          return done(err, { message: "Invalid email or password" });
        }
      }
    )
  );
};

module.exports = LocalConfig;
