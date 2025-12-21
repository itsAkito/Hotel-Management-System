// lib/api-error-handler.ts
export class APIError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code: string = 'UNKNOWN_ERROR'
  ) {
    super(message);
  }
}

export function handleAPIError(error: unknown) {
  if (error instanceof APIError) {
    return {
      status: error.statusCode,
      body: {
        error: error.message,
        code: error.code,
      },
    };
  }

  if (error instanceof Error) {
    console.error('API Error:', error);
    return {
      status: 500,
      body: {
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
      },
    };
  }

  return {
    status: 500,
    body: {
      error: 'Unknown error occurred',
      code: 'UNKNOWN_ERROR',
    },
  };
}

// Response formatting
export function successResponse<T>(data: T, statusCode = 200) {
  return {
    status: statusCode,
    body: {
      success: true,
      data,
    },
  };
}

export function errorResponse(message: string, code: string, statusCode = 400) {
  return {
    status: statusCode,
    body: {
      success: false,
      error: message,
      code,
    },
  };
}

// Rate limiting helper
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const record = requestCounts.get(key);

  if (!record || now > record.resetTime) {
    requestCounts.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count < limit) {
    record.count++;
    return true;
  }

  return false;
}

// Validation helpers
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '')
    .substring(0, 1000); // Limit length
}
