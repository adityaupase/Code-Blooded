import { Router } from "express";
import { chatRequestSchema, diagnosisRequestSchema } from "../../shared/aiSchemas.js";
import type { GroqService } from "../services/groqService.js";

export function createAiRouter(groq: GroqService): Router {
  const router = Router();

  router.post("/chat", async (request, response, next) => {
    try {
      const input = chatRequestSchema.parse(request.body);
      const answer = await groq.chat(input);
      response.json({ data: { answer }, error: null, requestId: response.locals.requestId });
    } catch (error) {
      next(error);
    }
  });

  router.post("/diagnose", async (request, response, next) => {
    try {
      const input = diagnosisRequestSchema.parse(request.body);
      const diagnosis = await groq.diagnose(input);
      response.json({ data: diagnosis, error: null, requestId: response.locals.requestId });
    } catch (error) {
      next(error);
    }
  });

  return router;
}