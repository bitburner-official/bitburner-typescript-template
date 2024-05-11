/** @param {NS} ns */
export class WorkerSettings{
  static NEVER = 0
  static ALLOWED = 1
  static ALWAYS = 2

  #hackVal;
  #weakenVal;
  #growVal;

  constructor(hackVal=WorkerSettings.ALLOWED, weakenVal=WorkerSettings.ALLOWED, growVal=WorkerSettings.ALLOWED) {
    this.hackVal = hackVal
    this.weakenVal = weakenVal
    this.growVal = growVal
  }

  canHack() {
    return this.hackVal != WorkerSettings.NEVER
  }

  alwaysHack() {
    return this.hackVal == WorkerSettings.ALWAYS
  }
  
  canWeaken() {
    return this.weakenVal != WorkerSettings.NEVER
  }

  alwaysWeaken() {
    return this.weakenVal == WorkerSettings.ALWAYS
  }

  canGrow() {
    return this.growVal != WorkerSettings.NEVER
  }

  alwaysGrow() {
    return this.growVal == WorkerSettings.ALWAYS
  }

}