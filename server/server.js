const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoute");
const boardRoutes = require("./routes/boardRoute");
const listRoutes = require("./routes/listRoute");
const cardRoutes = require("./routes/cardRoute");

const app = express();

app.use(cors(

));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://Ahsan:12345@cluster0.48pssop.mongodb.net/Trello")
  .then(() => console.log("MongoDB connected successfully!"))
  .catch(err => console.error(err))

// Routes
app.use("/api", authRoutes);
app.use("/api", boardRoutes);
app.use("/api", listRoutes);
app.use("/api", cardRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
