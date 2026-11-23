//? Imports de codigo
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

//? Imports de usuario
import { CreatePhoneDto } from '@common/application/dtos';

import { CreateBusinessProfileDto } from '@users/application/dtos/create-business-profile.dto';
import { CreatePersonalProfileDto } from '@users/application/dtos/create-personal-profile.dto';
import { ProfileTypeEnum } from '@users/domain/enums';

export class CreateUserDto {
  @ApiProperty({ required: true, example: 'gcp_uid_9f8e7d6c5b4a3210' })
  @IsString()
  @IsNotEmpty()
  uid: string;

  @ApiProperty({ required: true, example: 'Valeria' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: true, example: 'Mendoza' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ required: true, example: 'valeria.mendoza@correo.com' })
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty({ required: false, type: CreatePhoneDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreatePhoneDto)
  phone?: CreatePhoneDto;

  @ApiProperty({ required: true, enum: ProfileTypeEnum, example: ProfileTypeEnum.PERSONAL })
  @IsEnum(ProfileTypeEnum)
  activeProfileType: ProfileTypeEnum;

  @ApiProperty({ required: false, type: CreatePersonalProfileDto })
  @ValidateIf((dto: CreateUserDto) => dto.activeProfileType === ProfileTypeEnum.PERSONAL)
  @IsNotEmpty({})
  @ValidateNested()
  @Type(() => CreatePersonalProfileDto)
  personalProfile?: CreatePersonalProfileDto;

  @ApiProperty({ required: false, type: [CreateBusinessProfileDto] })
  @ValidateIf((dto: CreateUserDto) => dto.activeProfileType === ProfileTypeEnum.BUSINESS)
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateBusinessProfileDto)
  businessProfiles?: CreateBusinessProfileDto[];
}
