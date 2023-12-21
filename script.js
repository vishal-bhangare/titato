var board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
let difficulties = [5,3,1];

var iter = 0;
var round = 0;
var difficulty;
var human;
var comp;

const OMark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" aria-hidden="true"
style="fill: #55b4fa; width: 50px; height: 50px;">
<path
  d="M256 48C141.601 48 48 141.601 48 256s93.601 208 208 208 208-93.601 208-208S370.399 48 256 48zm0 374.399c-91.518 0-166.399-74.882-166.399-166.399S164.482 89.6 256 89.6 422.4 164.482 422.4 256 347.518 422.399 256 422.399z">
</path>
</svg>`
const XMark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" aria-hidden="true"
style="fill:#f81b81; width: 50px; height: 50px;">
<path
  d="M405 136.798L375.202 107 256 226.202 136.798 107 107 136.798 226.202 256 107 375.202 136.798 405 256 285.798 375.202 405 405 375.202 285.798 256z">
</path>
</svg>`

const cells = [...document.querySelectorAll("table .cell")]
const options = document.getElementById("options")
const optionsBackdrop = document.getElementById("options-backdrop")

options.addEventListener('submit', function (event) {
  event.preventDefault();
  var selectetValue = event.target["pieces"].value
  let difficultyLevel = difficulties[event.target["difficulty"].selectedIndex]
  if (selectetValue == "O") {
   loadGame("O","X",difficultyLevel)
  }
  else {
    loadGame("X","O",difficultyLevel)
  }
  optionsBackdrop.classList.add("hidden")
});

function loadGame(humanP,compP,diff){
  human = humanP
  comp = compP
  difficulty = diff
 }
cells.forEach((cell, i) => {
  cell.addEventListener("click", () => {
    move(cell, human);
  })
})

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function move(element, player) {
  if (board[element.id] != human && board[element.id] != comp) {
    round++;
    element.innerHTML = player == "X" ? XMark : OMark;
    board[element.id] = player;

    if (winning(board, player)) {
      setTimeout(function () {
        alert("YOU WIN");
        reset();
      }, 500);
      return;
    } else if (round > 8) {
      setTimeout(function () {
        alert("TIE");
        reset();
      }, 500);
      return;
    } else {
      round++;
      var index = minimax(board, comp).index;
      cells[index].innerHTML = player != "X"  ? XMark : OMark;
      board[index] = comp;
      if (winning(board, comp)) {
        setTimeout(function () {
          alert("YOU LOSE");
          reset();
        }, 500);
        return;
      } else if (round === 0) {
        setTimeout(function () {
          alert("tie");
          reset();
        }, 500);
        return;
      }
    }
  }
}

function reset() {
  round = 0;
  board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  cells.map((cell) => { cell.innerHTML = "" });
  optionsBackdrop.classList.remove("hidden")
}

function minimax(reboard, player) {
  iter++;
  let array = avail(reboard);
  if (winning(reboard, human)) {
    return {
      score: -10
    };
  } else if (winning(reboard, comp)) {
    return {
      score: 10
    };
  } else if (array.length === 0) {
    return {
      score: 0
    };
  }

  var moves = [];
  for (var i = 0; i < array.length; i++) {
    var move = {};
    move.index = reboard[array[i]];
    reboard[array[i]] = player;
    
    if (player == comp) {
      var g = minimax(reboard, human);
      move.score = g.score + getRandomInt(-difficulty, difficulty);
    } else {
      var g = minimax(reboard, comp)
      move.score = g.score + getRandomInt(-difficulty, difficulty);
    }
    reboard[array[i]] = move.index;
    moves.push(move);
  }

  var bestMove;
  if (player === comp) {
    var bestScore = -Infinity;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    var bestScore = Infinity;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  return moves[bestMove];
}

function avail(reboard) {
  return reboard.filter(s => s != human && s != comp);
}

function winning(board, player) {
  if (
    (board[0] == player && board[1] == player && board[2] == player) ||
    (board[3] == player && board[4] == player && board[5] == player) ||
    (board[6] == player && board[7] == player && board[8] == player) ||
    (board[0] == player && board[3] == player && board[6] == player) ||
    (board[1] == player && board[4] == player && board[7] == player) ||
    (board[2] == player && board[5] == player && board[8] == player) ||
    (board[0] == player && board[4] == player && board[8] == player) ||
    (board[2] == player && board[4] == player && board[6] == player)
  ) {
    return true;
  } else {
    return false;
  }
}
