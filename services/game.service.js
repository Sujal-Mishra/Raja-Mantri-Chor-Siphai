const { v4: uuidv4 } = require("uuid");
const { ROLES, DEFAULT_POINTS } = require("../utils/constants");

const rooms = {};

function createRoom(playerName) {
  const roomId = uuidv4();
  const playerId = uuidv4();

  rooms[roomId] = {
    players: [{ id: playerId, name: playerName, role: null, points: 0 }],
    assigned: false,
    guess: null
  };

  return { roomId, playerId };
}

function joinRoom(roomId, playerName) {
  const room = rooms[roomId];
  if (!room) throw "Room not found";
  if (room.players.length >= 4) throw "Room full";

  const playerId = uuidv4();
  room.players.push({ id: playerId, name: playerName, role: null, points: 0 });
  return { playerId };
}

function assignRoles(roomId) {
  const room = rooms[roomId];
  if (room.players.length !== 4) throw "Need exactly 4 players";

  const shuffled = [...ROLES].sort(() => Math.random() - 0.5);
  room.players.forEach((p, i) => p.role = shuffled[i]);
  room.assigned = true;
}

function getMyRole(roomId, playerId) {
  return rooms[roomId].players.find(p => p.id === playerId).role;
}

function submitGuess(roomId, guessedId) {
  rooms[roomId].guess = guessedId;
}

function calculateResult(roomId) {
  const room = rooms[roomId];
  const mantri = room.players.find(p => p.role === "Mantri");
  const chor = room.players.find(p => p.role === "Chor");
  const sipahi = room.players.find(p => p.role === "Sipahi");

  if (room.guess === chor.id) {
    room.players.forEach(p => p.points = DEFAULT_POINTS[p.role]);
  } else {
    chor.points = DEFAULT_POINTS.Mantri + DEFAULT_POINTS.Sipahi;
  }

  return room.players.map(p => ({
    name: p.name,
    role: p.role,
    points: p.points
  }));
}

module.exports = {
  rooms,
  createRoom,
  joinRoom,
  assignRoles,
  getMyRole,
  submitGuess,
  calculateResult
};