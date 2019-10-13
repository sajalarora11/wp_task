const mongoose = require("mongoose");
const config = require("config");

const connectDB = async () => {
  try {
    await mongoose.connect(config.get("db"), {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true
    });
    console.log("connectied to database...");
  } catch (error) {
    console.log("Connection to DB failed...", error);
    process.exit();
  }
};

module.exports = connectDB;
