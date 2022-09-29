var router = require("express").Router();
// var transaction = require("models");

router.post("/", validateData, rewardCalc);

function rewardCalc(req, res) {
  var arr = JSON.parse(JSON.stringify(req.body));
  var transactions = new Map(Object.entries(arr));
  // console.log(transactions.get('T01'));
  // var txnList;
  // for (const [key, value] of transactions.entries()){

  // }
  

  res.status(201).json({
    data: req.body,
    // data: arr,
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
