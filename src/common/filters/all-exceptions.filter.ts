import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';

const toMessage = (value: unknown): string | undefined => {
  if (!value) return undefined;
  if (typeof value === 'string') return value;

  if (Array.isArray(value)) {
    const parts = value.filter((x): x is string => typeof x === 'string');
    return parts.length ? parts.join(', ') : undefined;
  }

  if (typeof value === 'object' && value) {
    const msg = (value as Record<string, unknown>).message;
    return toMessage(msg);
  }

  return undefined;
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: unknown = undefined;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const res = exception.getResponse();
      errors = res;
      message =
        toMessage(res) ??
        (exception.message || `Request failed with status ${statusCode}`);
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    response.status(statusCode).json({
      success: false,
      statusCode,
      message,
      errors,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
