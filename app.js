import express, { json } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { fileURLToPath } from 'url';
import fs from 'fs';
import createError from 'http-errors';

import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.post('/upload', (req, res) => {
  const data = req.body;
  fs.writeFile('data.json', JSON.stringify(data, null, 2), (err)=>{
    if(err){
      console.log(err);
      res.status(500).send('Error writing to file');
    }else{
      console.log('Data written to file');
      res.status(200).send('Data uploaded successfully');
    }
  });
});

app.get('/download', (req, res) => {
  const filePath = path.join(__dirname, 'data.json');
  fs.readFile(filePath, 'utf8',(err, data) =>{
    if(err){
      console.log(err);
      res.status(500).send('Error reading file');
    }else{
      res.json(JSON.parse(data));
    }
  });
});

app.listen (3000, function() {
  console.log ("El servidor localhost está escuchando desde el puerto 3000");
});

app.use(function(req, res, next) {
  next(createError(404));
});

export default app;