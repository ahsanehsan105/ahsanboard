const Board = require("../models/Board");

exports.getBoards = async (req, res) => {
  try {
    const boards = await Board.find({ owner: req.user.userId });
    res.json(boards);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getBoard = async (req, res) => {
  try {
    const board = await Board.findOne({ _id: req.params.boardId, owner: req.user.userId });
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }
    res.json(board);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createBoard = async (req, res) => {
  try {
    const board = new Board({
      ...req.body,
      owner: req.user.userId,
    });
    await board.save();
    res.json(board);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};