/** @param {NS} ns */
export async function main(ns) {
  
  ns.go.resetBoardState("Slum Snakes", 5)
  var choice
  var result
  // Figure out how to do this manuallly
  do {
    choice = getMoves(ns)
    if(choice == null) {
      break
    }
    choice = JSON.parse(getMoves(ns))
    result = await ns.go.makeMove(choice.x, choice.y)
  } while(result != "gameOver") 
}

/** @param {NS} ns */
function getMoves(ns) {
  var moves = ns.go.analysis.getValidMoves()
  var validMoves = []
  for(let i = 0; i < moves.length; i++) {
    for(let j = 0; j < moves.length; j++) {
      if(moves[i][j]) {
        validMoves.push(`{"x":${i}, "y":${j}}`)
      }
    }
  }

  if(validMoves.length > 0) {
    var index = Math.floor(Math.random() * validMoves.length)
  return validMoves[index]
  } else {
    return null
  }  
}