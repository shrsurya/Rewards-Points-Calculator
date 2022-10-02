const Transaction = require("../../models/transaction");
var router = require("express").Router();
const util = require("util");
const MerchantRule = require("../../models/merchant_rule");
const Rule = require("../../models/rule");
router.post("/", validateData, rewardCalc);

function rewardCalc(req, res, next) {
  // first validate the data
  // validateData(req, res);
  try {
    console.log(req.body);
    var txnTable = generateTransactionTable(req.body);
    // Rules generated with calculated priority
    var rules = generateRules();

    // apply rules to the transaction table
    for (let i = 0; i < rules.length; i++) {
      var ret = true;
      while (ret) {
        ret = rules[i].apply(txnTable);
      }
    }
    // apply the 7th rule for remaining $
    applyRule7(txnTable);
    // console.log(util.inspect(txnTable, false, null, true));
    res.status(201).json({
      TotalPoints: txnTable.total_points,
      IndividualPoints: getPointsToReturn(txnTable),
    });
  } catch (e) {
    next(e);
  }
}

function getPointsToReturn(txnTable) {
  var txnID_to_points = new Map();
  for (var [key, value] of [...txnTable.tmap]) {
    for (var txn of value.txns) {
      txnID_to_points[txn.id] = txn.points;
    }
  }
  return txnID_to_points;
}

function applyRule7(txnTable) {
  // % 100 with elminate the cents
  var amount_to_dist =
    txnTable.cumulative_amount - (txnTable.cumulative_amount % 100);
  txnTable.total_points += amount_to_dist / 100;
  txnTable.cumulative_amount -= amount_to_dist;

  // distribute points to each transaction
  for (var [_, value] of [...txnTable.tmap]) {
    if (amount_to_dist <= 0) {
      break;
    }
    if (value.total == 0) {
      continue;
    }
    // sequentially distribute amount for each transaction
    for (var txn of value.txns) {
      if (amount_to_dist <= 0) {
        break;
      }
      if (txn.amount_cents === 0) {
        continue;
      }
      if (txn.amount_cents <= amount_to_dist) {
        amount_to_dist -= txn.amount_cents;
        txn.points += txn.amount_cents / 100;
        txn.amount_cents = 0;
      } else {
        txn.points += amount_to_dist / 100;
        txn.amount_cents -= amount_to_dist;
        amount_to_dist = 0;
      }
    }
  }
}
// Structure
// {
//   total_points = 0
//   tmap:{
//     'sportcheck': {
//       total: 0,
//       txns: [t1,t2]
//     }
//   }
// }
function generateTransactionTable(transactions) {
  var txnTable = {
    total_points: 0,
    cumulative_amount: 0,
    tmap: new Map(),
  };
  // iterate through input json and get a list of txn objects
  for (var key of Object.keys(transactions)) {
    txnTable.cumulative_amount += transactions[key].amount_cents;
    try {
      var txn = new Transaction(
        key,
        transactions[key].date,
        transactions[key].merchant_code,
        transactions[key].amount_cents
      );
    } catch (e) {
      // TODO: if unable to create txn obj, res = err
      next();
    }

    if (!txnTable.tmap.has(txn.merchant_code)) {
      txnTable.tmap.set(txn.merchant_code, {
        total: 0,
        txns: [],
      });
    }
    txnTable.tmap.get(txn.merchant_code).txns.push(txn);
    txnTable.tmap.get(txn.merchant_code).total += txn.amount_cents;
  }
  // used to print object details (all layers)
  // console.log(util.inspect(txnTable, false, null, true));
  return txnTable;
}

function generateRules() {
  var rules = [];

  // rule 1
  var mr1_1 = new MerchantRule("sportcheck", 7500);
  var mr1_2 = new MerchantRule("tim_hortons", 2500);
  var mr1_3 = new MerchantRule("subway", 2500);
  var r1_points = 500;
  var r1 = new Rule(r1_points, [mr1_1, mr1_2, mr1_3]);
  rules.push(r1);

  // rule 4
  var mr4_1 = new MerchantRule("sportcheck", 2500);
  var mr4_2 = new MerchantRule("tim_hortons", 1000);
  var mr4_3 = new MerchantRule("subway", 1000);
  var r4_points = 150;
  var r4 = new Rule(r4_points, [mr4_1, mr4_2, mr4_3]);
  rules.push(r4);

  // rule 2
  var mr2_1 = new MerchantRule("sportcheck", 7500);
  var mr2_2 = new MerchantRule("tim_hortons", 2500);
  var r2_points = 300;
  var r2 = new Rule(r2_points, [mr2_1, mr2_2]);
  rules.push(r2);

  // rule 6
  var mr6_1 = new MerchantRule("sportcheck", 2000);
  var r6_points = 75;
  var r6 = new Rule(r6_points, [mr6_1]);
  rules.push(r6);

  // rule 5
  var mr5_1 = new MerchantRule("sportcheck", 2500);
  var mr5_2 = new MerchantRule("tim_hortons", 1000);
  var r5_points = 75;
  var r5 = new Rule(r5_points, [mr5_1, mr5_2]);
  rules.push(r5);

  // rule 3
  var mr3_1 = new MerchantRule("sportcheck", 7500);
  var r3_points = 200;
  var r3 = new Rule(r3_points, [mr3_1]);
  rules.push(r3);

  return rules;
}

function validateData(req, res, next) {
  // check if json is valid
  // check if all transactions are in the same month
  // check for empty transaction list
  next();
}

module.exports = router;
