var express = require("express");
var router = express.Router();

const { User } = require("../models/user.model");
const auth = require("../middlewares/auth");

/* GET users listing. */
router.get("/", auth, async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById({ _id: id });
    const { username } = user;
    return res.status(200).json({ id, username });
  } catch (err) {
    console.log(err);
    return res.status(500).json("Something went wrong1");
  }
});

module.exports = router;
