import {PortSettings} from "/scripts/models/PortSettings.js"
import {ServerHelper} from "/scripts/helpers/ServerHelper.js"

const WORKER_NODE_FILE = "scripts/nexus/nodes/workerNode.js"

const DEPENDENCIES = ["scripts/models/PortSettings.js"]

/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog("ALL")
  var servers
  var host
  var usableRam
  var numWorkers
  var threads
  while(true) {
    while(ns.peek(PortSettings.SERVER_ACTIVE_PORT) == PortSettings.PORT_EMPTY) {
      await ns.sleep(1000)
    }
    servers = ns.peek(PortSettings.SERVER_ACTIVE_PORT)
    
    for(var server of servers) {
      host = server["name"]
      usableRam = ServerHelper.getFreeRam(ns, host)
      if(usableRam > ns.getScriptRam(WORKER_NODE_FILE)) {
        threads = Math.trunc(Math.min(256, usableRam / ns.getScriptRam(WORKER_NODE_FILE)))
        numWorkers = Math.trunc(usableRam / (threads * ns.getScriptRam(WORKER_NODE_FILE)))

        // TODO: This always moves the files to the server, regardless of if they will be used, change?
        ns.scp(DEPENDENCIES.concat(WORKER_NODE_FILE), host)

        for(var i = 1; i <= numWorkers; i++) {
          ns.exec(WORKER_NODE_FILE, host, threads)
        }
        if(numWorkers > 0) {
          ns.print(`Started ${numWorkers} Workers on ${host}`)
        }
      }

    }

    // Request updated Server Info and wait for response
    ns.print("Awaiting Server Updates...")
    await ns.nextPortWrite(PortSettings.SERVER_ACTIVE_PORT)
  } 
}
