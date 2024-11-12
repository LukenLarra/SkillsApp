import express from 'express';
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'ELECTRONICS'});
});

router.get('/skill_details', function(req, res, next) {
    res.render('skill_details', {
        title: 'Detalles de la Competencia',
        score: '1 points',
        svg: 'svg',
        description: 'This is a description of the skill',
        tasks:  ['task 1', 'task 2', 'task 3'],
        resources: ['resource 1', 'resource 2', 'resource 3']
    });
});

export default router;