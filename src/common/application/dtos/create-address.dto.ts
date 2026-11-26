//? Imports de codigo
import {
  IsISO31661Alpha2,
  IsNotEmpty,
  IsString,
  IsUppercase,
  Matches,
  MaxLength,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

//? Imports de usuario
import { TEXT_MAX_LENGTH } from '@common/application/constants';
import { IsSafeText, Trim } from '@common/application/decorators';

//* Letras, dígitos, espacios y guiones; de 3 a 10 caracteres (cubre los formatos internacionales)
const POSTAL_CODE = /^[A-Za-z0-9][A-Za-z0-9 -]{1,8}[A-Za-z0-9]$/;

export class CreateAddressDto {
  @ApiProperty({
    description: 'Código ISO alfa-2 del país de residencia (Required)',
    required: true,
    example: 'ES',
  })
  @IsNotEmpty()
  @IsString()
  @IsUppercase()
  @IsISO31661Alpha2()
  @Trim()
  country: string;

  @ApiProperty({
    description: 'Ciudad de residencia (Required)',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(TEXT_MAX_LENGTH.CITY)
  @IsSafeText()
  @Trim()
  city: string;

  @ApiProperty({
    description: 'Código postal de residencia (Required)',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Matches(POSTAL_CODE, { message: 'postalCode must be a valid postal code' })
  @Trim()
  postalCode: string;

  @ApiProperty({
    description: 'Dirección de residencia (Required)',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(TEXT_MAX_LENGTH.STREET)
  @IsSafeText()
  @Trim()
  street: string;
}
