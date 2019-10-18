const express = require("express");
const axios = require("axios");
const passport = require("passport");

const router = express.Router();

const API_KEY = require("config").get("api_key");

const validator = require("../middlewares/validate");
const {
  User,
  userLoginPhone,
  UserLoginEmail,
  UserRegister
} = require("../models/user.model");

/**
 * POST /register
 *
 * Route for creating new User
 */
router.post("/register", validator(UserRegister), async (req, res) => {
  try {
    // If the user already exists
    const user = await User.find({
      $or: [{ email: req.body.email }, { phone: req.body.phone }]
    });
    if (user.length > 0) return res.status(401).json("User already exists!");
    const newUser = new User(req.body);

    await newUser.setPassword(req.body.password);

    await newUser.save();

    const { _id, username, email } = newUser;

    return res
      .status(201)
      .json({ user: { _id, username, email }, token: newUser.generateJwt() });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json("OOPS! Something went wrong. Please try again later.");
  }
});

/**
 * POST /login-phone
 *
 * Route to send an OTP on phone to login.
 */

router.post(
  "/login-phone",
  validator(userLoginPhone),

  async (req, res, next) => {
    try {
      // If the user has an account
      const { phone } = req.body;
      const user = await User.findOne({ phone });
      if (!user) return res.status(403).json("Phone number doesn't exist.");

      // OTP generation (5 digit)
      const otp = Math.floor(Math.random() * 90000) + 10000;

      // Send OTP for login
      const body = await axios.get(
        `https://2factor.in/API/V1/${API_KEY}/SMS/${phone}/${otp}`
      );
      console.log("BODY", body);
      if (body.data.Status === "Success") {
        user.session_id = body.data.Details;
        await user.save();
        return res.status(200).json(`An OTP has been sent to ${phone}`);
      } else return res.status(400).json("Unable to send OTP.");
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json("OOPS! Something went wrong. Please try again later.");
    }
  }
);

/**
 * POST /verify-otp
 *
 * Route to login user if the OTP sent on the phone matches
 */

router.post("/verify-otp", async (req, res) => {
  passport.authenticate(
    "local-login-phone",
    async (err, passportUser, info) => {
      if (err) next(err);

      if (passportUser) {
        return res.status(200).json(passportUser.generateJwt());
      }

      return res.status(401).json(info);
    }
  )(req, res, next);
});

/**
 * POST /login-email
 *
 * Route to login user using the email and password
 */
router.post("/login-email", validator(UserLoginEmail), async (req, res) => {
  passport.authenticate("local-login", async (err, passportUser, info) => {
    if (err) next(err);

    if (passportUser) {
      return res.status(200).json(passportUser.generateJwt());
    }

    return res.status(401).json(info);
  })(req, res, next);
});

module.exports = router;
