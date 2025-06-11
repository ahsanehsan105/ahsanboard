const List = require("../models/List");

exports.getLists = async (req, res) => {
  try {
    const lists = await List.find({ board: req.params.boardId }).sort({ position: 1 });
    res.json(lists);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createList = async (req, res) => {
  try {
    const list = new List({
      ...req.body,
      board: req.params.boardId,
    });
    await list.save();
    res.json(list);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};