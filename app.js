const express = require("express");
const path = require("path");
const logger = require("morgan");
const bodyParser = require("body-parser");
require("dotenv").config();

// Routes
const index = require("./routes/index");
const users = require("./routes/users");
const promoRouter = require("./routes/promoRouter");
const listRouter = require("./routes/listRouter");
const cartRouter = require("./routes/cartRouter");
const storeRouter = require("./routes/storeRouter");
const shelfRouter = require("./routes/shelfRouter");
const shortestPathRouter = require("./routes/shortestPathRoute");
//
// const adminUser = require("./routes/adminUserRoutes");
// Database
const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

const passport = require("passport");

// Connection URL
const url = process.env.mongoUrl;
const connect = mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

connect.then(
    (db) => {
        console.log("Connected correctly to server and Database");
    },
    (err) => {
        console.log(err);
    },
);

const app = express();

// view engine setup
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Logger and Body parser
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());
// User Route
app.use("/", index);
app.use("/users", users);
// app.use("/admin", adminUser);

// Routes
app.use("/promotions", promoRouter);
app.use("/lists", listRouter);
app.use("/cart", cartRouter);
app.use("/store", storeRouter);
app.use("/shelf", shelfRouter);
app.use("/shortestPath", shortestPathRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
