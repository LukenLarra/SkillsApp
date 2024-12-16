import express from 'express';
import Skill from "../models/skill.model.js";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const iconPath = path.join(__dirname, '../public/uploads/icons');

if (!fs.existsSync(iconPath)) {
    fs.mkdirSync(iconPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,iconPath);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + Date.now() + ext);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten archivos PNG'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 }
});

/* GET home page. */
router.get('/', function (req, res) {
    res.send('respond with a resource');
});

router.get("/skills/:skillTree/view/:id", async (req, res) => {
    const {skillTree, id} = req.params;
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

router.post('/skills/:skillTree/edit/:id',  upload.single('icon'), async (req, res) => {
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

            if (req.file) {
                skill.icon = `/uploads/icons/${req.file.filename}`;
            }

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

router.post('/skills/:skillTree/add', upload.single('icon'), async (req, res) => {
    try {
        const skillTree = req.params.skillTree;
        const { text, score, description, tasks, resources } = req.body;
        const iconPath = req.file ? `/uploads/icons/${req.file.filename}` : null;

        const lastSkill = await Skill.findOne().sort({ id: -1 });
        const newId = lastSkill ? lastSkill.id + 1 : 1;

        const newSkill = new Skill({
            id: newId,
            text,
            score: Number(score),
            description,
            tasks: JSON.parse(tasks),
            resources: JSON.parse(resources),
            icon: iconPath,
            set: skillTree,
        });

        await newSkill.save();
        res.render('index', {title: 'ELECTRONICS', session: req.session});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create skill', error: error.message });
    }
});

export default router;