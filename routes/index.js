import express from 'express';
import {getSkillDetails} from '../scripts/get_skills.js';
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'ELECTRONICS'});
});

router.get('/skill_details', function(req, res, next) {
    const skillDetails = req.body;
    res.render('skill_details', skillDetails);
});

export default router;