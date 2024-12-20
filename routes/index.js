import express from 'express';

const router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    const success_msg = req.query.success_msg || null;
    const error_msg = req.query.error_msg || null;

    res.render('index', {
        title: 'ELECTRONICS',
        session: req.session,
        success_msg,
        error_msg,
    });
});


export default router;
