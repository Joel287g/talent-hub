//? Imports de codigo
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

//? Imports de usuario
import { LoggerTypes, LoggerLevel } from '@logger/domain/enums';

export class LoggerCreateDto {
  @ApiProperty({
    description: 'Type of log (required)',
    required: true,
    enum: LoggerTypes,
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(LoggerTypes)
  readonly type: LoggerTypes;

  @ApiProperty({
    description: 'Level of log (required)',
    required: true,
    enum: LoggerLevel,
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(LoggerLevel)
  readonly level: LoggerLevel;

  @ApiProperty({
    description: 'Message of log (required)',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly message: any;

  @ApiProperty({
    description: 'Data of log (required)',
    required: true,
    default: {},
  })
  @IsNotEmpty()
  readonly data: any;
}
