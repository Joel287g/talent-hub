//? Imports de codigo
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

//? Imports de usuario
import { TEXT_MAX_LENGTH } from '@common/application/constants';
import { IsSafeText, Trim } from '@common/application/decorators';
import { CreatePhoneDto } from '@common/application/dtos';

import { CreateBusinessProfileDto } from '@users/application/dtos/create-business-profile.dto';
import { CreatePersonalProfileDto } from '@users/application/dtos/create-personal-profile.dto';
import { ProfileTypeEnum } from '@users/domain/enums';

//? Distingue un valor informado (aunque sea inválido) de uno ausente
const isProvided = (value: unknown): boolean => value !== undefined && value !== null;

//? Una lista vacía equivale a no informar ninguna empresa
const isEmptyList = (value: unknown): boolean => Array.isArray(value) && value.length === 0;

//! El uid y el email no se reciben en el body: salen del token verificado del proveedor de identidad
export class CreateUserDto {
  @ApiProperty({ required: true, example: 'Valeria' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(TEXT_MAX_LENGTH.NAME)
  @IsSafeText()
  @Trim()
  name: string;

  @ApiProperty({ required: true, example: 'Mendoza' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(TEXT_MAX_LENGTH.NAME)
  @IsSafeText()
  @Trim()
  lastName: string;

  @ApiProperty({ required: false, type: CreatePhoneDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => CreatePhoneDto)
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
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => CreatePersonalProfileDto)
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
