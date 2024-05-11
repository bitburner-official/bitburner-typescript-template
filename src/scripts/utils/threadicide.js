import {PortSettings} from "/scripts/models/PortSettings.js"

/** @param {NS} ns */
export async function main(ns) {
  var servers = ns.readPort(PortSettings.SERVER_ACTIVE_PORT)
  ns.killall("home", true)
  for(var server of servers) {
    ns.killall(server["name"])
  }
}