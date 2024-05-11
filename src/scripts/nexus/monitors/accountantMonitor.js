import {PortSettings} from "/scripts/models/PortSettings.js"



/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog("ALL")
  let width = 500
  let height = 100
  let fudge = 5
  let windowSize = ns.ui.windowSize()
  ns.tail()
  ns.resizeTail(width, height)
  ns.moveTail(windowSize[0] - (width + fudge), windowSize[1] - (height + fudge))
  while(true) {
    // Wait for server data to be populated
    while(ns.peek(PortSettings.SERVER_ACTIVE_PORT) == PortSettings.PORT_EMPTY) {
      await ns.sleep(1000)
    }

    let servers = ns.peek(PortSettings.SERVER_ACTIVE_PORT)
    let totalValue = 0
    let potentialValue = 0
    for(let server of servers) {
      let host = server["name"]
      if(ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(host) && host != "home") {
        totalValue += ns.getServerMoneyAvailable(host)
        potentialValue += ns.getServerMaxMoney(host)
      }
    }
    
    ns.clearLog()
    ns.print(`Total Value on Servers: \$${ns.formatNumber(totalValue, 2)}`)
    ns.print(`Total Potential Value: \$${ns.formatNumber(potentialValue, 2)}`)
    await ns.sleep(20000)
  }
}