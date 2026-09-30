import Groq from "groq-sdk";
import type { ChatRequest, DiagnosisRequest, DiagnosisResponse } from "../../shared/aiSchemas.js";
import { diagnosisResponseSchema } from "../../shared/aiSchemas.js";
import type { AppConfig } from "../config.js";

const AGRICULTURE_SYSTEM_PROMPT = [
  "You are AgriSmart, a cautious agricultural decision-support assistant.",
  "Separate visible observations from hypotheses and recommended next steps.",
  "Never claim certainty from incomplete evidence.",
  "Never invent pesticide registrations, product names, legal requirements, weather observations, or laboratory results.",
  "For chemical guidance, require the user to follow the locally registered product label and consult a qualified agronomist.",
].join(" ");

export class GroqService {
  private readonly client: Groq;
  private readonly textModel: string;
  private readonly visionModel: string;

  constructor(config: AppConfig) {
    if (!config.GROQ_API_KEY) {
      throw new Error("CRITICAL: GROQ_API_KEY environment variable is required.");
    }
    this.client = new Groq({ apiKey: config.GROQ_API_KEY });
    this.textModel = config.GROQ_TEXT_MODEL;
    this.visionModel = config.GROQ_VISION_MODEL;
  }

  async chat(request: ChatRequest): Promise<string> {
    const completion = await this.client.chat.completions.create({
      model: this.textModel,
      temperature: 0.2,
      max_tokens: 900,
      messages: [
        { role: "system", content: AGRICULTURE_SYSTEM_PROMPT },
        ...request.history.map((message) => ({ role: message.role, content: message.content }) as const),
        {
          role: "user",
          content: [
            request.context ? `Farm context: ${JSON.stringify(request.context)}` : "",
            request.message,
          ].filter(Boolean).join("\n\n"),
        },
      ],
    });
    return completion.choices[0]?.message?.content?.trim() || "I could not produce a reliable answer. Please try again with more crop and field context.";
  }

  async diagnose(request: DiagnosisRequest): Promise<DiagnosisResponse> {
    const completion = await this.client.chat.completions.create({
      model: this.visionModel,
      temperature: 0.1,
      max_tokens: 1_800,
      response_format: { type: "json_object" },
      messages: [{
        role: "user",
        content: [
          {
            type: "text",
            text: `${AGRICULTURE_SYSTEM_PROMPT}\n\nAnalyze this ${request.crop} image (${request.plantPart}).${request.symptoms ? ` User notes: ${request.symptoms}` : ""}\nReturn only JSON with keys: diagnosisStatus, primaryFinding, alternativeFindings, treatmentPlan, escalationGuidance, safetyNotice. Do not invent a chemical dosage.`,
          },
          { type: "image_url", image_url: { url: request.imageDataUrl } },
        ],
      }],
    });
    const rawContent = completion.choices[0]?.message?.content;
    if (!rawContent) {
      throw new Error("Groq returned an empty diagnosis response.");
    }
    const parsedJson: unknown = JSON.parse(rawContent);
    return diagnosisResponseSchema.parse(parsedJson);
  }
}