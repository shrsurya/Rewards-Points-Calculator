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

    for (var mr of this.merchant_rules) {
      if (mr.merchant === "*") {
        // add mr.amount points($1) for each dollar remaining
        // get all transactions
        for (var key of Object.keys(txnTable.tmap)){
          var amount_to_dist = mr.amount;
          for (var txn of key.txns) {
            if (txn.amount_cents >= 100){
              txnTable.total_points += txn.amount_cents;
              txn.amount_cents = 0;
            }
          }
        }
        txnTable.total_points

      } else {
        txnTable.tmap.get(mr.merchant).total -= mr.amount;
        var amount_to_dist = mr.amount;
        var txns = txnTable.tmap.get(mr.merchant).txns;
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
        txnTable.total_points+=this.points;
      }
    }
    return txnTable;
  }

  hasADollar(txnTable) {
    for (var key of Object.keys(txnTable.tmap)) {
      if (key.total >= 1) {
        return true;
      }
    }
    return false;
  }

  validate(txnTable) {
    // iterate through merchant_rules: MRi
    // if MRi in txnTable and txnTable[MRi.merchant] >= MRi.amount
    if ((this.merchant_rules.find(e => e.merchant === "*") && !this.hasADollar(txnTable))) {
      return false;
    }
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
