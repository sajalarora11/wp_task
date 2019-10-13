const jwt = require("jsonwebtoken");
const config = require("config");
const { User } = require("../models/user.model");

const checkAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) return res.status(401).json("You're not authorized!");
    const decodedUser = jwt.verify(token, config.get("jwtsecret"));
    if (findUser(decodedUser.id)) {
      req.user = decodedUser;
      next();
    } else {
      return res.status(403).json("You're not authorized!");
    }
  } catch (err) {
    console.log(err);
    return res.status(401).json("You're not authorized!");
  }
};

const findUser = async _id => {
  console.log(_id);
  const user = await User.findById({ _id });
  if (!user) return false;
  else return true;
};

module.exports = checkAuth;
