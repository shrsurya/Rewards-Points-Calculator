// Calculate the fraction for each rule in the constructor
class Rule {
  constructor(points, merchant_rules) {
    this.merchant_rules = merchant_rules;
    this.points = points;
    this.total_points_per_dollar = 0;
    this.total_dollars = 0;
    this.merchant_names = new Set();

    // distribute the weight for each merchant
    // i.e percentage of amount contributing the total points
    this.total_dollars = 0;
    for (const mr of merchant_rules) {
      this.total_dollars += mr.amount;
    }
    for (const mr of merchant_rules) {
      mr.weight = mr.amount / this.total_dollars;
    }

    // get merchant name list
    for (const mr of merchant_rules){
      this.merchant_names.add(mr.merchant);
    }
  }

  apply(txnTable) {
    // validate that the rule applies to the current transaction Table
    if (!this.validate(txnTable)) {
      // console.log("Validation failed");
      return false;
    }
    // console.log("Validated");
    for (var mr of this.merchant_rules) {
      // decrease cumulative amount in the table
      txnTable.cumulative_amount -= mr.amount;
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
          txn.points += (amount_to_dist / mr.amount) * mr.weight * this.points;
          amount_to_dist = 0;
        }
        // TODO: manage split rounding
        // i.e when 3 merchants have % split: eg 83.33, 33.34, 33.34
        // round will not cumulatively add to full value
        txn.points = Math.round(txn.points);
      }
    }
    txnTable.total_points += this.points;
    return true;
  }

  validate(txnTable) {
    // iterate through merchant_rules: MRi
    // if MRi in txnTable and txnTable[MRi.merchant] >= MRi.amount
    for (var mr of this.merchant_rules) {
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
