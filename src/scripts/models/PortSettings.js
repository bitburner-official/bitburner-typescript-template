export class PortSettings {
  // ----------
  // Bootstrapping
  // ----------

  // The list of scripts to start up
  static BOOTSTRAP_PORT = 1

  // ----------
  // Server Lists and Info
  // ----------

  // A list of all known servers and some information about them
  static SERVER_FULL_PORT = 50
  // A list of actively hacked and usable servers
  static SERVER_ACTIVE_PORT = 51
  // Port to request the crawler update the server lists
  static SERVER_UPDATE_PORT = 99

  // ----------
  // Financial decisions and transactions
  // ----------

  // Port to request systems to submit financial proposals
  static FINANCE_REQUESTS_PORT = 100
  // Port to submit financial proposals
  static FINANCE_PROPOSAL_PORT = 101
  // Port to purchase servers
  static SERVER_BROKER_PORT = 110
  // Port to purchase Hacknet Nodes
  static HACKNET_BROKER_PORT = 120


  // ----------
  // Work Requests and Settings
  // ----------

  // Port containing existing work jobs
  static WORK_LIST_PORT = 400
  // Port to determine work job parameters
  static WORK_PARAMETERS_PORT = 420
  // Port to request new jobs when no jobs exist
  static WORK_REQUEST_PORT = 499

  // Reference Data
  static PORT_EMPTY = "NULL PORT DATA"
}
