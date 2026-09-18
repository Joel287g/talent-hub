//? Imports de codigo
import { Injectable, Inject, Logger } from '@nestjs/common';

//? Imports de usuario
import { LOGGER_REPOSITORY, LoggerRepository } from '@logger/application/ports';
import { LoggerCreateDto } from '@logger/application/dtos';
import { LoggerEntity } from '@logger/domain/entities';
import { LoggerLevel } from '@logger/domain/enums';

@Injectable()
export class LoggerService {
  private readonly consoleLogger: Logger;
  private readonly defaultContext = 'LoggerModule';

  constructor(
    @Inject(LOGGER_REPOSITORY)
    private readonly loggerRepository: LoggerRepository,
  ) {
    this.consoleLogger = new Logger(this.defaultContext);
  }

  private async generateLog(
    level: LoggerLevel,
    logger: LoggerCreateDto,
    contextDetail: string[] = [],
  ): Promise<void> {
    const contextString = [this.defaultContext, ...contextDetail].join('-');
    const activeLogger =
      contextDetail.length > 0 ? new Logger(contextString) : this.consoleLogger;

    activeLogger[level.toLowerCase()](
      logger.message,
      JSON.stringify(logger.data).slice(0, 2000),
    );

    const logEntity = LoggerEntity.create({
      type: logger.type,
      level,
      message: logger.message,
      data: logger.data,
    });

    await this.loggerRepository.save(logEntity);
  }

  public async error(
    logger: LoggerCreateDto,
    ...contextDetail: string[]
  ): Promise<void> {
    await this.generateLog(LoggerLevel.ERROR, logger, contextDetail);
  }

  public async log(
    logger: LoggerCreateDto,
    ...contextDetail: string[]
  ): Promise<void> {
    await this.generateLog(LoggerLevel.LOG, logger, contextDetail);
  }

  public async warning(
    logger: LoggerCreateDto,
    ...contextDetail: string[]
  ): Promise<void> {
    await this.generateLog(LoggerLevel.WARN, logger, contextDetail);
  }

  public async debug(
    logger: LoggerCreateDto,
    ...contextDetail: string[]
  ): Promise<void> {
    await this.generateLog(LoggerLevel.DEBUG, logger, contextDetail);
  }

  public async verbose(
    logger: LoggerCreateDto,
    ...contextDetail: string[]
  ): Promise<void> {
    await this.generateLog(LoggerLevel.VERBOSE, logger, contextDetail);
  }

  public async fatal(
    logger: LoggerCreateDto,
    ...contextDetail: string[]
  ): Promise<void> {
    await this.generateLog(LoggerLevel.FATAL, logger, contextDetail);
  }
}
