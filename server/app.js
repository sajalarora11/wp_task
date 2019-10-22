var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const redis = require("redis");
const env = require("config");
const redisStore = require("connect-redis")(session);

const connectDB = require("./config/db");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();
const redisClient = redis.createClient();

redisClient.on("error", err => console.log("Can't connect to redis", err));

// Conenction to MongoDB server
connectDB();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(env.get("SESSION_SECRET")));
app.use(cors());

require("./config/passport")(passport);

// required for passport
app.use(
  session({
    name: env.get("SESSION_NAME"),
    secret: env.get("SESSION_SECRET"), // session secret
    resave: false,
    saveUninitialized: false,
    store: new redisStore({
      host: "localhost",
      port: 6379,
      client: redisClient,
      ttl: 86400
    }),
    cookie: {
      httpOnly: true,
      sameSite: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 2
    }
  })
);
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

if (env.get("NODE_ENV") === "production") {
  app.use(express.static("wp-app/build"));
}

app.get("*", function(req, res, next) {
  res.setHeader("Last-Modified", new Date().toUTCString());
  next();
});

app.use("/api", indexRouter);
app.use("/api/user", usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.log(err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.use("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "wp-app", "build", "index.html"));
});

module.exports = app;
