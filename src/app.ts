import http from 'http';
import path from 'path';

import express, { Express } from 'express';
import session from 'express-session';

import storeRouter from './routes/store';
import authRouter from './routes/auth';
import userRouter from './routes/user';

const app: Express = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(
  '/css',
  express.static(__dirname + '/../node_modules/bootstrap/dist/css')
);

app.use('/assets', express.static(__dirname + '/static/assets'));
app.use('/uploads', express.static(__dirname + '/static/uploads'));

app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  res.locals.isLogged = req.session.isLogged;
  res.locals.user = req.session.user;
  res.locals.shoppingCart = req.session.shoppingCart;
  next();
});

app.use('/', storeRouter);
app.use('/', authRouter);
app.use('/', userRouter);

http.createServer(app).listen(3000);
