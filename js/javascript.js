"use strict";
const helpers = helpersFactory();
const viewHelpers = viewHelpersFactory();

var game = (function IFFE() {
  /* ======= M - O - D - E - L   ======= ======= ======= ======= ======= ======= ======= ======= */
  var model = {
    state: {
      board: [null, null, null, null, null, null, null, null, null],
      score: {
        x: 0,
        o: 0
      },
      currentPlayer: "x",
      winner: null,
      message: null,
      player: {
        x: "x",
        o: "o"
      }
    },

    setState: function(object) {
      model.state = Object.assign(model.state, object);
    },

    makeMove: function(index) {
      let updatedBoard = model.state.board;
      updatedBoard[index] = model.state.currentPlayer;
      this.setState({ board: updatedBoard });
    }
  };

  /* ======= C - O - N - T - R - O - L - L - E - R  ======= ======= ======= ======= ======= ======= ======= ======= */

  var controller = {
    init: function() {
      view.init();
    },

    makeMove: function makeMove(index) {
      let board = model.state.board;
      let state = model.state;

      // if game is over, reset game
      if (helpers.isGameOver(state)) {
        console.log("game OVER");
        model.setState({
          board: [null, null, null, null, null, null, null, null, null]
        });
        view.render();
        return;
      }

      // make move if available
      if (helpers.isMoveAvailable(board, index)) {
        model.makeMove(index);

        // if game is NOT over change player
        if (!helpers.isGameOver(state)) {
          // change player after move
          model.setState({
            currentPlayer: helpers.changePlayer(state.currentPlayer)
          });
        }
      }

      // check player wins
      if (helpers.isPlayerWin(state.board, state.currentPlayer)) {
        model.setState({ winner: state.currentPlayer });
        console.log(state.currentPlayer + "   player won!");
      }

      view.render();
    }
  };

  /* ======= V - I - E - W  ======= =======  =======  ======= ======= ======= ======= ======= ======= ======= ======= */

  var view = {
    init: function() {
      // player symbol for render
      this.playerSymbols = {
        o: `<span class="player-o player">O</span>`,
        x: `<span class="player-x player">X</span>`
      };
      // cache the DOM
      this.cells = document.querySelectorAll(".cell");

      //bind events
      this.cells.forEach(function(cell) {
        cell.addEventListener(
          "click",
          controller.makeMove.bind(this, viewHelpers.getCellIndex(cell))
        );
      });

      this.render();
    },

    render: function() {
      let board = model.state.board;

      viewHelpers.renderBoard(board, this.playerSymbols);
    }
  };

  var publicAPI = {
    init: controller.init
  };

  return publicAPI;
})();

game.init();

// ************************************************************************************************************
function viewHelpersFactory() {
  function drawBoard(board) {
    return;
  }

  return {
    renderBoard,
    getCellIndex,
    drawBoard
  };

  // ************************************************************************************************************
  function renderBoard(board, playerSymbols) {
    board.forEach(function(val, i) {
      let cell = document.getElementById(`cell-${i}`);
      if (val === null) {
        cell.innerHTML = "";
      }
      if (val === "x") {
        console.dir(this);
        cell.innerHTML = playerSymbols.x;
      }
      if (val === "o") {
        cell.innerHTML = playerSymbols.o;
      }
    });
  }

  function getCellIndex(cell) {
    var cellIndex = cell.id.split("-")[1];
    if (cellIndex.length !== 1) {
      throw "the cell index or id is longer than 1, check View logic for retrieving their id";
    }
    return cellIndex;
  }
}

// ************************************************************************************************************
function helpersFactory() {
  return {
    resetState,
    changePlayer,
    isMoveAvailable,
    isGameOver,
    isPlayerWin,
    isDraw,
    isAllMovesDone
  };

  function resetState() {
    return {
      board: [null, null, null, null, null, null, null, null, null],
      score: {
        x: 0,
        o: 0
      },
      currentPlayer: "x",
      winner: null,
      message: null,
      player: {
        x: "x",
        o: "o"
      }
    };
  }
  function changePlayer(player) {
    return player === "x" ? "o" : "x";
  }

  function isMoveAvailable(board, moveIndex) {
    return board[moveIndex] === null ? true : false;
  }

  function isGameOver(state) {
    let board, player1, player2;
    board = state.board;
    player1 = state.player.x;
    player2 = state.player.o;
    return (
      isPlayerWin(board, player1) ||
      isPlayerWin(board, player2) ||
      isDraw(board, player1, player2)
    );
  }

  function getWinIndex(board, player) {}

  function isPlayerWin(board, player) {
    let b, p;
    b = board;
    p = player;
    // check if there is a winning combo of moves in the board array
    for (let i = 0; i < 3; i++) {
      if (
        (b[0 + 3 * i] === p && b[1 + 3 * i] === p && b[2 + 3 * i] === p) ||
        (b[0 + i] === p && b[3 + i] === p && b[6 + i] === p) ||
        (b[0] === p && b[4] === p && b[8] === p) ||
        (b[2] === p && b[4] === p && b[6] === p)
      ) {
        return true;
      }
    }
    return false;
  }

  function isDraw(board, player1, player2) {
    let allMovesDone = isAllMovesDone(board);
    return (
      allMovesDone &&
      !isPlayerWin(board, player1) &&
      !isPlayerWin(board, player2)
    );
  }

  function isAllMovesDone(board) {
    return board.indexOf(null) === -1;
  }

  function whoWin(board, player1, player2) {
    let winner = isPlayerWin(board, player1)
      ? player1
      : isPlayerWin(board, player2) ? player2 : false;
    if (winner === false) {
      throw "there is no winner";
    }
  }
}
