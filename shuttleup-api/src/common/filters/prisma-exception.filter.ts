import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'DATABASE_ERROR';
    let message = 'An unexpected database error occurred';

    switch (exception.code) {
      case 'P2002': // Unique constraint violation
        status = HttpStatus.CONFLICT;
        code = 'CONFLICT';
        message = `A record with this ${(exception.meta?.target as string[])?.join(', ')} already exists`;
        break;
      case 'P2025': // Record not found
        status = HttpStatus.NOT_FOUND;
        code = 'NOT_FOUND';
        message = 'The requested record was not found';
        break;
      case 'P2003': // Foreign key constraint violation
        status = HttpStatus.BAD_REQUEST;
        code = 'BAD_REQUEST';
        message = 'Related record does not exist';
        break;
      default:
        this.logger.error(
          `Unhandled Prisma error [${exception.code}]: ${exception.message}`,
        );
    }

    response.status(status).json({
      success: false,
      error: { code, message },
    });
  }
}
