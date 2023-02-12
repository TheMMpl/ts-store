import http from 'http';
import path from 'path';

import express, { Express } from 'express';
import session from 'express-session';

import store from './routes/store';
import User from './model/user';
import ShoppingCart from './model/shoppingCart';

declare module 'express-session' {
  interface SessionData {
    isLogged: boolean;
    user: User | null;
    shoppingCart: ShoppingCart | null;
  }
}

const app: Express = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', store);

http.createServer(app).listen(3000);
