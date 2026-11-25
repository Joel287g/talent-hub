//? Imports de codigo
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDefined,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

//? Imports de usuario
import { Trim } from '@common/application/decorators';
import { CreateAddressDto, CreateMediaFileDto } from '@common/application/dtos';
import { DanceStyleEnum, SpecialtyEnum } from '@users/domain/enums';

export class CreatePersonalProfileDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Trim()
  alias?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Trim()
  headline?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Trim()
  biography?: string;

  @ApiProperty({ required: false, type: CreateMediaFileDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateMediaFileDto)
  @IsObject()
  avatar?: CreateMediaFileDto;

  @ApiProperty({ required: true, type: CreateAddressDto })
  @ValidateNested()
  @Type(() => CreateAddressDto)
  @IsDefined()
  @IsObject()
  address: CreateAddressDto;

  @ApiProperty({
    required: true,
    enum: SpecialtyEnum,
    isArray: true,
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(SpecialtyEnum, { each: true })
  specialties: SpecialtyEnum[];

  @ApiProperty({
    required: true,
    enum: DanceStyleEnum,
    isArray: true,
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(DanceStyleEnum, { each: true })
  danceStyles: DanceStyleEnum[];

  @ApiProperty({ required: true, default: false })
  @IsBoolean()
  availableToTravel: boolean;

  @ApiProperty({ required: true, default: false })
  @IsBoolean()
  ownTransportation: boolean;
}
