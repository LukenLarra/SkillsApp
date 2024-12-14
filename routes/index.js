import express from 'express';

const router = express.Router();
import path from "path";
import fs from "fs";
import {fileURLToPath} from 'url';
import Skill from "../models/skill.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', {title: 'ELECTRONICS', session: req.session});
});

const skillDataPath = path.join(__dirname, "./../data.json");
const skills = JSON.parse(fs.readFileSync(skillDataPath, "utf-8"));

router.get("/skill_details/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const skill = await Skill.findById(id);
        if (skill) {
            res.render("skill_details", { skill });
        } else {
            res.status(404).send(`Skill ${id} not found`);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving skill from database');
    }
});

router.get('/skills/:skillTree/edit/:id', async (req, res) => {
    const {skillTree, id} = req.params;
    try {
        const skill = await Skill.findById(id);
        if (skill) {
            res.render('edit_skill', {skill, skillTree});
        } else {
            res.status(404).send(`Skill ${id} not found`);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving skill from database');
    }
});

router.post('/skills/:skillTree/edit/:id', async (req, res) => {
    const { skillTree, id } = req.params;
    const { action, text, points, description, tasks, resources } = req.body;

    try {
        const data = await fs.promises.readFile(skillDataPath, 'utf8');
        let skills = JSON.parse(data);

        const skillIndex = skills.findIndex(skill => skill.id === id);
        if (skillIndex === -1) {
            return res.status(404).send('Skill not found');
        }

        if (action === 'save') {
            skills[skillIndex].text = text.split(',').map(t => t.trim()).filter(t => t.length > 0);
            skills[skillIndex].points = points;
            skills[skillIndex].description = description;
            skills[skillIndex].tasks = tasks.split('\n').map(t => t.trim()).filter(t => t.length > 0);
            skills[skillIndex].resources = resources.split('\n').map(t => t.trim()).filter(t => t.length > 0);

            await fs.promises.writeFile(skillDataPath, JSON.stringify(skills, null, 2));
            res.redirect(`/`);
        }else if (action === 'cancel') {
            res.redirect(`/`);
        } else if (action === 'delete') {
            skills.splice(skillIndex, 1);
            await fs.promises.writeFile(skillDataPath, JSON.stringify(skills, null, 2));
            res.redirect(`/`);
        } else {
            res.status(400).send('Invalid action');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error processing request');
    }
});

router.get('/skills/:skillTree/add', async (req, res) => {
    res.send('Not implemented');


});
export default router;
