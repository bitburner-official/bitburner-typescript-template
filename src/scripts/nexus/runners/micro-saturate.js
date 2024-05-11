/** @param {NS} ns */
export async function main(ns) {
  // Get input params
  var host = ns.args[0]
  var file = ns.args[1]  

  // Get server stats
  var availableRam = ns.getServerMaxRam(host) - ns.getServerUsedRam(host)
  var scriptSize = ns.getScriptRam(file)
  var minSec = ns.getServerMinSecurityLevel(host)
  var maxMoney = ns.getServerMaxMoney(host)

  // Verify admin rights and valid file
  if(ns.fileExists(file)) {
    // Copy script from local directory to server
    ns.scp(file, host)

    // Execute the script
    var result = ns.exec(file, host, parseInt(availableRam/scriptSize), host, minSec, maxMoney)

    // Verify the script started
    if(result == 0) {
        ns.alert("Script Failed to Start. Verify file exists on server")
        ns.exit()
    }

    ns.alert("Script Started")
  } else {
    ns.alert("Script Failed to Start. Invalid script or missing admin privileges on server")
  }
}