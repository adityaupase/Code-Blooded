import "dotenv/config";
import { z } from "zod";

const environmentSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65_535).default(3000),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  GROQ_API_KEY: z.string().min(1).optional(),
  GROQ_TEXT_MODEL: z.string().min(1).default("llama-3.3-70b-versatile"),
  GROQ_VISION_MODEL: z.string().min(1).default("qwen/qwen3.8-27b"),
});

export type AppConfig = z.infer<typeof environmentSchema>;

export function loadConfig(options: { requireGroq?: boolean } = {}): AppConfig {
  const parsed = environmentSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(`Invalid environment configuration: ${parsed.error.issues.map((issue) => issue.path.join(".")).join(", ")}`);
  }
  if (options.requireGroq && !parsed.data.GROQ_API_KEY) {
    throw new Error("CRITICAL: GROQ_API_KEY environment variable is required.");
  }
  return parsed.data;
}