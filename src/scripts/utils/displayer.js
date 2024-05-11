/** @param {NS} ns */
export async function main(ns) {
  ns.tprint(JSON.parse(ns.read("data/servers.txt")))
}