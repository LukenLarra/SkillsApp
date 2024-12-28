import express from 'express';
import Skill from "../models/skill.model.js";

const router = express.Router();

/* GET home page. */
router.get('/', async function (req, res) {
    const success_msg = req.session.success_msg || null;
    const error_msg = req.session.error_msg || null;
    const error = req.session.error || null;

    delete req.session.success_msg;
    delete req.session.error_msg;
    delete req.session.error;

    const user = req.session.username ? {
        username: req.session.username,
        isAdmin: req.session.role === 'admin',
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

    res.render('index', {
        title: 'ELECTRONICS',
        success_msg: success_msg,
        error_msg: error_msg,
        error: error,
        user: user,
        skillTree: skillSets
    });
});


export default router;
