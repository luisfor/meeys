const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./models/");

// Sync Database
db.conexion.sync().then(() => {
  console.log("Database synced");
}).catch((err) => {
  console.error("Failed to sync database: " + err.message);
});

// Simple Route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Meeys Apis" });
});

// Routes
require('./routes/user')(app);
require('./routes/state')(app);
require('./routes/colour')(app);
require('./routes/type_idcard')(app);
require('./routes/grade')(app);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Port configuration
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});