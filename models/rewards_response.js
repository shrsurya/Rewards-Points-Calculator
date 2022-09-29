class RewardsResponse {
  constructor(totalRewards, txnRewardsList) {
    this.totalRewards = totalRewards;
    this.txnRewardsList = txnRewardsList;
  }
}

module.exports = RewardsResponse;
