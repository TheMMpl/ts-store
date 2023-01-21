var http = require("http");
var express = require("express");
var app = express();
app.set("view engine", "ejs");
// app.set("views", "./views");
http.createServer(app).listen(2000);
