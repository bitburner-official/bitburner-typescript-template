/** @param {NS} ns */
export async function main(ns) {
  var port = ns.args[0]
  var data = ns.args[1]

  ns.writePort(port, data)
}