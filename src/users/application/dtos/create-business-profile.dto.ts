//? Imports de codigo
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

//? Imports de usuario
import { CreateAddressDto, CreateMediaFileDto, CreatePhoneDto } from '@common/application/dtos';
import { BusinessTypeEnum, DanceStyleEnum } from '@users/domain/enums';

export class CreateBusinessProfileDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: true, enum: BusinessTypeEnum })
  @IsEnum(BusinessTypeEnum)
  type: BusinessTypeEnum;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false, type: CreateMediaFileDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateMediaFileDto)
  avatar?: CreateMediaFileDto;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  taxId?: string;

  @ApiProperty({ required: true })
  @IsEmail()
  email: string;

  @ApiProperty({ required: true, type: CreatePhoneDto })
  @ValidateNested()
  @Type(() => CreatePhoneDto)
  phone: CreatePhoneDto;

  @ApiProperty({ required: true, type: CreateAddressDto })
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address: CreateAddressDto;

  @ApiProperty({
    required: true,
    enum: DanceStyleEnum,
    isArray: true,
  })
  @IsArray()
  @IsEnum(DanceStyleEnum, { each: true })
  offeredStyles: DanceStyleEnum[];

  @ApiProperty({ required: true, default: false })
  @IsBoolean()
  availableToTravel: boolean;

  @ApiProperty({ required: true, default: false })
  @IsBoolean()
  ownTransportation: boolean;
}
