import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env.js";
import { challengeRouter } from "./routes/challenge.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { notFoundHandler } from "./middleware/notFound.middleware.js";
import { healthRouter } from "./routes/health.routes.js";

export const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(
  cors({
    origin: env.frontendOrigins,
  }),
);
app.use(express.json({ limit: "32kb" }));

app.use("/api", challengeRouter);
app.use("/api", healthRouter);
app.use(notFoundHandler);
app.use(errorHandler);