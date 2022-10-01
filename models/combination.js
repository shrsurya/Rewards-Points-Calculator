class Combination {
    constructor() {
      this.maxpts = 0;
      this.maxtable = null;
    }

    findBestCombo(txnTable, rules) {
        if (txnTable == null)
          return;

        if (txnTable.total_points > this.maxpts) {
          this.maxpts = txnTable.total_points;
          this.maxtable = txnTable;
        }
        var txnTableList = [];
        for(let i = 0; i < rules.length; i++){
          txnTableList.push(rules[i].apply(txnTable))
        }
        // Apply rule 7 and check if maximum
        
        for(var table of txnTableList){
          this.findBestCombo(table, rules);
        }
    }
}
  
  module.exports = Combination;
  