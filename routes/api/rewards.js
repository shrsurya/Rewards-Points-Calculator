const Transaction = require("../../models/transaction");
var router = require("express").Router();
const util = require("util");
const MerchantRule = require("../../models/merchant_rule");
const Rule = require("../../models/rule");

router.post("/", validateData, rewardCalc);

const PARTNER_MERCHANTS = new Set(["sportcheck", "tim_hortons", "subway"]);


function rewardCalc(req, res) {
  var txnTable = generateTransactionTable(req.body);
  console.log(util.inspect(txnTable, false, null, true));
  var rules = generateRules();
  // console.log(util.inspect(rules, false, null, true));

  for (let i =0; i< rules.length; i++){
    var modified_txn_table = rules[i].apply(txnTable);
    console.log(util.inspect(modified_txn_table, false, null, true));
  }

  res.status(201).json({
    data: req.body,
    // data: arr,
  });
}
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
      txnTable.set(txn.merchant_code, {
        total: 0,
        txns: []
      });
    }
    txnTable.get(txn.merchant_code).txns.push(txn);
    txnTable.get(txn.merchant_code).total += txn.amount_cents;
  }
  // used to print object details (all layers)
  // console.log(util.inspect(txnTable, false, null, true));
  return txnTable;
}

function generateRules(){
  var rules = [];
  var MR1_1 = new MerchantRule("sportcheck", 2500);
  var MR1_2 = new MerchantRule("tim_hortons", 100);
  var MR1_3 = new MerchantRule("subway", 300);
  var R1_points = 500;
  var r1 = new Rule(R1_points, [MR1_1, MR1_2, MR1_3]);
  rules.push(r1);
  return rules;
}

function validateData(req, res, next) {
  // check if json is valid
  // check if all transactions are in the same month
  // check for empty transaction list
  // create a seperate func to parse transactions in required datastructure
  next();
}

module.exports = router;
