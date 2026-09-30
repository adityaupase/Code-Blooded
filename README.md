# AgriSmart

AgriSmart is an AI-powered crop advisory platform designed for farmers, agronomists, and agricultural extension workers. This first commit establishes the accessible, field-friendly React frontend shell described in the engineering brief.

## Current foundation

- Vite + React 18 + TypeScript
- Wouter-ready navigation surface for Overview, Crop Diagnosis, Recommendations, AgriChat, and Farm Log
- Responsive dashboard with plot health, weather context, daily actions, and season progress
- High-contrast earthy green and amber visual system with touch-friendly controls
- Lucide icons and a component structure ready for React Query-backed data

## Run locally

```bash
npm install
npm run dev
```

Create a production build with:

```bash
npm run build
```

Run the backend locally with:

```bash
npm run server:dev
```

The backend exposes `GET /api/health`, `GET /api/ready`, `POST /api/ai/chat`, and `POST /api/ai/diagnose`. The AI routes are enabled only when the backend process has `GROQ_API_KEY`; the key must never be added to React or Vite client configuration.

For local backend use, create a server-side environment file or configure Replit Secrets:

```text
GROQ_API_KEY=replace-with-a-server-side-secret
GROQ_TEXT_MODEL=llama-3.3-70b-versatile
GROQ_VISION_MODEL=qwen/qwen3.8-27b
```

`/api/health` verifies that the process is alive. `/api/ready` reports `503` until Groq is configured, which prevents a deployment from appearing healthy while AI features are unavailable.

## Delivery sequence

1. Add the Express API, shared Zod schemas, and PostgreSQL/Drizzle migrations.
2. Add plot, farm activity, soil reading, diagnosis, and chat persistence.
3. Add the Gemini integration with structured response validation for diagnosis and advisory synthesis.
4. Connect live weather data and image upload storage.
5. Complete the five application routes and add end-to-end accessibility checks.

The frontend intentionally starts with the dashboard because it gives farmers one clear daily operating view before deeper workflows are added.