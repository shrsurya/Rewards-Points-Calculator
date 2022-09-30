class Transaction{
    constructor(id, date, merchant_code, amount_cents){
        this.id = id;
        this.date = new Date(date);
        this.merchant_code = merchant_code;
        this.amount_cents = amount_cents;
        this.points = 0;
    }
}

module.exports = Transaction;