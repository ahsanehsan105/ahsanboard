const mongoose = require("mongoose")

const boardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    backgroundColor: {
      type: String,
      default: "#1e40af",
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Board", boardSchema)
