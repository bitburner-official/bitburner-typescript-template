export class ServerHelper {
  static RESERVED_FILE = "_reserved_"

  /** @param {NS} ns */
  static getFreeRam(ns, host) {
    // This doesn't actually do what I want, the used ram and reserved ram are always added together,
    // Instead, it should set aside some ram for some subset of scripts, reserving *at most* the reserved amount
    return ns.getServerMaxRam(host) - (ns.getServerUsedRam(host) + this.getReservedRam(ns, host))
  }

  /** @param {NS} ns */
  static getReservedRam(ns, host) {
    var file = this.getReservedFileName(host)
    var result
    // If the host is the current server, just read the _reserved_ file
    if(ns.getHostname() == host) {
      result = ns.read(file)
    } else {
      // If the host is not the current server, pull over that server's _reserved_ file
      ns.scp(file, ns.getHostname(), host)
      result = ns.read(file)
      // Delete the file after reading
      ns.rm(file)
    }
    return result == "" ? 0 : parseInt(result)
  }

  /** @param {NS} ns */
  static configureReservedRam(ns, host, amount) {
    var file = this.getReservedFileName(host)
    ns.write(file, amount, "w")
    if(ns.getHostname() != host) {
      ns.scp(file, host, ns.getHostname())
      ns.rm(file)
    }
  }

  static getReservedFileName(host) {
    return this.RESERVED_FILE.concat(host, ".txt")
  }
}