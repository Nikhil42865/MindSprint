import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { env } from "../config/env.js";
import { ApiError } from "../utils/apiError.js";

export const errorHandler: ErrorRequestHandler = (
  error,
  _request,
  response,
  _next,
) => {
  if (error instanceof SyntaxError) {
    response.status(400).json({
      success: false,
      error: {
        code: "INVALID_REQUEST",
        message: "Request body must contain valid JSON.",
      },
    });
    return;
  }

  if (error instanceof ZodError) {
    response.status(400).json({
      success: false,
      error: {
        code: "INVALID_REQUEST",
        message: "The request data is invalid.",
      },
    });
    return;
  }

  if (error instanceof ApiError) {
    response.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
      },
    });
    return;
  }

  if (env.nodeEnv !== "test") {
    console.error(error);
  }

  response.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message: "Unexpected internal error.",
    },
  });
};