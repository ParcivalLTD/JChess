const socket = io("https://jchess-socket.onrender.com");
var board = null;
var $board = $("#myBoard");
var game = new Chess();
var squareToHighlight = null;
var squareClass = "square-55d63";
var whiteSquareGrey = "";
var blackSquareGrey = "";
var movesContainer = document.getElementById("moves");
var resignButton = document.getElementById("resign-button");
var audio = new Audio("../img/move-self.mp3");
var audio2 = new Audio("../img/move-self2.mp3");
var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("btn-close")[0];
var moveNumber = 1;
let roomId = null;
let role = null;
let enemyPlayerUsername = null;
let playerUsername = null;
let trophies = 0;
let evaluation = 0;

let whiteTime = 900;
let blackTime = 900;
let intervalId = null;
let timeIncrement = 0;

let queryString = window.location.search.substring(1);
let data = queryString.split("=")[1];
let gameMode = data.split("&")[0];
let token = data.split("&")[1];

let hasRedirected = false;

socket.on("gamemode", function (gamemode) {
  if (!hasRedirected) {
    console.log("Redirecting to: " + "https://wavebeef.com/projects/jchess/online?=" + gamemode + "&" + token);
    window.location.assign("https://wavebeef.com/projects/jchess/online?=" + gamemode + "&" + token);
    hasRedirected = true;
  }
});

window.onload = function () {
  setGamemode(gameMode, data);

  document.getElementById("player-timer").textContent = formatTime(whiteTime);
  document.getElementById("enemy-timer").textContent = formatTime(blackTime);

  const username = localStorage.getItem("username") || sessionStorage.getItem("username");
  const password = localStorage.getItem("password") || sessionStorage.getItem("password");
  if (!username || !password) {
    window.location.href = "../";
  } else {
    board.resize();
    playerUsername = username;
    document.getElementById("playerUsername").textContent = playerUsername;
    socket.gameMode = gameMode;
    socket.emit("login", username, data, token);
  }
};

function setGamemode(gamemode, data) {
  console.log(data);

  switch (true) {
    case gamemode.includes("blz"):
      whiteTime = 180;
      blackTime = 180;
      timeIncrement = 2;
      break;
    case gamemode.includes("pwn"):
      game.load("4k3/pppppppp/8/8/8/8/PPPPPPPP/4K3 w - - 0 1");
      board.position("4k3/pppppppp/8/8/8/8/PPPPPPPP/4K3 w - - 0 1");
      break;
    case gamemode.includes("cl"):
      break;
    case gamemode.includes("qvk"):
      game.load("qqqqkq2/pppppppp/8/8/8/8/PPPPPNNN/NNNNKNNN w - - 0 1");
      board.position("qqqqkq2/pppppppp/8/8/8/8/PPPPPNNN/NNNNKNNN w - - 0 1");
      break;
    case gamemode.includes("blt"):
      whiteTime = 60;
      blackTime = 60;
      break;
  }

  if (data.includes("&")) {
    console.log("Invite link");
    document.querySelector("#loading").appendChild(document.createElement("p")).innerHTML = generateInvitePlayerP();
  }
}

function generateInvitePlayerP() {
  let parts = data.split("&");
  let beforeAnd = parts[0];
  let afterAnd = parts[1];
  let pInnerHTML = "Your friend can join by entering the code or clicking on the link below:<br><br>" + "<t style='font-weight: bold; font-size: 20px;'>" + afterAnd + "</t><br><br>" + "<a>" + window.location.href + "</a><br><br>";
  return pInnerHTML;
}

function updatePlayerInfoBackground() {
  if (isMyTurn) {
    document.getElementById("playerInfo").classList.add("activeTurn");
    document.getElementById("enemyInfo").classList.remove("activeTurn");
    document.getElementById("player-timer-icon").classList.add("animated-icon");
    document.getElementById("player-timer-icon").style.display = "inline-block";
    document.getElementById("enemy-timer-icon").classList.contains("animated-icon") && document.getElementById("enemy-timer-icon").classList.remove("animated-icon");
    document.getElementById("enemy-timer-icon").style.display = "none";
  } else {
    document.getElementById("playerInfo").classList.contains("activeTurn") && document.getElementById("playerInfo").classList.remove("activeTurn");
    document.getElementById("enemyInfo").classList.add("activeTurn");
    document.getElementById("player-timer-icon").classList.contains("animated-icon") && document.getElementById("player-timer-icon").classList.remove("animated-icon");
    document.getElementById("player-timer-icon").style.display = "none";
    document.getElementById("enemy-timer-icon").classList.add("animated-icon");
    document.getElementById("enemy-timer-icon").style.display = "inline-block";
  }
}

