var router = require("express").Router();

router.post("/", validateData, rewardCalc);

function rewardCalc(req, res) {
  res.status(201).json({
    data: req.body,
  });
}

function validateData(req, res, next) {
  // check if json is valid
  // check if all transactions are in the same month
  // check for empty transaction list
  // create a seperate func to parse transactions in required datastructure
  next();
}

module.exports = router;
