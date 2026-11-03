import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");

    const conIns = await mongoose.connect(
      `${process.env.MANGOO_URI}/${DB_NAME}`
    );

    console.log("MongoDB connected successfully!");
    console.log("Host:", conIns.connection.host);
    console.log("Database:", conIns.connection.name);
  } catch (error) {
    console.log("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
