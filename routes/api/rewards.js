const Transaction = require("../../models/transaction");
var router = require("express").Router();
const util = require("util");

router.post("/", validateData, rewardCalc);

const PARTNER_MERCHANTS = new Set(["sportcheck", "tim_hortons", "subway"]);
// {
//   'sportcheck': {
//     total: 0,
//     txn: [t1,t2]
//   }
// }
function generateTransactionTable(transactions) {
  var txnTable = new Map();

  // iterate through input json and get a list of txn objects
  for (var key of Object.keys(transactions)) {
    var txn = new Transaction(
      key,
      transactions[key].date,
      transactions[key].merchant_code,
      transactions[key].amount_cents
    );

    if (!txnTable.has(txn.merchant_code)) {
      txnTable.set(txn.merchant_code, []);
    }
    txnTable.get(txn.merchant_code).push(txn);

    // console.log(key + " -> " + JSON.stringify(txn));
  }
  console.log(util.inspect(txnTable, false, null, true));
}

function rewardCalc(req, res) {
  generateTransactionTable(req.body);

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
