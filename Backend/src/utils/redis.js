import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

export const client = createClient({
  name: process.env.REDIS_NAME,
  password: process.env.REDIS_PASS,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

client.on("error", (err) => console.log(`REDIS ERROR: ${err}`));

client.connect();
