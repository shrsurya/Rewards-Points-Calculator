// Calculate the fraction for each rule in the constructor
class Rule{
    constructor(points, merchant_rules){
        this.merchant_rules = merchant_rules;
        this.points = points;
        
        var total = 0
        for (const mr of merchant_rules){
            total += mr.amount
        }
        for (const mr of merchant_rules){
            mr.weight = mr.amount / total
        }
    }
}

module.exports = Rule;