import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import {fileURLToPath} from 'url';
import fs from 'fs';
import createError from 'http-errors';
import session from 'express-session';
import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import adminRouter from './routes/admin.js';
import skillsRouter from './routes/skills.js';
import connectDB from './config/database.js';

import Skill from './models/skill.model.js';
import User from './models/user.model.js';
import Badge from './models/badge.model.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let app = express();

connectDB();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use('/uploads/icons', express.static(path.join(__dirname, 'public/uploads/icons')));

app.use(session({
    secret: 'my-simple-secret',
    resave: false,
    saveUninitialized: true
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);
app.use('/skills', skillsRouter);


app.post('/api/data', (req, res) => {
    const data = req.body;
    fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error writing to file');
        } else {
            console.log('Data written to file');
            res.status(200).send('Data uploaded successfully');
        }
    });
});

app.get('/api/data', async (req, res) => {
    try {
        const skills = await Skill.find();
        res.json(skills);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving skills from the database');
    }
});

app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving skills from the database');
    }
});

app.post('/api/badges', (req, res) => {
    const data = req.body;
    fs.writeFile('badges.json', JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error writing to file');
        } else {
            console.log('Data written to file');
            res.status(200).send('Data uploaded successfully');
        }
    });
});

app.get('/api/badges', async (req, res) => {
    try {
        const badges = await Badge.find();
        res.json(badges);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving badges from the database');
    }
});

app.listen(3000, function () {
    console.log("El servidor localhost está escuchando desde el puerto 3000");
});

app.use(function (req, res, next) {
    next(createError(404));
});

export default app;