/** @param {NS} ns */
export async function main(ns) {
  // Get input params
  var host = ns.args[0]
  var file = ns.args[1]
  var threads = ns.args[2]

  // Get a server instance
  var server = ns.getServer(host)

  // Verify admin rights and valid file
  if(server.hasAdminRights && ns.fileExists(file)) {
    
    // Copy script from local directory to server
    ns.scp(file, host)

    // Execute the script
    var result = ns.exec(file, host, threads)

    if(result == 0) {
      ns.alert("Script Failed to Start. Verify file exists on server")
    } else {
      ns.alert("Script Started")
    }
  } else {
    ns.alert("Script Failed to Start. Invalid script or missing admin privileges on server")
  }
}