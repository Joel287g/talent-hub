//? Imports de codigo
import { Type } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

//? Imports de usuario
import { TEXT_MAX_LENGTH } from '@common/application/constants';
import { IsOptionalNotNull, IsSafeText, Trim } from '@common/application/decorators';
import { CreateAddressDto, CreateAvatarDto } from '@common/application/dtos';
import { BusinessTypeEnum, DanceStyleEnum } from '@users/domain/enums';

/**
 * Edición parcial de una cuenta de empresa: los campos omitidos no cambian.
 * En los campos opcionales (`description`, `avatar`), `null` o un texto vacío los borra.
 *
 * //! `email`, `phone` y `taxId` no se editan por esta vía: el `ValidationPipe` (`whitelist`) los descarta.
 */
export class UpdateBusinessProfileDto {
  @ApiProperty({ required: false })
  @IsOptionalNotNull()
  @IsNotEmpty()
  @IsString()
  @MaxLength(TEXT_MAX_LENGTH.NAME)
  @IsSafeText()
  @Trim()
  name?: string;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(TEXT_MAX_LENGTH.LONG_TEXT)
  @IsSafeText({ multiline: true })
  @Trim({ emptyToNull: true })
  description?: string | null;

  @ApiProperty({ required: false, enum: BusinessTypeEnum })
  @IsOptionalNotNull()
  @IsEnum(BusinessTypeEnum)
  type?: BusinessTypeEnum;

  @ApiProperty({ required: false, nullable: true, type: CreateAvatarDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateAvatarDto)
  avatar?: CreateAvatarDto | null;

  @ApiProperty({ required: false, type: CreateAddressDto })
  @IsOptionalNotNull()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address?: CreateAddressDto;

  @ApiProperty({ required: false, enum: DanceStyleEnum, isArray: true })
  @IsOptionalNotNull()
  @IsArray()
  @ArrayUnique()
  @IsEnum(DanceStyleEnum, { each: true })
  offeredStyles?: DanceStyleEnum[];

  @ApiProperty({ required: false })
  @IsOptionalNotNull()
  @IsBoolean()
  availableToTravel?: boolean;

  @ApiProperty({ required: false })
  @IsOptionalNotNull()
  @IsBoolean()
  ownTransportation?: boolean;
}
