class MerchantRule{
    constructor(merchant, amount){
        // name of the merchant
        this.merchant = merchant,
        this.amount = amount,
        // to determine contribution to total rule amount
        this.weight = 0
    }
}

module.exports = MerchantRule;