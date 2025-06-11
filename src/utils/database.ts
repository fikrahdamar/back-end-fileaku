import mongoose from "mongoose";
import { DATABASE_URL } from "./env";

export const db = async () => {
  try {
    await mongoose.connect(DATABASE_URL);
    console.log("✅ Database Connected!");
  } catch (error) {
    console.error("❌ Database error, not connected:", error);
    throw error;
  }
};
