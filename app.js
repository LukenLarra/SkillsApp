import express, {json} from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { fileURLToPath } from 'url';

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

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.post('/upload', (req, res) => {
  const data = req.body.data;
  fs.writeFile('data.json', JSON.stringify(data), (err)=>{
    if(err){
      console.log(err);
    }else{
      console.log('Data written to file');
    }
  });
});

app.post('/download', (req, res) => {
  fs.readFile('data.json', (err, datos)=>{
    if(err){
      console.log(err);
    }else{
      const data = json(datos);
        res.json({data});
    }
  });
});

export default app;