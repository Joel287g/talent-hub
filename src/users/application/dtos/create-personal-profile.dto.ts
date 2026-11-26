//? Imports de codigo
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsDefined,
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
import { IsSafeText, Trim } from '@common/application/decorators';
import { CreateAddressDto, CreateAvatarDto } from '@common/application/dtos';
import { DanceStyleEnum, SpecialtyEnum } from '@users/domain/enums';

//* Palabras de letras, dígitos, `.`, `_` o `-`, separadas por un único espacio (ej. "DJ Vale")
const ALIAS = /^[\p{L}\p{N}._-]+(?: [\p{L}\p{N}._-]+)*$/u;

export class CreatePersonalProfileDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(TEXT_MAX_LENGTH.ALIAS)
  @Matches(ALIAS, {
    message: 'alias may only contain letters, digits, ".", "_", "-" and single spaces',
  })
  @Trim({ emptyToNull: true })
  alias?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(TEXT_MAX_LENGTH.HEADLINE)
  @IsSafeText()
  @Trim({ emptyToNull: true })
  headline?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(TEXT_MAX_LENGTH.LONG_TEXT)
  @IsSafeText({ multiline: true })
  @Trim({ emptyToNull: true })
  biography?: string;

  @ApiProperty({ required: false, type: CreateAvatarDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateAvatarDto)
  avatar?: CreateAvatarDto;

  @ApiProperty({ required: true, type: CreateAddressDto })
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address: CreateAddressDto;

  @ApiProperty({
    required: true,
    enum: SpecialtyEnum,
    isArray: true,
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsEnum(SpecialtyEnum, { each: true })
  specialties: SpecialtyEnum[];

  @ApiProperty({
    required: true,
    enum: DanceStyleEnum,
    isArray: true,
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsEnum(DanceStyleEnum, { each: true })
  danceStyles: DanceStyleEnum[];

  @ApiProperty({ required: true, default: false })
  @IsBoolean()
  availableToTravel: boolean;

  @ApiProperty({ required: true, default: false })
  @IsBoolean()
  ownTransportation: boolean;
}
