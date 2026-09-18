//? Imports de codigp
import { Inject, Injectable } from '@nestjs/common';

//? Imports de sniffer
import { CreateSnifferDto } from '@sniffer/application/dtos';
import {
  SNIFFER_REPOSITORY,
  SnifferRepository,
} from '@sniffer/domain/repositories';
import { SnifferEntity } from '@sniffer/domain/entities';

@Injectable()
export class CreateSnifferUseCase {
  constructor(
    @Inject(SNIFFER_REPOSITORY)
    private readonly snifferRepository: SnifferRepository,
  ) {}

  async execute(payload: CreateSnifferDto): Promise<SnifferEntity> {
    const ENTITY = SnifferEntity.create(payload);
    return await this.snifferRepository.create(ENTITY);
  }
}