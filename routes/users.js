import express from 'express';
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/leaderboard', function(req, res, next) {
  res.render('leaderboard', { title: 'Range Explanations' });
});

export default router;