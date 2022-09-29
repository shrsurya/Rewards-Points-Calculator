var router = require('express').Router();

router.use('/rewards', require('./rewards'));

module.exports = router;