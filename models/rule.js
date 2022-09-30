// Calculate the fraction for each rule in the constructor
class Rule {
  constructor(points, merchant_rules) {
    this.merchant_rules = merchant_rules;
    this.points = points;

    var total = 0;
    for (const mr of merchant_rules) {
      total += mr.amount;
    }
    for (const mr of merchant_rules) {
      mr.weight = mr.amount / total;
    }
  }

  apply(txnTable) {
    if (!this.validate(txnTable)) {
      return null;
    }

    // for each merchant rule in current rule
    // txnTable.get(merchant).total -= mr.amount
    // amount_to_dist = mr.amount
    // txns = txnTable.get(merchant).txns
    // for txn in txns
    //    if amount_to_dist <= 0:
    //        break;
    //    if txn.amount_cents <= amount_to_dist:
    //        amount_to_dist -= txn.amount_cents
    //        txn.points = (txn.amount_cents/mr.amount) * mr.weight * this.points;
    //        txn.amount_cents = 0
    //    else:
    //        txn.amount_cents -= amount_to_dist
    //        txn.points = (amount_to_dist/mr.amount) * mr.weight * this.points;
    //        amount_to_dist = 0

    for (var mr of this.merchant_rules) {
      txnTable.get(mr.merchant).total -= mr.amount;
      var amount_to_dist = mr.amount;
      var txns = txnTable.get(mr.merchant).txns;
      for (var txn of txns) {
        if (amount_to_dist <= 0) {
          break;
        }
        if (txn.amount_cents === 0) {
          continue;
        }
        if (txn.amount_cents <= amount_to_dist) {
          amount_to_dist -= txn.amount_cents;
          txn.points += (txn.amount_cents / mr.amount) * mr.weight * this.points;
          txn.amount_cents = 0;
        } else {
          txn.amount_cents -= amount_to_dist;
          txn.points += (amount_to_dist / mr.amount) * mr.weight * this.points;
          amount_to_dist = 0;
        }
        txn.points = Math.round(txn.points)
      }
    }
    return txnTable;
  }

  validate(txnTable) {
    // iterate through merchant_rules: MRi
    // if MRi in txnTable and txnTable[MRi.merchant] >= MRi.amount
    for (var mr of this.merchant_rules) {
      if (
        !(
          txnTable.has(mr.merchant) &&
          txnTable.get(mr.merchant).total >= mr.amount
        )
      ) {
        return false;
      }
    }
    return true;
  }
}

module.exports = Rule;
