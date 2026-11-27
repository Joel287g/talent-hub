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
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

//? Imports de usuario
import { TEXT_MAX_LENGTH } from '@common/application/constants';
import { IsSafeText, Trim } from '@common/application/decorators';
import { CreateAddressDto, CreateAvatarDto } from '@common/application/dtos';
import { DanceStyleEnum, SpecialtyEnum } from '@users/domain/enums';

//* Mismo formato que en el alta (CreatePersonalProfileDto)
const ALIAS = /^[\p{L}\p{N}._-]+(?: [\p{L}\p{N}._-]+)*$/u;

//? Campos obligatorios del perfil: se pueden omitir (sin cambios), pero un `null` se valida y se rechaza
const isSent = (_dto: object, value: unknown): boolean => value !== undefined;

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
  @ValidateIf(isSent)
  @IsObject()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address?: CreateAddressDto;

  @ApiProperty({ required: false, enum: SpecialtyEnum, isArray: true })
  @ValidateIf(isSent)
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsEnum(SpecialtyEnum, { each: true })
  specialties?: SpecialtyEnum[];

  @ApiProperty({ required: false, enum: DanceStyleEnum, isArray: true })
  @ValidateIf(isSent)
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsEnum(DanceStyleEnum, { each: true })
  danceStyles?: DanceStyleEnum[];

  @ApiProperty({ required: false })
  @ValidateIf(isSent)
  @IsBoolean()
  availableToTravel?: boolean;

  @ApiProperty({ required: false })
  @ValidateIf(isSent)
  @IsBoolean()
  ownTransportation?: boolean;
}
