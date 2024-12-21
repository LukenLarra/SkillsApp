import express from 'express';

const router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    const success_msg = req.session.success_msg || null;
    const error_msg = req.session.error_msg || null;
    const error = req.session.error || null;

    delete req.session.success_msg;
    delete req.session.error_msg;
    delete req.session.error;

    res.render('index', {
        title: 'ELECTRONICS',
        session: req.session,
        success_msg: success_msg,
        error_msg: error_msg,
        error: error,
    });
});


export default router;
