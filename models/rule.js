const cloneDeep = require("lodash.clonedeep");
const util = require("util");

// Calculate the fraction for each rule in the constructor
class Rule {
  constructor(points, merchant_rules) {
    this.merchant_rules = merchant_rules;
    this.points = points;

    // distribute the weight for each merchant
    // i.e percentage of amount contributing the total points
    var total = 0;
    for (const mr of merchant_rules) {
      total += mr.amount;
    }
    for (const mr of merchant_rules) {
      mr.weight = mr.amount / total;
    }
  }

  apply(ogTxnTable) {
    // validate that the rule applies to the current transaction Table
    var txnTable = cloneDeep(ogTxnTable);
    if (!this.validate(txnTable)) {
      console.log("Validation failed");
      return null;
    }

    for (var mr of this.merchant_rules) {
      // this condition only happens once
      if (mr.merchant === "*") {
        // add mr.amount points for each dollar remaining
        // for all merchants in txn map
        amount_to_dist = mr.amount;
        for (var [key, value] of [...txnTable.tmap]) {
          if (amount_to_dist <= 0) {
            break;
          }
          for (var txn of value.txns) {
            if (amount_to_dist <= 0) {
              break;
            }
            if (txn.amount_cents === 0) {
              continue;
            }
            if (txn.amount_cents <= amount_to_dist) {
              amount_to_dist -= txn.amount_cents;
              txn.points +=
                (txn.amount_cents / mr.amount) * mr.weight * this.points;
              txn.amount_cents = 0;
            } else {
              txn.amount_cents -= amount_to_dist;
              txn.points +=
                (amount_to_dist / mr.amount) * mr.weight * this.points;
              amount_to_dist = 0;
            }
            txn.points = Math.round(txn.points);
          }
          txnTable.total_points += this.points;
        }
      } else {
        // decrease applied promotion amount for the merchant
        txnTable.tmap.get(mr.merchant).total -= mr.amount;
        var amount_to_dist = mr.amount;
        var txns = txnTable.tmap.get(mr.merchant).txns;
        // converting txn amount to points
        for (var txn of txns) {
          if (amount_to_dist <= 0) {
            break;
          }
          if (txn.amount_cents === 0) {
            continue;
          }
          if (txn.amount_cents <= amount_to_dist) {
            amount_to_dist -= txn.amount_cents;
            txn.points +=
              (txn.amount_cents / mr.amount) * mr.weight * this.points;
            txn.amount_cents = 0;
          } else {
            txn.amount_cents -= amount_to_dist;
            txn.points +=
              (amount_to_dist / mr.amount) * mr.weight * this.points;
            amount_to_dist = 0;
          }
          txn.points = Math.round(txn.points);
        }
        txnTable.total_points += this.points;
      }
    }
    return txnTable;
  }

  hasAtLeast(amount, txnTable) {
    var total_amount_txnTable = 0;

    for (var [key,value] of [...txnTable.tmap]) {
      total_amount_txnTable += value.total;
      if (total_amount_txnTable >= amount) {
        return true;
      }
    }
    return false;
  }

  validate(txnTable) {
    // if merchant '*' exists, that rule works for all
    // as long as theres at least 1 merchant with the given mr.amount
    var star_merchant = this.merchant_rules.find((e) => e.merchant === "*");
    var keys = Object.keys(txnTable.tmap);
    console.log(util.inspect(keys, false, null, true));

    if (star_merchant && !this.hasAtLeast(star_merchant.amount, txnTable)) {
      return false;
    }

    // iterate through merchant_rules: MRi
    // if MRi in txnTable and txnTable[MRi.merchant] >= MRi.amount
    for (var mr of this.merchant_rules) {
      if (mr.merchant === "*") {
        continue;
      }
      if (
        !(
          txnTable.tmap.has(mr.merchant) &&
          txnTable.tmap.get(mr.merchant).total >= mr.amount
        )
      ) {
        return false;
      }
    }
    return true;
  }
}

module.exports = Rule;
