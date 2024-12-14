import express from 'express';

const router = express.Router();
import Skill from "../models/skill.model.js";

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', {title: 'ELECTRONICS', session: req.session});
});

router.get("/skill_details/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const skill = await Skill.findOne({id: Number(id)});
        if (skill) {
            res.render("skill_details", {skill});
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
        const skill = await Skill.findOne({id: Number(id)});
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
    const {skillTree, id} = req.params;
    const {action, text, points, description, tasks, resources} = req.body;

    try {
        const skill = await Skill.findOne({id: Number(id)});
        if (!skill) {
            return res.status(404).send('Skill not found');
        }

        if (action === 'save') {
            skill.text = text.trim();
            skill.points = points;
            skill.description = description;
            skill.tasks = tasks.split('\n').map(t => t.trim()).filter(t => t.length > 0);
            skill.resources = resources.split('\n').map(t => t.trim()).filter(t => t.length > 0);
            skill.set = skillTree;

            await skill.save();
            res.redirect(`/`);
        } else if (action === 'cancel') {
            res.redirect(`/`);
        } else if (action === 'delete') {
            await Skill.findOneAndRemove({ id: Number(id) });
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
    const {skillTree} = req.params;
    res.render('add_skill', {skillTree});
});

router.post('/skills/:skillTree/add', async (req, res) => {
    res.send('Not implemented');
});

export default router;
