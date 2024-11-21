import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();


if (!process.env.MONGODB_URI) {
  throw new Error("Please enter MONGODB_URI in the .env");
}

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("DB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message || error);
    process.exit(1);
  }
};
