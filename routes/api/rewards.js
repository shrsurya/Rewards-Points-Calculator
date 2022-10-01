const Transaction = require("../../models/transaction");
var router = require("express").Router();
const util = require("util");
const MerchantRule = require("../../models/merchant_rule");
const Rule = require("../../models/rule");
const Combination = require("../../models/combination")
router.post("/", validateData, rewardCalc);

function rewardCalc(req, res) {
  var txnTable = generateTransactionTable(req.body);
  var rules = generateRules();
  
  const comboGen = new Combination();
  comboGen.findBestCombo(txnTable, rules);
  console.log(`maxpts = ${comboGen.maxpts}`);
  console.log(util.inspect(comboGen.maxtable, false, null, true));
  // console.log(util.inspect(rules, false, null, true));
  // for (let i = 0; i < rules.length; i++) {
  //   var modified_table = rules[i].apply(txnTable);
    // console.log(`Rule ${i+1}`);
    // console.log(util.inspect(modified_table, false, null, true));
  // }
  // console.log("org_table");
  // console.log(util.inspect(txnTable, false, null, true));
  res.status(201).json({
    data: req.body,
    // data: arr,
  });
}





// {
//   total_points = 0
//   tmap:{
  //   'sportcheck': {
  //     total: 0,
  //     txns: [t1,t2]
  //   }
//   }
// }
function generateTransactionTable(transactions) {
  var txnTable = {
    total_points : 0,
    tmap: new Map()
  };
  // iterate through input json and get a list of txn objects
  for (var key of Object.keys(transactions)) {
    var txn = new Transaction(
      key,
      transactions[key].date,
      transactions[key].merchant_code,
      transactions[key].amount_cents
    );

    if (!txnTable.tmap.has(txn.merchant_code)) {
      txnTable.tmap.set(txn.merchant_code, {
        total: 0,
        txns: [],
      });
    }
    txnTable.tmap.get(txn.merchant_code).txns.push(txn);
    txnTable.tmap.get(txn.merchant_code).total += txn.amount_cents;
  }
  // var keys = Object.keys(txnTable.tmap);
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

  // rule 2
  var mr2_1 = new MerchantRule("sportcheck", 7500);
  var mr2_2 = new MerchantRule("tim_hortons", 2500);
  var r2_points = 300;
  var r2 = new Rule(r2_points, [mr2_1, mr2_2]);
  rules.push(r2);

  // rule 3
  var mr3_1 = new MerchantRule("sportcheck", 7500);
  var r3_points = 200;
  var r3 = new Rule(r3_points, [mr3_1]);
  rules.push(r3);

  // rule 4
  var mr4_1 = new MerchantRule("sportcheck", 2500);
  var mr4_2 = new MerchantRule("tim_hortons", 1000);
  var mr4_3 = new MerchantRule("subway", 1000);
  var r4_points = 150;
  var r4 = new Rule(r4_points, [mr4_1, mr4_2, mr4_3]);
  rules.push(r4);

  // rule 5
  var mr5_1 = new MerchantRule("sportcheck", 2500);
  var mr5_2 = new MerchantRule("tim_hortons", 1000);
  var r5_points = 75;
  var r5 = new Rule(r5_points, [mr5_1, mr5_2]);
  rules.push(r5);

  // rule 6
  var mr6_1 = new MerchantRule("sportcheck", 2000);
  var r6_points = 75;
  var r6 = new Rule(r6_points, [mr6_1]);
  rules.push(r6);

  // rule 7
  // var mr7_1 = new MerchantRule("*", 100);
  // var r7_points = 1;
  // var r7 = new Rule(r7_points, [mr7_1]);
  // rules.push(r7);

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
