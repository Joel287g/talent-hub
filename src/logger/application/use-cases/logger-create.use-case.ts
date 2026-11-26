//? Imports de codigo
import { Injectable, Inject } from '@nestjs/common';

//? Imports de usuario
import { LOGGER_REPOSITORY, LoggerRepository } from '@logger/application/ports';
import { CreateLoggerType, LoggerEntity } from '@logger/domain/entities';

@Injectable()
export class CreateLogUseCase {
  constructor(
    @Inject(LOGGER_REPOSITORY)
    private readonly loggerRepository: LoggerRepository,
  ) {}

  async execute(payload: CreateLoggerType): Promise<void> {
    const LOGGER = LoggerEntity.create(payload);

    await this.loggerRepository.save(LOGGER);
  }
}
