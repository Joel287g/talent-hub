import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';

export function catchConstructor(error: any) {
  switch (error.constructor) {
    case BadRequestException:
      throw new BadRequestException(error.message);
    case UnauthorizedException:
      throw new UnauthorizedException(error.message);
    case ForbiddenException:
      throw new ForbiddenException(error.message);
    case NotFoundException:
      throw new NotFoundException(error.message);
    case ConflictException:
      throw new ConflictException(error.message);
    case InternalServerErrorException:
      throw new InternalServerErrorException(error.message);
    case ServiceUnavailableException:
      throw new ServiceUnavailableException(error.message);
    default:
      switch (error.name) {
        case 'MongoServerError':
          throw new InternalServerErrorException(error.message);
        case 'ValidationError':
          throw new BadRequestException(error.message);
        default:
          throw new HttpException(
            {
              error: error.name,
              message: error.message,
              statusCode:
                error.response?.statusCode ||
                error.status ||
                HttpStatus.INTERNAL_SERVER_ERROR,
            },
            error.response?.statusCode ||
              error.status ||
              HttpStatus.INTERNAL_SERVER_ERROR,
          );
          break;
      }
      break;
  }
}