let gameEnded = false;

async function gameEnd(result) {
  if (gameEnded) return;

  gameEnded = true;

  clearInterval(intervalId);
  let message = "";
  let trophyChange = 0;
  switch (result) {
    case "blackWins":
      message = "Black won!";
      trophyChange = playerColor === "black" ? 30 : -10;
      changeTrophies(playerUsername, trophyChange);
      break;
    case "whiteWins":
      message = "White won!";
      trophyChange = playerColor === "white" ? 30 : -10;
      changeTrophies(playerUsername, trophyChange);
      break;
    case "blackWinsOnTime":
      message = "Black won on time!";
      trophyChange = playerColor === "black" ? 30 : -10;
      changeTrophies(playerUsername, trophyChange);
      break;
    case "whiteWinsOnTime":
      message = "White won on time!";
      trophyChange = playerColor === "white" ? 30 : -10;
      changeTrophies(playerUsername, trophyChange);
      break;
    case "draw":
      message = "It's a draw!";
      break;
    default:
      console.error("Invalid result: " + result);
  }

  let userTrophies = await getTrophies(playerUsername);

  var message2 = `${trophyChange > 0 ? "+ " : "- "} ${Math.abs(trophyChange)}`;

  document.getElementById("gameEndModalLabel").innerHTML = "<h1 style='margin-top: 20px; margin-bottom: 20px'>" + message + "</h1>";

  document.getElementById("trophyInfo").innerHTML = `
  <div style="text-align: center;">
    <h2>${playerUsername}</h2>
    <h3 style="margin-top: 20px; margin-bottom: 20px">
      <i style="color: #bba428" class="fa-solid fa-trophy"></i> 
      ${userTrophies} 
      <t style="color: grey; font-weight: bolder;">${message2}</t>
    </h3>
  </div>`;

  var gameEndModal = new bootstrap.Modal(document.getElementById("gameEndModal"));
  gameEndModal.show();
}

