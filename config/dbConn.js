const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI);
  } catch (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1); // stop server if DB fails
  }
};

module.exports = connectDB;
