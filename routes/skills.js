import express from 'express';
import Skill from "../models/skill.model.js";
import User from "../models/user.model.js";
import UserSkill from "../models/userSkill.model.js";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {fileURLToPath} from 'url';
import {dirname} from 'path';
import mongoose from 'mongoose';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const iconPath = path.join(__dirname, '../public/uploads/icons');

if (!fs.existsSync(iconPath)) {
    fs.mkdirSync(iconPath, {recursive: true});
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, iconPath);
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
    limits: {fileSize: 1024 * 1024}
});

/* GET home page. */
router.get('/', function (req, res) {
    res.send('respond with a resource');
});

router.get("/:skillTree/view/:id", async (req, res) => {
    const {skillTree, id} = req.params;
    try {
        const skill = await Skill.findOne({id: Number(id)});
        if (skill) {
            res.render("skill_details", {skill, session: req.session});
        } else {
            res.status(404).send(`Skill ${id} not found`);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving skill from database');
    }
});

router.get('/:skillTree/edit/:id', async (req, res) => {
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

router.post('/:skillTree/edit/:id', upload.single('icon'), async (req, res) => {
    const {skillTree, id} = req.params;
    const {action, text, score, description, tasks, resources} = req.body;

    try {
        const skill = await Skill.findOne({id: Number(id)});
        if (!skill) {
            return res.status(404).send('Skill not found');
        }

        if (action === 'save') {
            skill.text = text.trim();
            skill.score = score;
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
            await Skill.findOneAndDelete({id: Number(id)});
            res.redirect(`/`);
        } else {
            res.status(400).send('Invalid action');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error processing request');
    }
});

router.get('/:skillTree/add', async (req, res) => {
    const {skillTree} = req.params;
    res.render('add_skill', {skillTree});
});

router.post('/:skillTree/add', upload.single('icon'), async (req, res) => {
    try {
        const skillTree = req.params.skillTree;
        const {text, score, description, tasks, resources} = req.body;
        const iconPath = req.file ? `/uploads/icons/${req.file.filename}` : null;

        const lastSkill = await Skill.findOne().sort({id: -1});
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
        res.status(500).json({message: 'Failed to create skill', error: error.message});
    }
});

router.post('/:skillTreeName/submit-evidence', async (req, res) => {
    const {skillTreeName} = req.params;
    const {skillId, evidence, userSkillId} = req.body;

    try {
        if (!req.session || !req.session.username) {
            return res.status(401).json({error: 'Usuario no autenticado'});
        }

        const username = req.session.username;
        const user = await User.findOne({username: username});
        if (!user) {
            return res.status(404).json({error: 'Usuario no encontrado'});
        }

        const skill = await Skill.findOne({id: Number(skillId)});
        if (!skill) {
            return res.status(404).json({error: 'Skill no encontrado'});
        }

        let userSkill;
        if (userSkillId) {
            userSkill = await UserSkill.findOne({_id: userSkillId, user: user._id});
            if (!userSkill) {
                return res.status(404).json({error: 'UserSkill no encontrado o no pertenece al usuario'});
            }

            userSkill.evidence = evidence;
            userSkill.completed = true;
            userSkill.completedAt = new Date();
            userSkill.verified = false;

            await userSkill.save();
            return res.status(200).json({message: 'Evidencia actualizada correctamente', userSkill});
        } else {
            userSkill = new UserSkill({
                user: user._id,
                skill: skill._id,
                evidence: evidence,
                completed: true,
                completedAt: new Date(),
                verified: false,
                verifications: [],
            });
            await userSkill.save();
            return res.status(201).json({message: 'Evidencia enviada correctamente', userSkill});
        }
    } catch (error) {
        console.error('Error al enviar la evidencia:', error);
        res.status(500).json({error: 'Error interno del servidor'});
    }
});

router.get('/unverifiedSkills', async (req, res) => {
    try {
        const pendingUserSkills = await UserSkill.aggregate([
            {
                $match: {verified: false}
            },
            {
                $group: {
                    _id: '$skill',
                    count: {$sum: 1}
                }
            },
            {
                $lookup: {
                    from: 'Skill',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'skillDetails'
                }
            },
            {
                $unwind: '$skillDetails'
            },
            {
                $project: {
                    skillId: '$skillDetails.id',
                    count: 1
                }
            }
        ]);

        res.status(200).json(pendingUserSkills);
    } catch (error) {
        console.error('Error al obtener userSkills pendientes:', error);
        res.status(500).json({message: 'Error al obtener los datos.'});
    }
});

router.get('/verifiedSkills', async (req, res) => {
    try {
        const verifiedUserSkills = await UserSkill.aggregate([
            {
                $match: {verified: true}
            },
            {
                $group: {
                    _id: '$skill',
                    count: {$sum: 1}
                }
            },
            {
                $lookup: {
                    from: 'Skill',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'skillDetails'
                }
            },
            {
                $unwind: '$skillDetails'
            },
            {
                $project: {
                    skillId: '$skillDetails.id',
                    count: 1
                }
            }
        ]);

        res.status(200).json(verifiedUserSkills);
    } catch (error) {
        console.error('Error al obtener las habilidades verificadas:', error);
        res.status(500).json({message: 'Error al obtener los datos.'});
    }
});


router.post('/:skillTreeName/:skillID/verify', async (req, res) => {
    const {skillTreeName, skillID} = req.params;
    const {userSkillId, approved} = req.body;

    try {
        if (!req.session || !req.session.username) {
            return res.status(401).json({error: 'Usuario no autenticado'});
        }

        const username = req.session.username;
        const user = await User.findOne({username: username});
        if (!user) {
            return res.status(404).json({error: 'Usuario no encontrado'});
        }

        const userSkill = await UserSkill.findById(userSkillId).populate('skill', 'id text').populate('user', 'username');
        if (!userSkill) {
            return res.status(404).json({ error: 'UserSkill no encontrado' });
        }

        if (userSkill.skill.id !== Number(skillID)) {
            return res.status(400).json({ error: 'El skillID no coincide con el UserSkill' });
        }

        userSkill.verifications.push({
                user: user._id,
                approved: approved,
                verifiedAt: new Date()
            }
        );

        let normalApprovalCount = 0;
        let adminApprovalCount = 0;

        userSkill.verifications.forEach(verification => {
            if (verification.approved) {
                if (verification.user.equals(user._id) && user.admin) {
                    adminApprovalCount += 1;
                } else if (!user.admin) {
                    normalApprovalCount += 1;
                }
            }
        });

        if (adminApprovalCount > 0) {
            userSkill.verified = true;
        } else {
            userSkill.verified = normalApprovalCount >= 3;
        }

        await userSkill.save();
        res.status(200).json({
            message: 'Evidencia confirmada correctamente',
            userSkill: {
                id: userSkill._id,
                verified: userSkill.verified,
                skill: userSkill.skill,
                user: userSkill.user,
                evidence: userSkill.evidence,
            }
        });
    } catch (error) {
        console.error('Error al verificar la evidencia:', error);
        res.status(500).json({error: 'Error interno del servidor'});
    }
});

export default router;