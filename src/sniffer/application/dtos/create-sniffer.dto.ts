//? Imports de codigo
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

//? Imports de codigo
import { MethodsHttp } from '@common/infrastructure/enums';

export class CreateSnifferDto {
  @ApiProperty({
    description: 'Autorización (optional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  auth?: string;

  @ApiProperty({
    description: 'ID de usuario (optional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({
    description: 'URL de la solicitud (required)',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  url: string;

  @ApiProperty({
    description: 'IP del usuario que realiza la solicitud (required)',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  ip: string;

  @ApiProperty({
    description: 'Contenido de la aplicación (required)',
    required: true,
  })
  @IsNotEmpty()
  request: any;

  @ApiProperty({
    description: 'Respuesta de la solicitud (required)',
    required: false,
  })
  @IsOptional()
  response?: any;

  @ApiProperty({
    description: 'Headers de la solicitud (required)',
    required: true,
  })
  @IsOptional()
  headers?: any;

  @ApiProperty({
    description: 'Método de la respuesta HTTP (required)',
    required: true,
    enum: MethodsHttp,
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(MethodsHttp)
  method: MethodsHttp;

  @ApiProperty({
    description: 'Código de respuesta HTTP (required)',
    required: true,
    enum: HttpStatus,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsEnum(HttpStatus)
  statusCode?: HttpStatus;

  @ApiProperty({
    description: 'Tiempo de procesamiento en ms (required)',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  processingTime?: number;

  @ApiProperty({
    description: 'User agent (optional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  userAgent?: string;

  @ApiProperty({
    description: 'Referer (optional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  referer?: string;

  @ApiProperty({
    description: 'Versión de la aplicación (required)',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  appVersion: string;
}
