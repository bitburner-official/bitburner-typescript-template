import { PortSettings } from "/scripts/models/PortSettings.js"
import { HacknetOrder, HacknetUpgrade } from "/scripts/models/HacknetOrder.js"

/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog("ALL")
  // Clear the port before starting to listen. This is used to prevent issues where several responses are sent
  // before the broker can process them. Usually from when messages are sent while the broker is down
  ns.clearPort(PortSettings.HACKNET_BROKER_PORT)
  ns.clearLog()

  while (true) {
    if (ns.peek(PortSettings.HACKNET_BROKER_PORT) != PortSettings.PORT_EMPTY) {
      // Fulfill each individual order
      fulfillOrder(ns, JSON.parse(ns.readPort(PortSettings.HACKNET_BROKER_PORT)))
    } else {
      // Wait for a new Hacknet Order
      await ns.nextPortWrite(PortSettings.HACKNET_BROKER_PORT)
    }
  }
}

function parseOrder(ns) {
  let data = JSON.parse(ns.readPort(PortSettings.HACKNET_BROKER_PORT))
  ns.print(data)
  let order = []
  for (let dat in data) {
    order.push(dat)
  }
  return order
}

/**
 * @param {NS} ns
 * @param {HacknetOrder} order
 */
function fulfillOrder(ns, order) {
  // Buy new hacknet nodes
  for (let i = 0; i < order.nodes; i++) {
    ns.print(`Purchased a hacknet node`)
    ns.hacknet.purchaseNode()
  }
  // Upgrade existing hacknet nodes
  for (let upgrade of order.upgrades) {
    if (upgrade.levels > 0) {
      ns.print(`Purchased ${upgrade.levels} level(s) on node ${upgrade.index}`)
      ns.hacknet.upgradeLevel(upgrade.index, upgrade.levels)
    }

    if (upgrade.ramTiers > 0) {
      ns.print(`Purchased ${upgrade.ramTiers} ram on node ${upgrade.index}`)
      ns.hacknet.upgradeRam(upgrade.index, upgrade.ramTiers)
    }

    if (upgrade.cpus > 0) {
      ns.print(`Purchased ${upgrade.cpus} cores on node ${upgrade.index}`)
      ns.hacknet.upgradeCore(upgrade.index, upgrade.cpus)
    }
  }
}
