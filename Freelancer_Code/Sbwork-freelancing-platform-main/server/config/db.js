const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongod = null;

const connectDB = async () => {
  try {
    const connStr = process.env.MONGO_URI;

    if (connStr && connStr !== "mongodb://localhost:27017/sbworks") {
      await mongoose.connect(connStr);
      console.log(`Connected to MongoDB: ${connStr}`);
      return;
    }

    // Try local mongo first, if it fails, fallback to memory server
    try {
      await mongoose.connect("mongodb://localhost:27017/sbworks", {
        serverSelectionTimeoutMS: 2000
      });
      console.log("Connected to local MongoDB");
    } catch (err) {
      console.log("Local MongoDB not found. Spinning up In-Memory Database...");
      mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log("--------------------------------------------------");
      console.log("🚀 IN-MEMORY DATABASE RUNNING");
      console.log("Note: Data will be lost when the server stops.");
      console.log("--------------------------------------------------");
    }

  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;



