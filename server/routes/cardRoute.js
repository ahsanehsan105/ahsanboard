const express = require("express");
const router = express.Router();
const cardController = require("../controllers/cardController");
const authenticateToken = require("../middlewares/authenticateToken");

router.get("/lists/:listId/cards", authenticateToken, cardController.getCards);
router.post("/lists/:listId/cards", authenticateToken, cardController.createCard);
router.put("/cards/:cardId", authenticateToken, cardController.updateCard);

module.exports = router;