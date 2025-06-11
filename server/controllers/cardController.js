const Card = require("../models/Card");

exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({ list: req.params.listId }).sort({ position: 1 });
    res.json(cards);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createCard = async (req, res) => {
  try {
    const card = new Card({
      ...req.body,
      list: req.params.listId,
    });
    await card.save();
    res.json(card);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(req.params.cardId, req.body, { new: true });
    res.json(card);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};