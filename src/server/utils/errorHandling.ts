import { Response } from "express";

// Error logging utility
export const logError = (
  context: string,
  error: unknown,
  additionalInfo?: Record<string, any>
) => {
  const timestamp = new Date().toISOString();
  const errorMessage = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;

  console.error(`[${timestamp}] ERROR in ${context}:`, {
    message: errorMessage,
    stack,
    ...additionalInfo,
  });
};

// Standard error response utility
export const sendErrorResponse = (
  res: Response,
  statusCode: number,
  message: string,
  context: string,
  error?: unknown,
  additionalInfo?: Record<string, any>
) => {
  if (error) {
    logError(context, error, additionalInfo);
  }

  res.status(statusCode).json({
    success: false,
    message,
    timestamp: new Date().toISOString(),
  });
};

// Common error types and their handling
export const handleDatabaseError = (
  res: Response,
  context: string,
  error: unknown
) => {
  const errorMessage = error instanceof Error ? error.message : String(error);

  // Check for common database errors
  if (errorMessage.includes("unique constraint")) {
    sendErrorResponse(res, 409, "Resource already exists", context, error);
  } else if (errorMessage.includes("foreign key constraint")) {
    sendErrorResponse(
      res,
      400,
      "Invalid reference to related resource",
      context,
      error
    );
  } else if (errorMessage.includes("not found")) {
    sendErrorResponse(res, 404, "Resource not found", context, error);
  } else {
    sendErrorResponse(res, 500, "Database operation failed", context, error);
  }
};

export const handleExternalApiError = (
  res: Response,
  context: string,
  error: unknown,
  apiName: string
) => {
  const errorMessage = error instanceof Error ? error.message : String(error);

  // Check if it's an axios error
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as any;
    const status = axiosError.response?.status;
    const statusText = axiosError.response?.statusText;

    logError(context, error, {
      api: apiName,
      status,
      statusText,
      responseData: axiosError.response?.data,
    });

    if (status === 401) {
      sendErrorResponse(
        res,
        503,
        `${apiName} API authentication failed`,
        context
      );
    } else if (status === 403) {
      sendErrorResponse(res, 503, `${apiName} API access forbidden`, context);
    } else if (status === 404) {
      sendErrorResponse(res, 404, "Resource not found", context);
    } else if (status === 429) {
      sendErrorResponse(
        res,
        429,
        `${apiName} API rate limit exceeded`,
        context
      );
    } else if (status >= 500) {
      sendErrorResponse(
        res,
        503,
        `${apiName} API is currently unavailable`,
        context
      );
    } else {
      sendErrorResponse(res, 400, `Invalid request to ${apiName} API`, context);
    }
  } else {
    logError(context, error, { api: apiName });
    sendErrorResponse(res, 503, `Failed to connect to ${apiName} API`, context);
  }
};

// Validation error utility
export const sendValidationError = (
  res: Response,
  message: string,
  field?: string
) => {
  res.status(400).json({
    success: false,
    message,
    field,
    timestamp: new Date().toISOString(),
  });
};

// Success response utility
export const sendSuccessResponse = (
  res: Response,
  data: any,
  message?: string,
  statusCode = 200
) => {
  res.status(statusCode).json({
    success: true,
    message: message || "Operation completed successfully",
    data,
    timestamp: new Date().toISOString(),
  });
};
