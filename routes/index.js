import express from 'express';
const router = express.Router();
import path from "path";
import fs from "fs";

const skillDataPath = path.join(__dirname, "./../data.json");
const skills = JSON.parse(fs.readFileSync(skillDataPath, "utf-8"));

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'ELECTRONICS'});
});

router.get("/skill_details:id", function (req, res, next) {
    const id = req.params.id;
    const skill = skills.find(skill => skill.id === id);
    if (skill) {
        res.render("skill", {skill});
    }else {
        res.status(404).send('Skill {id} not found');
    }
});

export default router;