import type { ErrorRequestHandler, RequestHandler } from "express";
import crypto from "node:crypto";
import { ZodError } from "zod";

export const requestId: RequestHandler = (request, response, next) => {
  const id = request.header("x-request-id")?.trim() || crypto.randomUUID();
  response.setHeader("x-request-id", id);
  response.locals.requestId = id;
  next();
};

export const notFound: RequestHandler = (request, response) => {
  response.status(404).json({
    data: null,
    error: { code: "NOT_FOUND", message: `Route not found: ${request.method} ${request.path}` },
    requestId: response.locals.requestId,
  });
};

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  const message = error instanceof Error ? error.message : "Unexpected server error.";
  const isValidationError = error instanceof ZodError;
  const isProviderError = error instanceof Error && error.name === "APIError";
  const isConfigurationError = message.includes("required") || message.includes("configuration");
  const status = isValidationError ? 400 : isConfigurationError ? 503 : isProviderError ? 502 : 500;
  const publicMessage = isValidationError
    ? "The request contains invalid fields."
    : status === 503
      ? "The AI service is not configured."
      : status === 502
        ? "The AI provider is temporarily unavailable."
        : "Something went wrong. Please try again.";
  response.status(status).json({
    data: null,
    error: {
      code: isValidationError ? "INVALID_REQUEST" : status === 503 ? "SERVICE_NOT_CONFIGURED" : status === 502 ? "AI_PROVIDER_ERROR" : "INTERNAL_ERROR",
      message: publicMessage,
      ...(isValidationError ? { fields: error.flatten().fieldErrors } : {}),
    },
    requestId: response.locals.requestId,
  });
};