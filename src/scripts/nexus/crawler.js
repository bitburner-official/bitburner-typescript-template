import {ServerInfo} from "/scripts/models/ServerInfo.js"
import {PortSettings} from "/scripts/models/PortSettings.js"

let visitedNodes

/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog("ALL")
  while(true) {
    visitedNodes = []
    var servers = await crawl(ns, ns.getHostname())
    writeData(ns, servers)
    ns.print("Sleeping...")
    await ns.sleep(60000)
  }
}

/** @param {NS} ns 
 * @param {string} host The host to crawled
 * @param {number} depth The depth of the host being crawled. Depth is the distance from "home" 
 * @returns {Array<ServerInfo>} An array containing this host and any hosts beneath it in the tree*/
async function crawl(ns, host, depth=0) {
  // Add to visitedNodes to prevent infinite recursion
  visitedNodes.push(host)

  // Attempt to breach any unbreached server
  await attemptBreach(ns, host)

  // Get Server info
  var server = ns.getServer(host)

  var result = [new ServerInfo(host, server.hasAdminRights, server.maxRam, server.maxRam - server.ramUsed, server.cpuCores, ns.getServerMaxMoney(host), depth)]

  // Crawl to adjacent servers
  for(const node of ns.scan(host)) {
    if(!visitedNodes.includes(node)) {
      result = result.concat(await crawl(ns, node, depth + 1))
    }
  }
  return result
}

/** @param {NS} ns 
 * @param {string} host The host that is being breached
*/
async function attemptBreach(ns, host) {
  var server = ns.getServer(host)

  // Attempt to open any ports
  if(!server.ftpPortOpen && ns.fileExists("FTPCrack.exe")) {
    ns.print(`FTP Cracking ${host}`)
    ns.ftpcrack(host)
  }
  if(!server.httpPortOpen && ns.fileExists("HTTPWorm.exe")) {
    ns.print(`HTTP Worming ${host}`)
    ns.httpworm(host)
  }
  if(!server.smtpPortOpen && ns.fileExists("relaySMTP.exe")) {
    ns.print(`SMTP Relaying ${host}`)
    ns.relaysmtp(host)
  }
  if(!server.sqlPortOpen && ns.fileExists("SQLInject.exe")) {
    ns.print(`SQL Injecting ${host}`)
    ns.sqlinject(host)
  }
  if(!server.sshPortOpen && ns.fileExists("BruteSSH.exe")) {
    ns.print(`BruteSSHing ${host}`)
    ns.brutessh(host)
  }

  // re-request the server object to get updated openPortCount
  server = ns.getServer(host)

  // Attempt to hack any servers that can be hacked
  if(server.openPortCount >= ns.getServerNumPortsRequired(host)
    && !server.hasAdminRights) {
    ns.print(`Hacking ${host}`)
    ns.nuke(host)
  }
}

/** @param {NS} ns 
 * @servers {Array<ServerInfo>} servers The servers that are being written to port
*/
function writeData(ns, servers) {
  // Write the full server list
  // TODO: This does not actually work
  var serverFullList = ns.peek(PortSettings.SERVER_FULL_PORT)
  if(serverFullList != servers) {
    ns.clearPort(PortSettings.SERVER_FULL_PORT)
    ns.writePort(PortSettings.SERVER_FULL_PORT, servers)
  }

  // Write the Active server list
  // TODO: This does not actually work
  var activeServerList = ns.peek(PortSettings.SERVER_ACTIVE_PORT)
  var activeServers = getActiveServers(servers)
  if(activeServerList != activeServers) {
    ns.clearPort(PortSettings.SERVER_ACTIVE_PORT)
    ns.writePort(PortSettings.SERVER_ACTIVE_PORT, activeServers)
  }
}

/** @params {Array<ServerInfo} servers The server list to get the currently active (hacked) servers from
 * @returns {Array<ServerInfo} The currently active servers
 */
function getActiveServers(servers) {
  var result = []
  for(var server of servers) {
    if(server["admin"]) {
      result.push(server)
    }
  }

  return result
}
