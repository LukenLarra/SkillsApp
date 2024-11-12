import express from 'express';
import {getDetails} from '../scripts/skills.js';
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'ELECTRONICS'});
});

router.get('/skill_details', (req, res) => {
    try {
        const details = {
            title: req.query.title || 'No title provided',
            score: req.query.score || 'No score provided',
            svg: decodeURIComponent(req.query.svg || '<svg><text>No SVG provided</text></svg>'),
            description: req.query.description || 'No description provided',
            tasks: JSON.parse(req.query.tasks || '[]'),
            resources: JSON.parse(req.query.resources || '[]')
        };
        res.render('skill_details', details);
    } catch (error) {
        console.error('Error parsing data:', error);
        res.status(400).send('Invalid data format');
    }
});

export default router;