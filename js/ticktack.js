/* ======= M - O - D - E - L ======= ======= ======= ======= ======= ======= ======= ======= ======= ======= ======= */
var game = (function IFFE() {
  //************************************************************************************************************* */

  var Helpers = {
    getCurrPlayer: function(lastMove) {
      return lastMove === "o" ? "x" : "o";
    },

    isPlayerWin: function(board, player) {
      return true;
    },

    getGameStatus: function(b, p) {
      // check winnin combos

      for (let i = 0; i < 3; i++) {
        if (
          (b[0 + 3 * i] === p && b[1 + 3 * i] === p && b[2 + 3 * i] === p) ||
          (b[0 + i] === p && b[3 + i] === p && b[6 + i] === p) ||
          (b[0] === p && b[4] === p && b[8] === p) ||
          (b[2] === p && b[4] === p && b[6] === p)
        ) {
          return p;
        }

        if (b.indexOf(null) === -1) {
          return "draw";
        } else {
          return;
        }
      }
    }

    //
  };

  var model = {
    board: [null, null, null, null, null, null, null, null, null],
    lastMove: "o",
    score: {
      x: 0,
      o: 0
    },
    gameOver: false,
    win: null,
    message: null,
    player: {
      x: "x",
      o: "o"
    },

    makeMove: function(cell, i) {
      if (this.board[i] === null) {
        let currentPlayer = Helpers.getCurrPlayer(this.lastMove);
        this.board[i] = currentPlayer;

        let gameStatus = Helpers.getGameStatus(this.board, currentPlayer);

        switch (gameStatus) {
          case "x":
            model.score.x += 1;
            model.win = "x";
            model.gameOver = true;
            break;
          case "y":
            model.score.o += 1;
            model.win = "o";
            model.gameOver = true;
            break;
          case "draw":
            console.log(" DRAW ");
            model.gameOver = true;
            break;

          default:
            break;
        }

        Helpers.getGameStatus(this.board, currentPlayer);
        model.lastMove = currentPlayer;
        view.render();
      } else {
        console.log("square already taken!");
      }
    }
  };

  /* ======= C - O - N - T - R - O - L - L - E - R  ======= ======= ======= ======= ======= ======= ======= ======= */

  var controller = {
    init: function() {
      view.init();
    },

    makeMove: function makeMove(cell) {
      var cellIndex = cell.id.split("-")[1];
      model.makeMove(cell, cellIndex);
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
        cell.addEventListener("click", controller.makeMove.bind(this, cell));
      });

      this.render();
    },

    render: function() {
      if (model.win === "x") {
        let cells = [...document.getElementsByClassName("cell")];
        cells.forEach(function(cell) {
          console.log((cell.className = cell.className += " red"));
        });
      }
      if (model.win === "o") {
        let cells = [...document.getElementsByClassName("cell")];
        cells.forEach(function(cell) {
          console.log((cell.className = cell.className += " blue"));
        });
      }

      model.board.forEach((player, i) => {
        if (player !== null) {
          let cell = document.getElementById(`cell-${i}`);
          cell.innerHTML = this.playerSymbols[player];
        }
      });
    }
  };

  var publicAPI = {
    init: controller.init
  };

  return publicAPI;
})();

game.init();

// PURE FUNCTIONS

var PureFunctions = (function() {
  function isSquareAvailable(boardArr, playerMoveIndex) {
    return boardArr[playerMoveIndex] === null ? true : false;
  }

  return {
    isSquareAvailable
  };
})();
