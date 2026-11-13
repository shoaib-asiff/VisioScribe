import { OpenRouter } from "@openrouter/sdk";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

const openRouter = new OpenRouter({
  apiKey: process?.env?.OPEN_ROUTER_API_KEY,
  defaultHeaders: {
    "X-Title": process?.env?.SITE_NAME,
  },
});

export const LLMModel = async (message) => {
  try {
    return await openRouter.chat.send({
      model: process.env.OPEN_ROUTER_MODEL,
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
      stream: false,
    });
  } catch (error) {
    console.log("Error in LLM Model:", error);
    return null;
  }
};
