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
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
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

        const role = users.length === 0 ? 'admin' : 'standard';
        const newUser = {username, password, role};

        users.push(newUser);

        fs.writeFile(filePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Error writing to users file');
            }
            res.redirect('/users/login');
        });
    });
});

export default router;