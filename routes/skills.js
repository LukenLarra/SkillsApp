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
router.get("/:skillTree/view/:id", async (req, res) => {
    const {skillTree, id} = req.params;

    const user = req.session.username ? {
        username: req.session.username,
        isAdmin: req.session.role === 'admin',
    } : null;

    try {
        const skill = await Skill.findOne({id: Number(id)});
        if (skill) {
            res.render("skill_details", {
                skill,
                user: user
            });
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
            req.session.error_msg = 'User not found';
            return res.redirect('/');
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
            req.session.success_msg = 'Skill updated successfully';
            return res.redirect('/');

        } else if (action === 'cancel') {
            return res.redirect('/');

        } else if (action === 'delete') {
            await Skill.findOneAndDelete({id: Number(id)});
            req.session.success_msg = 'Skill deleted successfully';
            return res.redirect('/');

        } else {
            req.session.error_msg = 'Invalid action. Please try again';
            return res.redirect('/');
        }
    } catch (err) {
        console.error(err);
        req.session.error_msg = 'Error editing skill';
        return res.status(500).json({message: 'Error editing skill'});
    }
});

router.get('/:skillTree/add', async (req, res) => {
    const {skillTree} = req.params;

    res.render('add_skill', {
        skillTree
    });
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
        req.session.success_msg = 'Skill added successfully';
        return res.status(200).json({message: 'Skill added successfully'});
    } catch (error) {
        console.error(error);
        req.session.error_msg = 'Failed to edit skill';
        return res.status(500).json({message: 'Failed to edit skill'});
    }
});

router.post('/:skillTreeName/submit-evidence', async (req, res) => {
    const {skillTreeName} = req.params;
    const skillId = req.body.id;
    const evidence = req.body.evidence;
    const userSkillId = req.body.userSkillId;

    try {
        if (!req.session || !req.session.username) {
            req.session.error_msg = 'User not authenticated';
            return res.status(401).json({message: 'User not authenticated'});
        }
        console.log(skillId);
        const username = req.session.username;
        const user = await User.findOne({username: username});
        if (!user) {
            req.session.error_msg = 'User not found';
            return res.status(404).json({message: 'User not found'});
        }

        const skill = await Skill.findOne({id: Number(skillId)});
        if (!skill) {
            req.session.error_msg = 'Skill not found';
            return res.status(404).json({message: 'Skill not found'});
        }

        let userSkill;
        if (userSkillId) {
            userSkill = await UserSkill.findOne({_id: userSkillId, user: user._id});
            if (!userSkill) {
                req.session.error_msg = 'UserSkill not found';
                return res.status(404).json({message: 'UserSkill not found'});
            }

            userSkill.evidence = evidence;
            userSkill.completed = true;
            userSkill.completedAt = new Date();
            userSkill.verified = false;

            await userSkill.save();
            req.session.success_msg = 'Evidencia actualizada correctamente';
            return res.status(200).json({message: 'Evidencia actualizada correctamente'});
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
            console.log(userSkill);
            await userSkill.save();
            req.session.success_msg = 'Evidencia enviada correctamente';
            return res.status(200).json({message: 'Evidencia enviada correctamente'});
        }
    } catch (error) {
        console.error('Error al enviar la evidencia:', error);
        req.session.error_msg = 'Server Error';
        return res.status(500).json({message: 'Server Error'});
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
                $unwind: '$verifications'
            },
            {
                $lookup: {
                    from: 'User',
                    localField: 'verifications.user',
                    foreignField: '_id',
                    as: 'verifierDetails'
                }
            },
            {
                $unwind: '$verifierDetails'
            },
            {
                $group: {
                    _id: '$skill',
                    count: {$sum: 1},
                    adminVerified: {
                        $sum: {
                            $cond: [{$eq: ['$verifierDetails.admin', true]}, 1, 0]
                        }
                    }
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
                    count: 1,
                    adminVerified: {$gt: ['$adminVerified', 0]}
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
            req.session.error_msg = 'User not authenticated';
            return res.status(401).json({message: 'User not authenticated'});
        }

        const username = req.session.username;

        const [verifyUser, userSkill] = await Promise.all([
            User.findOne({username: username}),
            UserSkill.findById(userSkillId).populate('skill').populate('user')
        ]);

        if (!verifyUser) {
            req.session.error_msg = 'User not found';
            return res.status(404).json({message: 'User not found'});
        }

        if (!userSkill) {
            req.session.error_msg = 'UserSkill not found';
            return res.status(404).json({message: 'UserSkill not found'});
        }

        if (userSkill.skill.id !== Number(skillID)) {
            req.session.error_msg = 'UserSkill does not match skill';
            return res.status(400).json({message: 'UserSkill does not match skill'});
        }

        userSkill.verifications.push({
                user: verifyUser._id,
                approved: approved,
                verifiedAt: new Date()
            }
        );

        let normalApprovalCount = 0;
        let adminApprovalCount = false;

        userSkill.verifications.forEach(verification => {
            if (verification.approved) {
                if (verification.user.equals(verifyUser._id) && verifyUser.admin) {
                    adminApprovalCount = true;
                } else if (!verifyUser.admin) {
                    normalApprovalCount += 1;
                };
            }
        });

        userSkill.verified = adminApprovalCount || normalApprovalCount >= 3;

        if (userSkill.verified) {
            const skillId = userSkill.skill._id;
            const evidenceUser = await User.findOne({_id: userSkill.user});

            if (evidenceUser) {
                const existingIndex = evidenceUser.completedSkills.findIndex(id => id.equals(skillId));
                if (existingIndex === -1) {
                    evidenceUser.completedSkills.push(skillId);
                }else {
                    evidenceUser.completedSkills[existingIndex] = skillId;
                }
            }

            await evidenceUser.save();
        }

        await userSkill.save();
        req.session.success_msg = 'Evidencia verificada correctamente';
        return res.status(200).json({message: 'Evidencia verificada correctamente'});
    } catch (error) {
        console.error('Error al verificar la evidencia:', error);
        req.session.error_msg = 'Server Error';
        return res.status(500).json({message: 'Server Error'});
    }
});

export default router;