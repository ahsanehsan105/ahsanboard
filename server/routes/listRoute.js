const express = require("express");
const router = express.Router();
const listController = require("../controllers/listController");
const authenticateToken = require("../middlewares/authenticateToken");

router.get("/boards/:boardId/lists", authenticateToken, listController.getLists);
router.post("/boards/:boardId/lists", authenticateToken, listController.createList);

module.exports = router;