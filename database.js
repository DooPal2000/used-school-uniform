const mongoose = require('mongoose');
const config = require('./config');

async function connectToDatabase() {
  try {
    await mongoose.connect(config.mongodb.uri);
    console.log("Connected to database!");
  } catch (error) {
    console.error("Connection failed:", error);
    process.exit(1);
  }
}

module.exports = { connectToDatabase };
