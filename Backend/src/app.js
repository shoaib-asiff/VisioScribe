import { ApiError } from "./utils/ApiError.js";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "16kb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

app.use(express.static("public"));

app.use(cookieParser());

// Routers
import userRouter from "./routes/user.route.js";
import chatRouter from "./routes/chat.route.js";
import healthRouter from "./routes/health.route.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/health", healthRouter);

app.use((err, req, res, next) => {
  res
    .status(err.statusCode || 500)
    .json(new ApiError(err.statusCode, err.message, err.errors, err.stack));
});

export default app;
