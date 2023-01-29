var http = require("http");
const path = require("path");
//var express = require("express");
import express, { Express, Request, Response } from 'express';
//import expressLayouts from 'express-ejs-layouts';

var app: Express = express();
//app.use(expressLayouts);

app.set("views", path.join(__dirname, "src/views"));
app.set("view engine", "ejs");
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

app.get('/', (req: Request, res: Response) => {
    res.render('index.ejs');
});

app.get('/test', (req: Request, res: Response) => {
    //var username = req.query.username;
    res.render('test')
});
app.get('/w', (req: Request, res: Response) => {
    //var username = req.query.username;
    res.render('w')
});

http.createServer(app).listen(3000);
