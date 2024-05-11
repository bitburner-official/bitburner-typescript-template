import { PortSettings } from "/scripts/models/PortSettings.js"

/** @param {NS} ns */
export async function main(ns) {
  var host = ns.getHostname()

  // Kill all scripts currently running on the server
  ns.killall(host, true)
  ns.clearPort(PortSettings.BOOTSTRAP_PORT)
  // Runs the server crawler to hack and generate a list of servers
  ns.writePort(PortSettings.BOOTSTRAP_PORT, "/scripts/nexus/crawler.js")
  ns.writePort(PortSettings.BOOTSTRAP_PORT, "/scripts/nexus/proliferatorNexus.js")
  ns.writePort(PortSettings.BOOTSTRAP_PORT, "/scripts/nexus/workerNexus.js")
  
  ns.writePort(PortSettings.BOOTSTRAP_PORT, "/scripts/nexus/financialNexus.js")
  ns.writePort(PortSettings.BOOTSTRAP_PORT, "/scripts/nexus/brokers/hacknetBroker.js")
  ns.writePort(PortSettings.BOOTSTRAP_PORT, "/scripts/nexus/advisors/hacknetAdvisor.js")

  ns.writePort(PortSettings.BOOTSTRAP_PORT, "/scripts/nexus/brokers/serverBroker.js")

  // Start the monitors
  ns.writePort(PortSettings.BOOTSTRAP_PORT, "/scripts/nexus/monitors/accountantMonitor.js")
  
  /*for(let script of ns.ls(host, "crawler.js")) {
    ns.writePort(PortSettings.BOOTSTRAP_PORT, script)
  }

  for(let script of ns.ls(host, "Nexus.js")) {
    ns.writePort(PortSettings.BOOTSTRAP_PORT, script)
  }

  for(let script of ns.ls(host, "Broker.js")) {
    ns.writePort(PortSettings.BOOTSTRAP_PORT, script)
  }

  for(let script of ns.ls(host, "Manager.js")) {
    ns.writePort(PortSettings.BOOTSTRAP_PORT, script)
  }

  for(let script of ns.ls(host, "Advisor.js")) {
    ns.writePort(PortSettings.BOOTSTRAP_PORT, script)
  }

  for(let script of ns.ls(host, "Monitor.js")) {
    ns.writePort(PortSettings.BOOTSTRAP_PORT, script)
  }*/

  ns.spawn("/scripts/bootstrap/bootstrapHandler.js", {threads: 1, spawnDelay: 500})
}