import {PortSettings} from "/scripts/models/PortSettings.js"

/** @param {NS} ns */
export async function main(ns) {
  var servers = ns.peek(PortSettings.SERVER_ACTIVE_PORT)
  var totalValue = 0
  var potentialValue = 0
  var host
  for(var server of servers) {
    host = server["name"]
    if(ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(host) && host != "home") {
      totalValue += ns.getServerMoneyAvailable(host)
      potentialValue += ns.getServerMaxMoney(host)
    }
  }
  ns.tprint(`Total Value on Servers: \$${ns.formatNumber(totalValue, 2)}`)
  ns.tprint(`Total Potential Value: \$${ns.formatNumber(potentialValue, 2)}`)
}