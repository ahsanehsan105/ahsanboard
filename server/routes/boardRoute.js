const express = require("express");
const router = express.Router();
const boardController = require("../controllers/boardController");
const authenticateToken = require("../middlewares/authenticateToken");

router.get("/boards", authenticateToken, boardController.getBoards);
router.get("/boards/:boardId", authenticateToken, boardController.getBoard);
router.post("/boards", authenticateToken, boardController.createBoard);

module.exports = router;