import {PortSettings} from "/scripts/models/PortSettings.js"
import {WorkerSettings} from "/scripts/models/WorkerSettings.js"

class Job {
  host
  task

  constructor(host, task) {
    this.host = host
    this.task = task
  }
}

/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog("ALL")
  var servers
  var records
  var settings

  let windowSize = ns.ui.windowSize()
  let width = 500
  let height = 200
  let fudge = 5
  ns.tail()
  ns.resizeTail(width, height)
  ns.moveTail(windowSize[0] - (width + fudge), 0)

  while(true) {
    // Wait for server data to be populated
    while(ns.peek(PortSettings.SERVER_ACTIVE_PORT) == PortSettings.PORT_EMPTY) {
      await ns.sleep(1000)
    }

    // Get the list of hacked servers
    servers = ns.peek(PortSettings.SERVER_ACTIVE_PORT)
    // Get any special settings (e.g. allow/disallow/force specific tasks)
    settings = ns.peek(PortSettings.WORK_PARAMETERS_PORT) == PortSettings.PORT_EMPTY ? new WorkerSettings() : Object.assign(new WorkerSettings, ns.peek(PortSettings.WORK_PARAMETERS_PORT))

    // Generate what jobs to run
    records = generateJobs(ns, servers, settings)

    if(records == 0) {
      // If no jobs were generated, sleep for some time
      ns.print("No valid Work. Sleeping...")
      await ns.sleep(10000)
    } else {
      // Await a request for more jobs
      await ns.nextPortWrite(PortSettings.WORK_REQUEST_PORT)
      ns.print("Awaiting work requests...")
    }
    
  }
}

/** @param {NS} ns 
 * @param {Array<ServerInfo>} servers The list of currently active servers
 * @param {WorkerSettings} settings The job creation settings
 * @returns {number} The number of jobs created
*/
function generateJobs(ns, servers, settings) {
  var jobs = []

  if(settings.canWeaken()) {
    jobs = jobs.concat(generateWeakenJobs(ns, servers, settings.alwaysWeaken()))
  }
  if(settings.canGrow()) {
    jobs = jobs.concat(generateGrowJobs(ns, servers, settings.alwaysGrow()))
  }
  if(settings.canHack()) {
    jobs = jobs.concat(generateHackJobs(ns, servers, settings.alwaysHack()))
  }

  pushPortData(ns, jobs, PortSettings.WORK_LIST_PORT)

  return jobs.size
}

/** @param {NS} ns 
 * @param {Array<ServerInfo>} servers The list of currently active servers
 * @param {boolean} forced Whether this type of job is currently being forced to run
 * @returns {Array<Job>} The jobs that should be created
*/
function generateWeakenJobs(ns, servers, forced) {
  var jobs = []
  var securityRatio
  var host
  for(var server of servers) {
    host = server["name"]
    if(ns.getServerMaxMoney(host) != 0 && ns.getPlayer().skills.hacking >= ns.getServer(server["name"]).requiredHackingSkill) {
      securityRatio = ns.getServerSecurityLevel(host) / ns.getServerMinSecurityLevel(host)

      // The server's security rating is higher 10% higher than the minimum possible
      if(securityRatio > 1.1 || forced) {
        jobs.push(new Job(host, "WEAKEN"))
      }
    }
  }
  ns.print(`Generated ${jobs.length} Weaken Jobs`)
  return jobs
}

/** @param {NS} ns 
 * @param {Array<ServerInfo>} servers The list of currently active servers
 * @param {boolean} forced Whether this type of job is currently being forced to run
 * @returns {Array<Job>} The jobs that should be created
*/
function generateGrowJobs(ns, servers, forced) {
  var jobs = []
  var moneyRatio
  var host
  for(var server of servers) {
    host = server["name"]
    if(ns.getServerMaxMoney(host) != 0 && ns.getPlayer().skills.hacking >= ns.getServer(server["name"]).requiredHackingSkill) {
      moneyRatio = ns.getServerMoneyAvailable(host)/ns.getServerMaxMoney(host)

      // The server has less than 95% of its max money
      if(moneyRatio < 0.95  || forced) {
        jobs.push(new Job(host, "GROW"))
      }
    }
  }

  ns.print(`Generated ${jobs.length} Grow Jobs`)

  return jobs
}

/** @param {NS} ns 
 * @param {Array<ServerInfo>} servers The list of currently active servers
 * @param {boolean} forced Whether this type of job is currently being forced to run
 * @returns {Array<Job>} The jobs that should be created
*/
function generateHackJobs(ns, servers, forced) {
  var jobs = []
  var moneyRatio
  var host
  for(var server of servers) {
    host = server["name"]
    if(ns.getServerMaxMoney(host) != 0 && ns.getPlayer().skills.hacking >= ns.getServer(server["name"]).requiredHackingSkill) {
      moneyRatio = ns.getServerMoneyAvailable(host)/ns.getServerMaxMoney(host)

      // The server has more than 70% of is max money
      if((moneyRatio > 0.70 && (ns.getServerSecurityLevel(host) / ns.getServerMinSecurityLevel(host)) < 1.2) || forced) {
        jobs.push(new Job(host, "HACK"))
      }
    }
  }

  ns.print(`Generated ${jobs.length} Hack Jobs`)

  return jobs
}


/** @param {NS} ns 
 * @param {string} data The data to be written to port
 * @param {number} port The port to be written to
*/
function pushPortData(ns, data, port) {
  ns.clearPort(port)
  for(const dat of data) {
    //ns.print(dat)
    ns.writePort(port, dat)
  }
  ns.print(`Added ${data.length} Tasks`)
}
