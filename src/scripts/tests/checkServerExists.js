/** @param {NS} ns */
export async function main(ns) {
  ns.print(ns.getServer(ns.args[0]))
}