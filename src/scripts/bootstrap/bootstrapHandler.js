import { PortSettings } from "/scripts/models/PortSettings.js"

/** @param {import{"."}.NS} ns */
export async function main(ns) {
  // TODO: In the future, have the crawler populate a list of all owned server as use that to run scripts
  let host = ns.getHostname()
  let script = ""

  // While there is still data on the bootstrapping port continue to run
  while (ns.peek(PortSettings.BOOTSTRAP_PORT) != PortSettings.PORT_EMPTY) {
    
    // If the script at the top of the list is the same as the previous script, wait for ram to clear up or be added
    if (script == ns.peek(PortSettings.BOOTSTRAP_PORT)) {
      await ns.sleep(5000)
    }
    script = ns.peek(PortSettings.BOOTSTRAP_PORT)

    if (ns.run(script, 1) != 0 || ns.getRunningScript(script, host) != null) {
      ns.readPort(PortSettings.BOOTSTRAP_PORT)
    }
  }
  
}