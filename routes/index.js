import express from 'express';
import {getSkillDetails} from '../scripts/skills.js';
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'ELECTRONICS'});
});

router.get('/skill_details', function(req, res, next) {
    const buffer = getSkillDetails();
    console.log(buffer);

    res.render('skill_details', getSkillDetails());
});

export default router;