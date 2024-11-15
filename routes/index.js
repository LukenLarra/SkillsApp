import express from 'express';
const router = express.Router();
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const skillDataPath = path.join(__dirname, "./../data.json");
const skills = JSON.parse(fs.readFileSync(skillDataPath, "utf-8"));

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'ELECTRONICS'});
});

router.get("/skill_details/:id", function (req, res, next) {
    const id = req.params.id;
    const skill = skills.find(skill => skill.id === id);
    if (skill) {
        res.render("skill_details", {skill});
    }else {
        res.status(404).send('Skill {id} not found');
    }
});

export default router;