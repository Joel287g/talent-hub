//? Imports de codigo
import { Inject, Injectable } from '@nestjs/common';

//? Imports de usuario
import { SNIFFER_REPOSITORY, SnifferRepository } from '@sniffer/domain/repositories';
import { CreateSnifferType, SnifferEntity } from '@sniffer/domain/entities';

@Injectable()
export class CreateSnifferUseCase {
  constructor(
    @Inject(SNIFFER_REPOSITORY)
    private readonly snifferRepository: SnifferRepository,
  ) {}

  async execute(payload: CreateSnifferType): Promise<SnifferEntity> {
    const ENTITY = SnifferEntity.create(payload);
    return await this.snifferRepository.create(ENTITY);
  }
}
