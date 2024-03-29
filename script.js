var board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
let difficulties = [5, 3, 1];

var iter = 0;
var round = 0;
var difficulty;
var human;
var comp;
var isHumansTurn;
var winByHuman = localStorage.getItem("winByHuman");
var winByComp = localStorage.getItem("winByComp");

const whosTurn = document.getElementById("playerMark");

const cells = [...document.querySelectorAll("#grid .cell")]
const options = document.getElementById("options")
const optionsBackdrop = document.getElementById("options-backdrop")
const gameoverBackdrop = document.getElementById("game-over-backdrop")
const gameoverMsg = document.querySelector("#game-over #result")
const humanScore = document.querySelector(".scoreCard #human")
const compScore = document.querySelector(".scoreCard #comp")

options.addEventListener('submit', function (event) {
  event.preventDefault();
  var selectetValue = event.target["pieces"].value
  let difficultyLevel = difficulties[event.target["difficulty"].selectedIndex]
  if (selectetValue == "O") {
    loadGame("O", "X", difficultyLevel)
  }
  else {
    loadGame("X", "O", difficultyLevel)
  }
  optionsBackdrop.classList.add("hidden")
});

function updateScoreCard() {
  const { human_score, comp_score } = getScores()
  humanScore.innerHTML = "Player : " + human_score;
  compScore.innerHTML = "Computer : " + comp_score;
}

function getScores() {

  let human_score = localStorage.getItem("winByHuman");
  let comp_score = localStorage.getItem("winByComp");
  return { human_score, comp_score }
}
function loadGame(humanP, compP, diff) {
  human = humanP
  comp = compP
  difficulty = diff;
  isHumansTurn = true;

  if (!getScores().human_score) localStorage.setItem("winByHuman", 0);
  if (!getScores().comp_score) localStorage.setItem("winByComp", 0);
  updateScoreCard();

  whosTurn.innerHTML = human == "X" ? XMark : OMark;
  cells.forEach((cell, _i) => {
    cell.addEventListener("click", () => {
      if (isHumansTurn) {
        move(cell, human);
        isHumansTurn = false;
        whosTurn.innerHTML = human == "X" ? OMark : XMark;
      }

    })
  })
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function move(element, player) {
  if (board[element.id] != human && board[element.id] != comp) {
    round++;
    element.innerHTML = player == "X" ? XMark : OMark;
    board[element.id] = player;

    if (winning(board, player)) {
      localStorage.setItem("winByHuman", ++winByHuman);
      setTimeout(function () {
        updateScoreCard();
        showGameoverDialog("You win!!");
        reset();
      }, 500);
      return;
    } else if (round > 8) {
      setTimeout(function () {
        showGameoverDialog("Draw!!");
        reset();
      }, 500);
      return;
    } else {
      whosTurn.innerHTML = comp == "X" ? XMark : OMark;
      round++;
      var index = minimax(board, comp).index;
      setTimeout(() => {
        cells[index].innerHTML = player != "X" ? XMark : OMark;
        board[index] = comp;
        isHumansTurn = true;
        whosTurn.innerHTML = comp == "X" ? OMark : XMark;
        if (winning(board, comp)) {
          localStorage.setItem("winByComp", ++winByComp)
          setTimeout(function () {
            updateScoreCard();
            showGameoverDialog("Computer win's, Play again?");
          }, 500);
          return;
        } else if (round === 0) {
          setTimeout(function () {
            showGameoverDialog("Draw!!");
            reset();
          }, 500);
          return;
        }
      }, 750)
    }
  }
}

function reset() {
  round = 0;
  board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  cells.map((cell) => { cell.innerHTML = "" });
}
function openNewgameDialog() {
  optionsBackdrop.classList.remove("hidden");
  hideGameoverDialog();
}

function playAgain() {
  board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  loadGame(human, comp, difficulty);
  hideGameoverDialog();
}

function showGameoverDialog(msg) {
  gameoverMsg.innerHTML = msg;
  gameoverBackdrop.classList.remove("hidden");
  gameoverBackdrop.classList.add("flex");
  reset();
}

function hideGameoverDialog() {
  gameoverBackdrop.classList.remove("flex");
  gameoverBackdrop.classList.add("hidden");
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
