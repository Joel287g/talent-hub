//? Imports de codigo
import { Type } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

//? Imports de usuario
import { TEXT_MAX_LENGTH } from '@common/application/constants';
import { IsSafeText, Trim } from '@common/application/decorators';
import { CreateAddressDto, CreateAvatarDto, CreatePhoneDto } from '@common/application/dtos';
import { BusinessTypeEnum, DanceStyleEnum } from '@users/domain/enums';

//* Letras, dígitos y guiones; hasta 20 caracteres (cubre los formatos fiscales habituales)
const TAX_ID = /^[A-Za-z0-9-]{1,20}$/;

export class CreateBusinessProfileDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(TEXT_MAX_LENGTH.NAME)
  @IsSafeText()
  @Trim()
  name: string;

  @ApiProperty({ required: true, enum: BusinessTypeEnum })
  @IsEnum(BusinessTypeEnum)
  type: BusinessTypeEnum;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(TEXT_MAX_LENGTH.LONG_TEXT)
  @IsSafeText({ multiline: true })
  @Trim({ emptyToNull: true })
  description?: string;

  @ApiProperty({ required: false, type: CreateAvatarDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateAvatarDto)
  avatar?: CreateAvatarDto;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Matches(TAX_ID, { message: 'taxId may only contain letters, digits and "-" (max 20)' })
  @Trim({ emptyToNull: true })
  taxId?: string;

  @ApiProperty({ required: true })
  @IsEmail()
  @MaxLength(TEXT_MAX_LENGTH.EMAIL)
  @Trim()
  email: string;

  @ApiProperty({ required: true, type: CreatePhoneDto })
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => CreatePhoneDto)
  phone: CreatePhoneDto;

  @ApiProperty({ required: true, type: CreateAddressDto })
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address: CreateAddressDto;

  @ApiProperty({
    required: true,
    enum: DanceStyleEnum,
    isArray: true,
  })
  @IsArray()
  @ArrayUnique()
  @IsEnum(DanceStyleEnum, { each: true })
  offeredStyles: DanceStyleEnum[];

  @ApiProperty({ required: true, default: false })
  @IsBoolean()
  availableToTravel: boolean;

  @ApiProperty({ required: true, default: false })
  @IsBoolean()
  ownTransportation: boolean;
}
