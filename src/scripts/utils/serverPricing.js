/** @param {NS} ns */
export async function main(ns) {
  ns.tprint(ns.formatRam(2048))
  ns.tprint(ns.formatNumber(ns.getPurchasedServerCost(2048)))
}