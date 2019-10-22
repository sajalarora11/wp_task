const { Schema, model } = require("mongoose");
const Joi = require("@hapi/joi");
const config = require("config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SALT_WORK_FACTOR = 10;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    unique: true
  },
  phone: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    required: true,
    unique: true
  },
  session_id: {
    type: String,
    unique: true
  }
});

userSchema.methods.setPassword = async function(password) {
  this.salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
  this.password = await bcrypt.hash(password, this.salt);
};

userSchema.methods.validatePassword = async function(pass) {
  const isMatch = await bcrypt.compare(pass, this.password);
  console.log(isMatch);
  return isMatch;
};

userSchema.methods.generateJwt = function() {
  return jwt.sign(
    {
      id: this._id,
      email: this.email
    },
    config.get("jwtsecret"),
    { expiresIn: config.get("jwtexp") }
  );
};

const UserLoginEmail = user => {
  const schema = Joi.object({
    email: Joi.string()
      .email({ minDomainSegments: 2 })
      .required(),
    password: Joi.string()
      .min(5)
      .max(255)
      .regex(/^[a-zA-Z0-9]{3,30}$/)
      .required()
  });

  return schema.validate(user);
};

const userLoginPhone = user => {
  const schema = Joi.object({
    phone: Joi.string()
      .min(9)
      .max(15)
      .regex(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/)
      .required()
  });
  return schema.validate(user);
};

const UserRegister = user => {
  const schema = Joi.object({
    email: Joi.string()
      .email({ minDomainSegments: 2 })
      .required(),
    password: Joi.string()
      .min(5)
      .max(255)
      .regex(/^[a-zA-Z0-9]{3,30}$/)
      .required(),
    username: Joi.string()
      .min(6)
      .max(18)
      .required(),
    phone: Joi.string()
      .min(9)
      .max(15)
      .regex(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/)
      .required()
  });

  return schema.validate(user);
};

const User = model("User", userSchema);

module.exports = { User, userLoginPhone, UserLoginEmail, UserRegister };
