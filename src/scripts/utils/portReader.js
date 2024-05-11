/** @param {NS} ns */
export async function main(ns) {
  ns.tprint(ns.readPort(ns.args[0]))
}