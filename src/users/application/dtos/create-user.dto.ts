//? Imports de codigo
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

//? Imports de usuario
import { Trim } from '@common/application/decorators';
import { CreatePhoneDto } from '@common/application/dtos';

import { CreateBusinessProfileDto } from '@users/application/dtos/create-business-profile.dto';
import { CreatePersonalProfileDto } from '@users/application/dtos/create-personal-profile.dto';
import { ProfileTypeEnum } from '@users/domain/enums';

//? Distingue un valor informado (aunque sea inválido) de uno ausente
const isProvided = (value: unknown): boolean => value !== undefined && value !== null;

//? Una lista vacía equivale a no informar ninguna empresa
const isEmptyList = (value: unknown): boolean => Array.isArray(value) && value.length === 0;

export class CreateUserDto {
  @ApiProperty({ required: true, example: 'gcp_uid_9f8e7d6c5b4a3210' })
  @IsString()
  @IsNotEmpty()
  @Trim()
  uid: string;

  @ApiProperty({ required: true, example: 'Valeria' })
  @IsString()
  @IsNotEmpty()
  @Trim()
  name: string;

  @ApiProperty({ required: true, example: 'Mendoza' })
  @IsString()
  @IsNotEmpty()
  @Trim()
  lastName: string;

  @ApiProperty({ required: true, example: 'valeria.mendoza@correo.com' })
  @IsEmail()
  @Trim()
  email: string;

  @ApiProperty({ required: false, type: CreatePhoneDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreatePhoneDto)
  @IsObject()
  phone?: CreatePhoneDto;

  @ApiProperty({ required: true, enum: ProfileTypeEnum, example: ProfileTypeEnum.PERSONAL })
  @IsEnum(ProfileTypeEnum)
  activeProfileType: ProfileTypeEnum;

  @ApiProperty({ required: false, type: CreatePersonalProfileDto })
  //* Obligatorio si es el perfil activo; si no lo es, se valida igualmente cuando llega informado
  @ValidateIf(
    (dto: CreateUserDto) =>
      dto.activeProfileType === ProfileTypeEnum.PERSONAL || isProvided(dto.personalProfile),
  )
  @IsNotEmpty({})
  @ValidateNested()
  @Type(() => CreatePersonalProfileDto)
  @IsObject()
  personalProfile?: CreatePersonalProfileDto;

  @ApiProperty({ required: false, type: [CreateBusinessProfileDto] })
  @ValidateIf(
    (dto: CreateUserDto) =>
      dto.activeProfileType === ProfileTypeEnum.BUSINESS ||
      (isProvided(dto.businessProfiles) && !isEmptyList(dto.businessProfiles)),
  )
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateBusinessProfileDto)
  businessProfiles?: CreateBusinessProfileDto[];
}
