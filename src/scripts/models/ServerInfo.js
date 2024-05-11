export class ServerInfo {
  name;
  admin;
  maxRam;
  freeRam;
  cpus;
  maxMoney;
  depth;

  constructor(name, admin, maxRam, freeRam, cpus, maxMoney, depth) {
    this.name = name
    this.admin = admin
    this.maxRam = maxRam
    this.freeRam = freeRam
    this.cpus = cpus
    this.maxMoney = maxMoney
    this.depth = depth
  }
}