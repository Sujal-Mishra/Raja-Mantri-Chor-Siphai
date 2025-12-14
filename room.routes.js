const express = require("express");
const router = express.Router();
const game = require("../services/game.service");

router.post("/create", (req, res) => {
  const { playerName } = req.body;
  res.json(game.createRoom(playerName));
});

router.post("/join", (req, res) => {
  const { roomId, playerName } = req.body;
  try {
    res.json(game.joinRoom(roomId, playerName));
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

router.get("/players/:roomId", (req, res) => {
  res.json(game.rooms[req.params.roomId].players.map(p => p.name));
});

router.post("/assign/:roomId", (req, res) => {
  try {
    game.assignRoles(req.params.roomId);
    res.json({ message: "Roles assigned" });
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

router.get("/role/me/:roomId/:playerId", (req, res) => {
  res.json({ role: game.getMyRole(req.params.roomId, req.params.playerId) });
});

router.post("/guess/:roomId", (req, res) => {
  game.submitGuess(req.params.roomId, req.body.guessedPlayerId);
  res.json({ message: "Guess submitted" });
});

router.get("/result/:roomId", (req, res) => {
  res.json(game.calculateResult(req.params.roomId));
});

module.exports = router;