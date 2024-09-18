const http = require("http");
const socketIO = require("socket.io");

const server = http.createServer();
// Initializing socket.io with CORS settings allowing all origins
const io = socketIO(server, { cors: { origin: "*" } });

// Setting the port to either the environment variable PORT or 3000
const PORT = process.env.PORT || 3000;

// Arrays to manage waiting players and player room assignments
let waitingPlayers = [];
let playerRooms = {};

// Sets to keep track of unique usernames and IP addresses
let usernames = new Set();
let ips = new Set();

// Function to handle a user joining a room
function userJoinRoom(io, socket) {
  if (usernames.has(socket.username) || ips.has(socket.handshake.address)) {
    // If so, emit an error message to the client
    socket.emit("error", "Benutzername oder IP-Adresse bereits in Verwendung");
    return;
  }

  // Add the username and IP address to the respective sets
  usernames.add(socket.username);
  ips.add(socket.handshake.address);

  // Initialize the waitingPlayers array for the gamemode if it doesn't exist
  if (!waitingPlayers[socket.gamemode]) {
    waitingPlayers[socket.gamemode] = [];
  }

  // Add the socket to the waiting players for the specified gamemode
  waitingPlayers[socket.gamemode].push(socket);

  // If there are less than 2 players waiting, return and wait for more players
  if (waitingPlayers[socket.gamemode].length < 2) return;

  // Get the first two players from the waiting list
  const player1 = waitingPlayers[socket.gamemode].shift();
  const player2 = waitingPlayers[socket.gamemode].shift();

  // Generate a random room ID
  const randRoomId = Math.ceil(Math.random() * 10000);

  player1.join(randRoomId);
  player2.join(randRoomId);

  playerRooms[player1.id] = randRoomId;
  playerRooms[player2.id] = randRoomId;

  // Emit a startGame event to both players with room and player information
  io.to(randRoomId).emit("startGame", {
    room: randRoomId,
    player1: player1.id,
    player2: player2.id,
    player1Username: player1.username,
    player2Username: player2.username,
  });

  console.log(`Game started in room ${randRoomId}`);
}

// Function to cancel a player's search for a game
function cancelPlayerSearch(socket) {
  // Remove the player from the waiting list of the specified gamemode
  if (waitingPlayers[socket.gamemode]) {
    waitingPlayers[socket.gamemode] = waitingPlayers[socket.gamemode].filter((player) => player !== socket);
  }
}

// Event listener for a new socket connection
io.on("connection", async (socket) => {
  console.log("A user connected");

  // Event listener for user login
  socket.on("login", (username, gamemode) => {
    // Assign username and gamemode to the socket
    socket.username = username;
    socket.gamemode = gamemode;
    console.log(`User ${username} (${gamemode}) logged in`);
    // join a room
    userJoinRoom(io, socket);
  });

  // Event listener for chat messages
  socket.on("chatMessage", (message) => {
    // Get the room of the socket and emit the message to that room
    const room = playerRooms[socket.id];
    io.to(room).emit("chatMessage", { username: socket.username, message });
  });

  // Event listener for player moves
  socket.on("playerMove", ({ move, fen }) => {
    // Get the room of the socket and emit the move to the opponent
    const room = playerRooms[socket.id];
    socket.to(room).emit("opponentMove", { move, fen });
    console.log(move, fen, room);
  });

  // Event listener for player resignation
  socket.on("resign", () => {
    // Remove the username and IP address from the sets
    usernames.delete(socket.username);
    ips.delete(socket.handshake.address);
    console.log("A user disconnected");

    // Get the room of the socket
    const room = playerRooms[socket.id];
    if (room) {
      // Notify the opponent that the player has disconnected
      socket.to(room).emit("opponentDisconnected", "Your opponent has disconnected. You win!");
    }

    // Remove the player from the playerRooms and waitingPlayers
    delete playerRooms[socket.id];
    waitingPlayers = waitingPlayers.filter((player) => player !== socket);
  });
});

// Function to log a message periodically evade server spin down (on render.com)
function inactivityDings() {
  console.log("Ding!");
}

setInterval(inactivityDings, 1000 * 60);

//start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
