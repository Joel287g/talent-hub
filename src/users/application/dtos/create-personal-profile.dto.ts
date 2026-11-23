//? Imports de codigo
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

//? Imports de usuario
import { CreateAddressDto, CreateMediaFileDto } from '@common/application/dtos';
import { DanceStyleEnum, SpecialtyEnum } from '@users/domain/enums';

export class CreatePersonalProfileDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  alias?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  headline?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  biography?: string;

  @ApiProperty({ required: false, type: CreateMediaFileDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateMediaFileDto)
  avatar?: CreateMediaFileDto;

  @ApiProperty({ required: true, type: CreateAddressDto })
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
