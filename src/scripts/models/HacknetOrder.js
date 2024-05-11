import { BrokerOrder } from "/scripts/models/FinanceProposal.js"

export class HacknetOrder extends BrokerOrder {
  /**
   * The number of nodes to purchase
   * @type {number}
   * @public
   */
  nodes;
  /**
   * The list of HacknetUpgrades to apply
   * @type {Array<HacknetUpgrade>}
   * @public
   */
  upgrades;

  /** @param {Number}} nodes */
  /** @param {Array<HacknetUpgrade>} upgrades */
  constructor(nodes = 0, upgrades = []) {
    super()
    this.nodes = nodes
    this.upgrades = upgrades
  }
}

export class HacknetUpgrade {
  index;
  levels;
  ramTiers;
  cpus;

  /** 
   * @param {Number} index
   * @param {Number} levels 
   * @param {Number} ramTiers 
   * @param {Number} cpus 
  */
  constructor(index, levels = 0, ramTiers = 0, cpus = 0) {
    this.index = index
    this.levels = levels
    this.ramTiers = ramTiers
    this.cpus = cpus
  }
}