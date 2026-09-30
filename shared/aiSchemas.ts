import { z } from "zod";

export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(8_000),
});

export const chatRequestSchema = z.object({
  message: z.string().trim().min(1).max(4_000),
  history: z.array(chatMessageSchema).max(20).default([]),
  context: z.object({
    crop: z.string().trim().max(100).optional(),
    growthStage: z.string().trim().max(100).optional(),
    plotName: z.string().trim().max(100).optional(),
    symptoms: z.string().trim().max(1_000).optional(),
  }).optional(),
});

export const diagnosisRequestSchema = z.object({
  imageDataUrl: z.string()
    .regex(/^data:image\/(jpeg|jpg|png|webp);base64,[A-Za-z0-9+/=\s]+$/, "A supported image data URL is required.")
    .max(7_000_000),
  crop: z.string().trim().min(1).max(100),
  plantPart: z.string().trim().min(1).max(100),
  symptoms: z.string().trim().max(1_000).optional(),
});

export const diagnosisResponseSchema = z.object({
  diagnosisStatus: z.enum(["diagnosed", "low_quality", "needs_more_context", "unable_to_identify"]),
  primaryFinding: z.object({
    name: z.string(),
    category: z.enum(["disease", "pest", "deficiency", "abiotic_stress", "healthy", "unknown"]),
    confidence: z.number().min(0).max(1),
    explanation: z.string(),
  }),
  alternativeFindings: z.array(z.object({
    name: z.string(),
    confidence: z.number().min(0).max(1),
    distinguishingSigns: z.string(),
  })).max(5),
  treatmentPlan: z.object({
    organicBiological: z.array(z.string()).max(8),
    chemicalSafetyGuidance: z.array(z.string()).max(8),
    preventativeMeasures: z.array(z.string()).max(8),
  }),
  escalationGuidance: z.array(z.string()).max(8),
  safetyNotice: z.string(),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;
export type DiagnosisRequest = z.infer<typeof diagnosisRequestSchema>;
export type DiagnosisResponse = z.infer<typeof diagnosisResponseSchema>;