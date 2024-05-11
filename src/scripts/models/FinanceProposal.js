export class FinancePosting {
  budget;
  timeframe;

  /**
   * @param {Number} budget
   * @param {Number} timeframe
  */
  constructor(budget, timeframe) {
    this.budget = budget
    this.timeframe = timeframe
  }

}

export class FinanceProposal {
  type;
  cost;
  profit;
  request;

  /**
   * @param {string} type
   * @param {Number} cost
   * @param {Number} profit
   * @param {BrokerRequest} request
  */
  constructor(type, cost, profit, request) {
    this.type = type
    this.cost = cost
    this.profit = profit
    this.request = request
  }
}

export class BrokerRequest {
  port;
  data;

  /** @param {Number}} port */
  /** @param {BrokerOrder} data */
  constructor(port, data) {
    this.port = port
    this.data = data
  }
}

export class BrokerOrder {

}
