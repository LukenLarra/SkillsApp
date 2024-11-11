import express from 'express';

const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'ELECTRONICS'});
});

router.get('/skill_details', function(req, res, next) {
    res.render('skill_details', { title: 'Detalles de la Competencia' });
});


export default router;