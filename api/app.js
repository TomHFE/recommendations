const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const userpostsRouter =require("./routes/userposts")
const usersRouter = require("./routes/users");
const postsRouter = require("./routes/posts");
const friendRouter = require("./routes/friends")
const authenticationRouter = require("./routes/authentication");
const signUp = require('./routes/signup')
const tokenChecker = require("./middleware/tokenChecker");

const app = express();

// Allow requests from any client
// docs: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
// docs: https://expressjs.com/en/resources/middleware/cors.html
app.use(cors());

// Parse JSON request bodies, made available on `req.body`
app.use(bodyParser.json());

// API Routes
app.use("/friends", tokenChecker ,friendRouter);
app.use('/signup', signUp)
app.use("/users", tokenChecker ,usersRouter);
app.use("/posts", tokenChecker, postsRouter);
app.use("/userposts", tokenChecker, userpostsRouter);
app.use("/tokens", authenticationRouter);

// 404 Handler
app.use((_req, res) => {
  res.status(404).json({ err: "Error 404: Not Found" });
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  if (process.env.NODE_ENV === "development") {
    res.status(500).send(err.message);
  } else {
    res.status(500).json({ err: "Something went wrong" });
  }
});

module.exports = app;