function startTimer() {
  intervalId = setInterval(function () {
    if (game.turn() === "w") {
      whiteTime--;
      if (whiteTime === 0) {
        clearInterval(intervalId);
        gameEnd("blackWinsOnTime");
      }
    } else {
      blackTime--;
      if (blackTime === 0) {
        clearInterval(intervalId);
        gameEnd("whiteWinsOnTime");
      }
    }
    if (playerColor === "white") {
      document.getElementById("player-timer").textContent = formatTime(whiteTime);
      document.getElementById("enemy-timer").textContent = formatTime(blackTime);
    } else {
      document.getElementById("player-timer").textContent = formatTime(blackTime);
      document.getElementById("enemy-timer").textContent = formatTime(whiteTime);
    }
  }, 1000);
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

socket.on("startGame", ({ room, player1, player2, player1Username, player2Username }) => {
  isMyTurn = player1 === socket.id;
  updatePlayerInfoBackground();

  document.getElementById("playersDivSpinner").style.display = "none";
  chatButton.disabled = false;
  roomId = room;
  document.querySelector("#myBoard").style.display = "block";
  document.querySelector("#playerInfo").style.display = "flex";
  document.querySelector("#enemyInfo").style.display = "flex";
  document.querySelector("#loading").style.display = "none";
  playerColor = socket.id === player1 ? "white" : "black";
  if (playerColor === "black") {
    board.orientation("black");
  }
  startTimer();
  enemyPlayerUsername = socket.id === player1 ? player2Username : player1Username;
  document.getElementById("enemyPlayerUsername").textContent = enemyPlayerUsername;

  playerColor = socket.id === player1 ? "white" : "black";

  let myBoardWidth = document.getElementById("myBoard").width;
  document.getElementById("enemyInfo").style.width = myBoardWidth + "px";
  document.getElementById("playerInfo").style.width = myBoardWidth + "px";

  if (playerColor === "white") {
    document.getElementById("player-timer").style.color = "black";
    document.getElementById("player-timer").style.backgroundColor = "#f5f5f5";
  } else {
    document.getElementById("enemy-timer").style.color = "black";
    document.getElementById("enemy-timer").style.backgroundColor = "#f5f5f5";
  }

  updateEvaluationBar();
  updateTakenPieces();
});

socket.on("opponentDisconnected", (message) => {
  gameEnd(playerColor + "Wins");
});

socket.on("opponentMove", (data) => {
  game.load(data.fen);
  board.position(game.fen());

  removeHighlights("black");
  $board.find(".square-" + data.move.from).addClass("highlight-black");
  squareToHighlight = data.move.to;

  if (playerColor === "white") {
    blackTime += timeIncrement;
  } else {
    whiteTime += timeIncrement;
  }

  updateMoves(data.move.to, "#dfdddd");
  audio2.play();

  getEvaluation(game.fen()).then(() => {
    updateEvaluationBar();
  });

  updateTakenPieces();

  isMyTurn = true;
  updatePlayerInfoBackground();

  if (game.in_checkmate()) {
    if (game.turn() === "w") {
      gameEnd("blackWins");
    } else {
      gameEnd("whiteWins");
    }
  } else if (game.in_draw()) {
    gameEnd("draw");
  }
  return;
});

socket.on("error", (message) => {
  //document.querySelector(".main-container").innerHTML = message;
});

function calculatePieceValue(fen, color) {
  const board = fen.split(" ")[0];
  let pieceValue = 0;

  for (let row of board.split("/")) {
    for (let char of row) {
      if (color === "white" && "PNBRQK".includes(char.toUpperCase())) {
        switch (char.toUpperCase()) {
          case "P":
            pieceValue += 1;
            break;
          case "N":
            pieceValue += 3;
            break;
          case "B":
            pieceValue += 3;
            break;
          case "R":
            pieceValue += 5;
            break;
          case "Q":
            pieceValue += 9;
            break;
          case "K":
            break;
        }
      } else if (color === "black" && "pnbrqk".includes(char)) {
        switch (char) {
          case "p":
            pieceValue += 1;
            break;
          case "n":
            pieceValue += 3;
            break;
          case "b":
            pieceValue += 3;
            break;
          case "r":
            pieceValue += 5;
            break;
          case "q":
            pieceValue += 9;
            break;
          case "k":
            break;
        }
      }
    }
  }
  return pieceValue;
}

function updateTakenPieces() {
  let whiteValue = calculatePieceValue(game.fen(), "white");
  let blackValue = calculatePieceValue(game.fen(), "black");
  whiteValue -= blackValue;
  let whiteDiff = "";
  let blackDiff = "";

  if (whiteValue - blackValue > 0) {
    whiteDiff = "(+" + (whiteValue - blackValue) + ") ";
    blackDiff = "";
  } else if (whiteValue - blackValue < 0) {
    blackDiff = "(+" + (blackValue - whiteValue) + ") ";
    whiteDiff = "";
  }

  if (playerColor === "white") {
    document.getElementById("playerUsername").innerHTML = "<img src='https://robohash.org/" + playerUsername + "' id='pfpImg'>" + whiteDiff + playerUsername;
    document.getElementById("enemyPlayerUsername").innerHTML = "<img src='https://robohash.org/" + enemyPlayerUsername + "' id='pfpImg'>" + blackDiff + enemyPlayerUsername;
  } else {
    document.getElementById("playerUsername").innerHTML = "<img src='https://robohash.org/" + playerUsername + "' id='pfpImg'>" + blackDiff + playerUsername;
    document.getElementById("enemyPlayerUsername").innerHTML = "<img src='https://robohash.org/" + enemyPlayerUsername + "' id='pfpImg'>" + whiteDiff + enemyPlayerUsername;
  }
}

document.querySelector("#myBoard").style.display = "none";
document.querySelector("#playerInfo").style.display = "none";
document.querySelector("#enemyInfo").style.display = "none";

function scrollToBottom() {
  var movesContainer = document.getElementById("moves-container");
  movesContainer.scrollTop = movesContainer.scrollHeight;
}

function updateMoves(move) {
  document.getElementById("info").innerHTML = "";
  var moveColor = game.turn() === "w" ? "white-moves" : "black-moves";
  var movesList = document.getElementById(moveColor);
  var moveText = "<t id='move'>" + move + "</t><br><br>";
  if (moveColor === "black-moves") {
    moveText = "<t id='number'>" + moveNumber + ". </t>" + moveText;
    moveNumber++;
  }
  movesList.innerHTML += moveText;
  scrollToBottom();
}

function getEvaluation(fen) {
  return fetch(`https://stockfish.online/api/stockfish.php?fen=${fen}&depth=13&mode=eval`)
    .then((response) => response.json())
    .then((data) => {
      evaluationData = data.data.split(" ");
      evaluation = parseFloat(evaluationData[2]);
    })
    .catch((error) => console.error("Error:", error));
}

function updateEvaluationBar() {
  const evaluationBar = document.getElementById("evaluation-value");
  evaluationBar.style.transition = "height 0.5s ease";
  const maxEvaluation = 10;
  const evaluationShifted = evaluation + maxEvaluation;
  const heightPercentage = Math.min(evaluationShifted / (2 * maxEvaluation), 1) * 100;
  evaluationBar.style.height = `${heightPercentage}%`;
  evaluationBar.style.backgroundColor = "#f1eded";
  let evBarDiv = document.getElementById("evaluation-bar");
  evBarDiv.style.backgroundColor = "rgb(70, 70, 70)";

  if (playerColor === "black") {
    evBarDiv.style.transform = "rotate(180deg)";
  } else {
    evBarDiv.style.transform = "rotate(0deg)";
  }
}

function greySquare(square) {
  var $square = $("#myBoard .square-" + square);

  if (game.get(square)) {
    $square.addClass("enemy-square");
  } else {
    $square.addClass("grey-square");
  }
}

function removeGreySquares() {
  $("#myBoard .square-55d63").removeClass("grey-square");
  $("#myBoard .black-3c85d").removeClass("grey-square");
  $("#myBoard .square-55d63").removeClass("enemy-square");
  $("#myBoard .square-55d63").removeClass("enemy-square");
}

function updateSquareClass(square) {
  var $square = $("#myBoard .square-" + square);
  if (game.get(square) && game.get(square).color === "b") {
    $square.removeClass("enemy-square");
  } else {
    $square.addClass("grey-square");
  }
}

function removeHighlights(color) {
  $board.find("." + squareClass).removeClass("highlight-" + color);
}

function onDragStart(source, piece, position, orientation) {
  if (game.game_over()) return false;

  if ((game.turn() === "w" && piece.search(/^b/) !== -1) || (game.turn() === "b" && piece.search(/^w/) !== -1)) {
    return false;
  }

  if ((playerColor === "white" && piece.search(/^b/) !== -1) || (playerColor === "black" && piece.search(/^w/) !== -1)) {
    return false;
  }
}

function onDrop(source, target) {
  removeGreySquares();
  var move = game.move({
    from: source,
    to: target,
    promotion: "q",
  });

  if (move === null) return "snapback";

  if (playerColor === "white") {
    whiteTime += timeIncrement;
  } else {
    blackTime += timeIncrement;
  }

  audio.play();

  getEvaluation(game.fen()).then(() => {
    updateEvaluationBar();
  });

  updateTakenPieces();

  removeHighlights(playerColor);
  $board.find(".square-" + source).addClass("highlight-" + playerColor);
  $board.find(".square-" + target).addClass("highlight-" + playerColor);

  socket.emit("playerMove", { move: move, fen: game.fen() });

  updateMoves(move.to);

  isMyTurn = false;
  updatePlayerInfoBackground();
}

resignButton.addEventListener("click", function () {
  socket.emit("disconnect");

  if (playerColor === "white") {
    gameEnd("blackWins");
  } else {
    gameEnd("whiteWins");
  }
});

window.onbeforeunload = function () {
  if (playerColor === "white") {
    gameEnd("blackWins");
  } else {
    gameEnd("whiteWins");
  }
};

function onMoveEnd() {
  $board.find(".square-" + squareToHighlight).addClass("highlight-black");
}

function onSnapEnd() {
  board.position(game.fen());

  if (game.game_over()) {
    if (game.in_checkmate()) {
      if (game.turn() === "w") {
        gameEnd("blackWins");
      } else {
        gameEnd("whiteWins");
      }
    } else if (game.in_draw()) {
      gameEnd("draw");
    }
    return;
  }
}

function changeTrophies(username, trophies) {
  fetch("../php/updateTrophies.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      trophies: trophies,
    }),
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error:", error);
    });
}

