import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import middleware from "./utils/middleware.js";
import blogsRouter from "./controllers/blogs.js";
import config from "./utils/config.js";

mongoose.set("strictQuery", false);
logger.info("Connecting to MongoDB...");
mongoose
  .connect(config.MONGODB_URI)
  .then(() => logger.info("Connected to MongoDB"))
  .catch((err) => logger.error("Error connecting to MongoDB: ", err.message));

const app = express();
app.use(cors);
app.use(express.json());
app.use(middleware.requestLogger);
app.use("/api/blogs", blogsRouter);
app.use(middleware.notFound);
app.use(middleware.errorHandler);

export default app;
