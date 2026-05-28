var board = null
var game = new Chess()
var $status = $('#status')
var $pgn = $('#pgn')

function onDragStart (source, piece, position, orientation) {
  // do not pick up pieces if the game is over
  if (game.game_over()) return false

  // only pick up pieces for the side to move
  if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false
  }
}

function onDrop (source, target) {
  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  })

  // illegal move
  if (move === null) return 'snapback'

  updateStatus()
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd () {
  board.position(game.fen())
}

function updateStatus () {
  var status = ''

  var moveColor = 'Brancas'
  if (game.turn() === 'b') {
    moveColor = 'Pretas'
  }

  // checkmate?
  if (game.in_checkmate()) {
    status = 'Fim de jogo, ' + moveColor + ' estão em xeque-mate.'
  }

  // draw?
  else if (game.in_draw()) {
    status = 'Fim de jogo, empate.'
  }

  // game still on
  else {
    status = moveColor + ' jogam'

    // check?
    if (game.in_check()) {
      status += ', ' + moveColor + ' estão em xeque'
    }
  }

  $status.html(status)
  $pgn.html(game.pgn())
}

var config = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd,
  pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png'
}
board = Chessboard('myBoard', config)

updateStatus()

$('#resetBtn').on('click', function() {
    game.reset()
    board.start()
    updateStatus()
})
