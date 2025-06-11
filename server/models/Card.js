const mongoose = require("mongoose")

const cardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    list: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "List",
      required: true,
    },
    position: {
      type: Number,
      default: 0,
    },
    dueDate: Date,
    labels: [String],
    completed: {
      type: Boolean,
      default: false,
    },
    comments: [
      {
        text: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Card", cardSchema)
