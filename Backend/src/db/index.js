import mongoose from "mongoose";
import { dbName } from "../constants.js";

export async function connectDB() {
  try {
    await mongoose.connect(`${process.env.MONGOATLASURL}/${dbName}`);
    console.log("Connected to DB");
  } catch (error) {
    throw `Error in Connecting DB: ${error}`;
  }
}
