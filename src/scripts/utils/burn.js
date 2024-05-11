import {PortSettings} from "/scripts/models/PortSettings.js"
import {WorkerSettings} from "/scripts/models/WorkerSettings.js"

/** @param {NS} ns */
export async function main(ns) {
  ns.clearPort(PortSettings.WORK_PARAMETERS_PORT)
  ns.writePort(PortSettings.WORK_PARAMETERS_PORT, new WorkerSettings(WorkerSettings.ALWAYS, WorkerSettings.NEVER, WorkerSettings.NEVER))
}