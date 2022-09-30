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
    // iterate through merchant_rules: MRi
    // if MRi in txnTable and txnTable[MRi.merchant] >= MRi.amount
    if (!this.validate(txnTable)){
        return null;
    }

  }

  validate(txnTable){
    // iterate through merchant_rules: MRi
    // if MRi in txnTable and txnTable[MRi.merchant] >= MRi.amount
    for (mr in this.merchant_rules){
        if (!(txnTable.has(mr.merchant) && txnTable.get(mr.merchant).total >= mr.amount)){
            return false;
        }
    }
    return true;
  }
}

module.exports = Rule;
