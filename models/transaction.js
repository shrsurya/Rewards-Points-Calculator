class Transaction{
    constructor(date, merchant_code, amount_cents){
        this.data = new Date(date);
        this.merchant_code = merchant_code;
        this.amount_cents = amount_cents;
    }
}

module.exports = Transaction;