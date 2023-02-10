import http from 'http';
import path from 'path';

import express, { Express } from 'express';
//import expressLayouts from 'express-ejs-layouts';

import store from './src/routes/store';

const app: Express = express();

//app.use(expressLayouts);

app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

app.use(store);

http.createServer(app).listen(3000);
