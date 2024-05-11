import {PortSettings} from "/scripts/models/PortSettings.js"

/** @param {NS} ns */
export async function main(ns) {
  var ramGigs

  while(true) {
      await ns.nextPortWrite(PortSettings.SERVER_BROKER_PORT)
      ramGigs = ns.readPort(PortSettings.SERVER_BROKER_PORT)
      ns.purchaseServer("hack-node", ramGigs)
  }
}