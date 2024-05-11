import {PortSettings} from "/scripts/models/PortSettings.js"

/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog("ALL")

  var data
  var host
  var task
  while(true) {
    data = ns.readPort(PortSettings.WORK_LIST_PORT)
    if(data != "NULL PORT DATA") {
      host = data["host"]
      task = data["task"]

      if(task == "GROW") {
        ns.print(`Growing ${host}`)
        await ns.grow(host)
      } else if (task == "WEAKEN") {
        ns.print(`Weakening ${host}`)
        await ns.weaken(host)
      } else if (task == "HACK") {
        ns.print(`Hacking ${host}`)
        await ns.hack(host)
      }
    }
    else {
      ns.print("Waiting for work...")
      ns.writePort(PortSettings.WORK_REQUEST_PORT)
      await ns.nextPortWrite(PortSettings.WORK_LIST_PORT)
    }
  }
}