async function getTrophies(username) {
  try {
    const response = await fetch(`../php/updateTrophies.php?username=${username}`);
    const data = await response.json();

    if (data.status === "success") {
      return data.trophies;
    } else {
      console.error("Fehler beim Abrufen der Trophäen:", data.message);
      return null;
    }
  } catch (error) {
    console.error("Fehler:", error);
    return null;
  }
}

function onMouseoverSquare(square, piece) {
  var moves = game.moves({
    square: square,
    verbose: true,
  });

  if (moves.length === 0) return;

  for (var i = 0; i < moves.length; i++) {
    if (moves[i].to !== square) {
      greySquare(moves[i].to);
    }
  }
}

function onMouseoutSquare(square, piece) {
  removeGreySquares();
}

function pieceTheme(piece) {
  let pieceTheme = localStorage.getItem("pieceTheme") || "../img/chesspieces/tatiana/";
  if (piece.search(/w/) !== -1) {
    return pieceTheme + piece + ".svg";
  }

  return pieceTheme + piece + ".svg";
}

document.addEventListener("DOMContentLoaded", function () {
  var lightSquareColor = localStorage.getItem("lightSquareColor");
  var darkSquareColor = localStorage.getItem("darkSquareColor");
  if (lightSquareColor && darkSquareColor) {
    var style = document.createElement("style");
    style.innerHTML = `
      .white-1e1d7 { background-color: ${lightSquareColor} !important; }
      .black-3c85d { background-color: ${darkSquareColor} !important; }
      .board-b72b1 { border: solid 5px ${darkSquareColor} !important; }
    `;
    document.head.appendChild(style);
  }
});

