import cors from "cors";
import express from "express";
import { loadConfig } from "./config.js";
import { errorHandler, notFound, requestId } from "./middleware.js";
import { createAiRouter } from "./routes/ai.js";
import { GroqService } from "./services/groqService.js";

export function createApp(options: { requireGroq?: boolean } = {}) {
  const config = loadConfig({ requireGroq: options.requireGroq ?? false });
  const app = express();

  app.disable("x-powered-by");
  app.use(cors({ origin: config.CORS_ORIGIN, credentials: true }));
  app.use(express.json({ limit: "8mb" }));
  app.use(requestId);

  app.get("/api/health", (_request, response) => {
    response.json({ data: { status: "ok" }, error: null, requestId: response.locals.requestId });
  });

  app.get("/api/ready", (_request, response) => {
    const ready = Boolean(config.GROQ_API_KEY);
    response.status(ready ? 200 : 503).json({
      data: { status: ready ? "ready" : "degraded", groqConfigured: ready },
      error: ready ? null : { code: "SERVICE_NOT_CONFIGURED", message: "AI service is not configured." },
      requestId: response.locals.requestId,
    });
  });

  if (config.GROQ_API_KEY) {
    app.use("/api/ai", createAiRouter(new GroqService(config)));
  }

  app.use(notFound);
  app.use(errorHandler);
  return app;
}