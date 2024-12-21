import express from 'express';

const router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', {
        title: 'ELECTRONICS',
        session: req.session,
    });
});


export default router;
