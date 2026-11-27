//? Imports de codigo
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsEnum,
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
import { IsOptionalNotNull, IsSafeText, Trim } from '@common/application/decorators';
import { CreateAddressDto, CreateAvatarDto } from '@common/application/dtos';
import { DanceStyleEnum, SpecialtyEnum } from '@users/domain/enums';

//* Mismo formato que en el alta (CreatePersonalProfileDto)
const ALIAS = /^[\p{L}\p{N}._-]+(?: [\p{L}\p{N}._-]+)*$/u;

/**
 * Edición parcial del perfil personal: los campos omitidos no cambian.
 * En los campos opcionales (`alias`, `headline`, `biography`, `avatar`), `null` o un texto vacío los borra.
 */
export class UpdatePersonalProfileDto {
  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(TEXT_MAX_LENGTH.ALIAS)
  @Matches(ALIAS, {
    message: 'alias may only contain letters, digits, ".", "_", "-" and single spaces',
  })
  @Trim({ emptyToNull: true })
  alias?: string | null;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(TEXT_MAX_LENGTH.HEADLINE)
  @IsSafeText()
  @Trim({ emptyToNull: true })
  headline?: string | null;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(TEXT_MAX_LENGTH.LONG_TEXT)
  @IsSafeText({ multiline: true })
  @Trim({ emptyToNull: true })
  biography?: string | null;

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

  @ApiProperty({ required: false, enum: SpecialtyEnum, isArray: true })
  @IsOptionalNotNull()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsEnum(SpecialtyEnum, { each: true })
  specialties?: SpecialtyEnum[];

  @ApiProperty({ required: false, enum: DanceStyleEnum, isArray: true })
  @IsOptionalNotNull()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsEnum(DanceStyleEnum, { each: true })
  danceStyles?: DanceStyleEnum[];

  @ApiProperty({ required: false })
  @IsOptionalNotNull()
  @IsBoolean()
  availableToTravel?: boolean;

  @ApiProperty({ required: false })
  @IsOptionalNotNull()
  @IsBoolean()
  ownTransportation?: boolean;
}
