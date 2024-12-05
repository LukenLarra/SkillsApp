import express from 'express';
import path from "path";
import {fileURLToPath} from "url";
import fs from 'fs';

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
    req.session.errorMessage = null; // Limpia el mensaje después de leerlo
    res.render('login', {errorMessage});
});

router.get('/register', (req, res) => {
    const errorMessage = req.session.errorMessage || null;
    req.session.errorMessage = null; // Eliminar el mensaje para evitar que persista
    res.render('register', {errorMessage});
});

router.post('/register', (req, res) => {
    let password = req.body.password;
    const username = req.body.username;
    password = password[0];
    const filePath = path.join(__dirname, '../users.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Error reading users file');
        }

        let users = [];
        if (data) {
            users = JSON.parse(data);
        }

        const userExists = users.some(user => user.username === username);
        if (userExists) {
            req.session.errorMessage = 'El nombre de usuario ya está en uso. Por favor, elije otro.';
            return res.redirect('/users/register');
        }

        const role = users.length === 0 ? 'admin' : 'standard';
        const newUser = {username, password, role};

        users.push(newUser);

        fs.writeFile(filePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error writing to users file');
            }
            res.redirect('/users/login');
        });
    });
});

router.post('/login', (req, res) => {
    const {username, password} = req.body;
    const filePath = path.join(__dirname, '../users.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading users file');
        }

        let users = [];
        if (data) {
            users = JSON.parse(data);
        }

        const user = users.find(user => user.username === username && user.password === password);
        if (!user) {
            if (!req.session) {
                console.error('Session is not initialized!');
                return res.status(500).send('Session error');
            }

            req.session.errorMessage = 'El nombre de usuario o la contraseña son incorrectos';
            return res.redirect('/users/login');
        }

        req.session.username = user.username;
        req.session.role = user.role;

        res.redirect('/');
    });
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

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
            return res.status(500).send('Error logging out');
        }
        res.redirect('/users/login'); // Redirigir a la página de login o donde quieras
    });
});



export default router;