import express from 'express';
import path from "path";
import {fileURLToPath} from "url";
import fs from 'fs';
import checkPassword from "../scripts/register.js";
import User from '../models/user.model.js';

let router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* GET users listing. */
router.get('/', function (req, res) {
    res.send('respond with a resource');
});

router.get('/leaderboard', function (req, res) {
    res.render('leaderboard', {title: 'Range Explanations'});
});

router.get('/login', (req, res) => {
    const errorMessage = req.session.errorMessage;
    req.session.errorMessage = null;
    res.render('login', {errorMessage});
});

router.get('/register', (req, res) => {
    const errorMessage = req.session.errorMessage || null;
    req.session.errorMessage = null;
    res.render('register', {errorMessage});
});

router.post('/register', async (req, res) => {
    try {
        let passwordArray = req.body.password;
        const username = req.body.username;
        const password = passwordArray[0];
        const password_conf = passwordArray[1];

        console.log('Registering user:', username, password, password_conf);

        if (!checkPassword(password, password_conf)) {
            req.session.errorMessage = 'Las contraseñas no coinciden o no cumplen con los requisitos mínimos';
            return res.redirect('/users/register');
        }

        const existingUser = await User.findOne({username});
        if (existingUser) {
            req.session.errorMessage = 'El nombre de usuario ya está en uso. Por favor, elije otro.';
            return res.redirect('/users/register');
        }

        const count = await User.countDocuments().exec();
        console.log('Number of users:', count);
        const isAdmin = count === 0;

        const newUser = new User({
            username,
            password,
            admin: isAdmin
        });

        await newUser.save();

        res.redirect('/users/login');
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Error registering user');
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            req.session.errorMessage = 'El nombre de usuario o la contraseña son incorrectos';
            return res.redirect('/users/login');
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            req.session.errorMessage = 'El nombre de usuario o la contraseña son incorrectos';
            return res.redirect('/users/login');
        }

        req.session.username = user.username;
        req.session.role = user.admin ? 'admin' : 'standard';

        res.redirect('/');
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Error del servidor');
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
            return res.status(500).send('Error logging out');
        }
        res.redirect('/users/login'); // Redirigir a la página de login o donde quieras
    });
});

export default router;