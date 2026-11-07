import type { RequestHandler } from "express";
import { ApiError } from "../utils/apiError.js";

export const notFoundHandler: RequestHandler = (_request, _response, next) => {
  next(new ApiError(404, "ROUTE_NOT_FOUND", "The requested route was not found."));
};