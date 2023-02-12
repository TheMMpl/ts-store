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
//app.use(express.static("public")); 


app.get('/', (req: Request, res: Response) => {
    res.render('index.ejs');
});

app.get('/menu', (req: Request, res: Response) => {
    res.render('menu.ejs');
});

app.get('/test', (req: Request, res: Response) => {
    //var username = req.query.username;
    res.render('test')
});
app.get('/w', (req: Request, res: Response) => {
    //var username = req.query.username;
    res.render('w')
});
app.get('/nav', (req: Request, res: Response) => {
    //var username = req.query.username;
    res.render('nav.ejs')
});
app.get('/nav1', (req: Request, res: Response) => {
    //var username = req.query.username;
    res.render('nav1.ejs')
});
app.get('/colnav', (req: Request, res: Response) => {
    //var username = req.query.username;
    res.render('colnav.ejs')
});
http.createServer(app).listen(3000);