var config = {
  draggable: true,
  position: "start",
  pieceTheme: pieceTheme,
  onDragStart: onDragStart,
  onDrop: onDrop,
  onMoveEnd: onMoveEnd,
  onSnapEnd: onSnapEnd,
  onMouseoutSquare: onMouseoutSquare,
  onMouseoverSquare: onMouseoverSquare,
  onSnapEnd: onSnapEnd,
};
board = Chessboard("myBoard", config);

$(window).resize(board.resize);

document.querySelector("#home-button").addEventListener("click", function () {
  location.href = "../";
});

document.getElementById("enemyPlayerUsername").textContent = enemyPlayerUsername;
document.getElementById("playerUsername").textContent = playerUsername;

let chatInput = document.getElementById("chat-input");
let chatButton = document.getElementById("chat-button");
let chatBox = document.getElementById("chat-box");
chatButton.disabled = true;
let chatSound = new Audio("../img/chat.mp3");
chatSound.volume = 0.5;

chatButton.addEventListener("click", function () {
  let message = chatInput.value;
  chatInput.value = "";
  sendMessage(message);
  chatSound.play();
});

socket.on("chatMessage", ({ username, message }) => {
  let messageElement = document.createElement("div");
  if (playerColor === "white") {
    messageElement.className = `message ${username === playerUsername ? "whiteMsg" : "blackMsg"}`;
  } else {
    messageElement.className = `message ${username === playerUsername ? "blackMsg" : "whiteMsg"}`;
  }
  messageElement.innerHTML = `
    <strong>${username}</strong><br>
    <t id="msgI" class="mb-0">${message}</t>
  `;
  chatBox.appendChild(messageElement);
  chatSound.play();
  chatBox.scrollTop = chatBox.scrollHeight;
});

async function censorMessage(message) {
  const url = "https://corsproxy.io/?https://neutrinoapi.net/bad-word-filter";
  const options = {
    method: "POST",
    headers: {
      "User-ID": "parcivalltd",
      "API-Key": "P8Zq9n2ePQxftphrbCKiyUAEH5WfvsBiRQidluQwtswGmDrY",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      "censor-character": "*",
      catalog: "strict",
      content: message,
    }),
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return result["censored-content"];
  } catch (error) {
    console.error(error);
  }
}

function sendMessage(message) {
  censorMessage(message).then((censoredMessage) => {
    socket.emit("chatMessage", censoredMessage);
  });
}

chatButton.addEventListener("click", function () {
  let message = chatInput.value;
  chatInput.value = "";
  if (message.trim() !== "") {
    sendMessage(message);
    chatSound.play();
  }
});

chatInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    let message = chatInput.value;
    chatInput.value = "";
    if (message.trim() !== "") {
      sendMessage(message);
    }
  }
});

function updateTheme() {
  const theme = getCookie("theme") || (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

  document.documentElement.setAttribute("data-theme", theme);
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) return parts.pop().split(";").shift();
}

updateTheme();
