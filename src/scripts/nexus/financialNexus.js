import { PortSettings } from "/scripts/models/PortSettings.js"
import { FinancePosting, FinanceProposal, BrokerRequest, BrokerOrder } from "/scripts/models/FinanceProposal.js"

/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog("ALL")
  ns.clearLog()
  // Clear Ports
  ns.clearPort(PortSettings.FINANCE_REQUESTS_PORT)
  ns.clearPort(PortSettings.FINANCE_PROPOSAL_PORT)

  await ns.sleep(5000)
  
  while (true) {
    let proposals = []
    let budget = getBudget(ns)
    // Request proposals and wait for them to arrive
    let posting = new FinancePosting(budget, getRemainingTime(ns))
    ns.writePort(PortSettings.FINANCE_REQUESTS_PORT, JSON.stringify(posting))
    ns.print("Requesting Proposals")

    // Give time for responses
    await ns.sleep(5000)

    // Get a list of proposals from all of the data on the port
    while (ns.peek(PortSettings.FINANCE_PROPOSAL_PORT) != PortSettings.PORT_EMPTY) {
      proposals.push(JSON.parse(ns.readPort(PortSettings.FINANCE_PROPOSAL_PORT)))
    }

    ns.print(`Received ${proposals.length} Proposals`)

    // Choose which proposals to use and publish orders
    for (let selection of chooseProposals(ns, proposals, budget)) {
      ns.writePort(selection.request.port, JSON.stringify(selection.request.data))
    }

    // Clear Ports
    ns.clearPort(PortSettings.FINANCE_REQUESTS_PORT)
    ns.clearPort(PortSettings.FINANCE_PROPOSAL_PORT)

    // Sleep between making decisions
    ns.print("Sleeping...")
    await ns.sleep(25000)
  }
}

/** @param {NS} ns
 * @returns {number} The total budget of the request */
function getBudget(ns) {
  // TODO: Make this more complex
  return ns.getPlayer().money * .75
}

function getRemainingTime(ns) {
  // TODO: this probably needs to be determined somewhere more general
  const DAY_MILLISECONDS = 86400000
  const HOUR_MILLISECONDS = 3600000
  let reset = ns.getResetInfo()
  return (reset.lastAugReset + (HOUR_MILLISECONDS * 8) - Date.now()) / 1000
}

/** @param {NS} ns
 * @param {Array<FinanceProposal>} proposals The proposals to evaluate
 * @param {number} budget The amount of money that can be spent
 * @returns {Array<FinanceProposal>} The proposals that have been choosen to implement */
function chooseProposals(ns, proposals, budget) {
  let results = []
  let cost = 0
  for (let proposal of proposals) {
    // TODO: Actually choose proposals based on logic
    if (cost + proposal.cost < budget) {
      cost += proposal.cost
      results.push(proposal)
      ns.print(`Accepted proposal: ${proposal.type} - \$${ns.formatNumber(proposal.cost)}`)
    } else {
      ns.print(`Rejected proposal: ${proposal.type} - \$${ns.formatNumber(proposal.cost)}`)
    }
  }

  return results
}
