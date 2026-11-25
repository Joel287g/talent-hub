//? Imports de codigo
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

//? Imports de usuario
import { Trim } from '@common/application/decorators';
import { CreateAddressDto, CreateMediaFileDto, CreatePhoneDto } from '@common/application/dtos';
import { BusinessTypeEnum, DanceStyleEnum } from '@users/domain/enums';

export class CreateBusinessProfileDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  @Trim()
  name: string;

  @ApiProperty({ required: true, enum: BusinessTypeEnum })
  @IsEnum(BusinessTypeEnum)
  type: BusinessTypeEnum;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Trim()
  description?: string;

  @ApiProperty({ required: false, type: CreateMediaFileDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateMediaFileDto)
  @IsObject()
  avatar?: CreateMediaFileDto;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Trim()
  taxId?: string;

  @ApiProperty({ required: true })
  @IsEmail()
  @Trim()
  email: string;

  @ApiProperty({ required: true, type: CreatePhoneDto })
  @ValidateNested()
  @Type(() => CreatePhoneDto)
  @IsDefined()
  @IsObject()
  phone: CreatePhoneDto;

  @ApiProperty({ required: true, type: CreateAddressDto })
  @ValidateNested()
  @Type(() => CreateAddressDto)
  @IsDefined()
  @IsObject()
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
