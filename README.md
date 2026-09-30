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

## Delivery sequence

1. Add the Express API, shared Zod schemas, and PostgreSQL/Drizzle migrations.
2. Add plot, farm activity, soil reading, diagnosis, and chat persistence.
3. Add the Gemini integration with structured response validation for diagnosis and advisory synthesis.
4. Connect live weather data and image upload storage.
5. Complete the five application routes and add end-to-end accessibility checks.

The frontend intentionally starts with the dashboard because it gives farmers one clear daily operating view before deeper workflows are added.