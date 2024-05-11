/** @param {NS} ns */
export async function main(ns) {
  var file = ns.args[0]
  ns.print(ns.codingcontract.getContractTypes())
  //var test = ns.codingcontract.createDummyContract()
  //print(ns.codingcontract.getContractType(file))
}