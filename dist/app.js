"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require("express-session");
var app = express();
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, "/public")));
app.use(cookieParser());
app.use(session({ secret: "poipomplop" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", function (req, res) {
    res.render("index");
});
exports.default = app;
//# sourceMappingURL=app.js.map