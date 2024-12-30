import express from 'express';
import path from "path";
import {fileURLToPath} from "url";
import fs from 'fs';
import checkPassword from "../scripts/register.js";
import User from '../models/user.model.js';
import Skill from "../models/skill.model.js";

let router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get('/', function (req, res) {
    res.send('respond with a resource');
});

router.get('/login', (req, res) => {
    const success_msg = req.session.success_msg || null;
    const error_msg = req.session.error_msg || null;
    const error = req.session.error || null;

    delete req.session.success_msg;
    delete req.session.error_msg;
    delete req.session.error;

    res.render('login', {
        success_msg: success_msg,
        error_msg: error_msg,
        error: error
    });
});

router.get('/register', (req, res) => {
    const success_msg = req.session.success_msg || null;
    const error_msg = req.session.error_msg || null;
    const error = req.session.error || null;

    delete req.session.success_msg;
    delete req.session.error_msg;
    delete req.session.error;

    res.render('register', {
        success_msg: success_msg,
        error_msg: error_msg,
        error: error
    });
});

router.post('/register', async (req, res) => {
    try {
        let passwordArray = req.body.password;
        const username = req.body.username;
        const password = passwordArray[0];
        const password_conf = passwordArray[1];

        console.log('Registering user:', username, password, password_conf);

        if (!checkPassword(password, password_conf)) {
            req.session.error_msg = 'Las contraseñas no coinciden o no cumplen con los requisitos mínimos';
            return res.status(404).redirect('/users/register');
        }

        const existingUser = await User.findOne({username});
        if (existingUser) {
            req.session.error_msg = 'El nombre de usuario ya está en uso';
            return res.status(404).redirect('/users/register');
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

        req.session.success_msg = 'Usuario registrado correctamente. Por favor, inicie sesión';
        res.redirect('/users/login');
    } catch (error) {
        console.error('Error registering user:', error);
        req.session.error_msg = 'Error registering user';
        res.status(500).redirect('/users/register');
    }
});

router.post('/login', async (req, res) => {
    const {username, password} = req.body;

    try {
        const user = await User.findOne({username});
        if (!user) {
            req.session.error_msg = 'El usuario no coincide con ningún usuario registrado';
            return res.status(404).redirect('/users/login');
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            req.session.error_msg = 'La contraseña no coincide con el usuario';
            return res.status(404).redirect('/users/login');
        }

        req.session.username = user.username;
        req.session.role = user.admin ? 'admin' : 'standard';

        res.redirect('/');
    } catch (error) {
        console.error('Error during login:', error);
        req.session.error_msg = 'Error during login';
        return res.status(500).redirect('/users/login');
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
            return res.status(500).send('Error logging out');
        }
        res.redirect('/users/login');
    });
});

router.get('/leaderboard', async (req, res) => {
    const user = req.session.username ? {
        username: req.session.username,
        isAdmin: req.session.role === 'admin'
    } : null;

    const allSkills = await Skill.find();

    const skillSets = {};

    allSkills.forEach(skill => {
        const skillTree = skill.set;

        if (skillSets[skillTree]) {
            skillSets[skillTree]++;
        } else {
            skillSets[skillTree] = 1;
        }
    });

    res.render('leaderboard', {
        user: user,
        skillTree: skillSets
    });
});

export default router;