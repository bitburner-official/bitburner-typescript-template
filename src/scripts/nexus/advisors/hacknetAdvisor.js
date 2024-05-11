import { PortSettings } from "/scripts/models/PortSettings.js"
import { HacknetOrder, HacknetUpgrade } from "/scripts/models/HacknetOrder.js"
import { FinancePosting, FinanceProposal, BrokerRequest } from "/scripts/models/FinanceProposal.js"

const PROPOSAL_TYPE = "Hacknet Node"

/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog("ALL")
  ns.clearLog()
  while (true) {

    await ns.nextPortWrite(PortSettings.FINANCE_REQUESTS_PORT)

    let posting = Object.assign(FinancePosting, JSON.parse(ns.peek(PortSettings.FINANCE_REQUESTS_PORT)))


    for (let proposal of generateProposals(ns, posting.budget, posting.timeframe)) {
      ns.writePort(PortSettings.FINANCE_PROPOSAL_PORT, JSON.stringify(proposal))
    }
  }
}

/** @param {NS} ns
 * @param {number} budget
 * @param {number} timeframe
 * @return {Array<FinanceProposal>}
 */
function generateProposals(ns, budget, timeframe) {
  return generateUpgrades(ns, budget, timeframe)
    .concat(generateNewNodes(ns, budget, timeframe))
}

/** @param {NS} ns
 * @param {number} budget
 * @param {number} timeframe
 * @return {Array<FinanceProposal>}
 */
function generateUpgrades(ns, budget, timeframe) {
  let results = []
  for (let i = 0; i < ns.hacknet.numNodes(); i++) {
    let cost = 0
    let incomeRate = 0
    let levels = 0
    let ram = 0
    let cpus = 0
    let profit
    // TODO: this is skipped, write this logic
    if (ns.fileExists("Formulas.exe", "home") && false) {
      
    } else {
      let node = ns.hacknet.getNodeStats(i)
      levels = Math.min(10, 200 - node.level)
      ram = Math.min(1, node.ram)
      cpus = Math.min(1, 16 - node.cores)

      if (levels > 0 && budget > cost + ns.hacknet.getLevelUpgradeCost(i, levels)) {
        cost += ns.hacknet.getLevelUpgradeCost(i, levels)
      } else {
        levels = 0
      }

      if (ram > 0 && budget > cost + ns.hacknet.getRamUpgradeCost(i, ram)) {
        cost += ns.hacknet.getRamUpgradeCost(i, ram)
      } else {
        ram = 0
      }

      if (cpus > 0 && budget > cost + ns.hacknet.getCoreUpgradeCost(i, cpus)) {
        cost += ns.hacknet.getCoreUpgradeCost(i, cpus)
      } else {
        cpus = 0
      }
      incomeRate = (node.production * ((node.level + levels) / node.level)) - node.production
    }

    profit = (incomeRate * timeframe) - cost

    if ((cpus > 0 || ram > 0 || levels > 0) && profit > 0) {
      ns.print(`Upgrade Node - node: ${i} cost: ${ns.formatNumber(cost)} profit: ${ns.formatNumber(profit)}`)

      let upgrade = new HacknetUpgrade(i, levels, ram, cpus)
      results.push(buildProposalMessage(cost, profit, 0, [upgrade]))
    }
  }

  return results
}

/** @param {NS} ns
 * @param {number} budget
 * @param {number} timeframe
 * @return {Array<FinanceProposal>}
 */
function generateNewNodes(ns, budget, timeframe) {
  let results = []
  let cost = 0
  // TODO: this is hardcoded
  let incomeRate = 2
  let profit = (incomeRate * timeframe) - ns.hacknet.getPurchaseNodeCost()
  if (ns.hacknet.getPurchaseNodeCost() < budget && profit > 0) {
    cost += ns.hacknet.getPurchaseNodeCost()
    
    results.push(buildProposalMessage(cost, profit, 1, []))
    ns.print(`Purchase Node - cost: ${ns.formatNumber(cost)} profit: ${ns.formatNumber(profit)}`)
  }

  return results
}

/** @param {number} cost
 * @param {Number} profit
 * @param {Number} nodes
 * @param {Array<HacknetUpgrade>} upgrades
 * @return {HacknetOrder}
 */
function buildProposalMessage(cost, profit, nodes = 0, upgrades = []) {
  let brokerOrder = new HacknetOrder(nodes, upgrades)
  return new FinanceProposal(PROPOSAL_TYPE, cost, profit, new BrokerRequest(PortSettings.HACKNET_BROKER_PORT, brokerOrder))
}
