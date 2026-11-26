//? Imports de codigo
import { IsISO31661Alpha2, IsNotEmpty, IsString, IsUppercase, Matches } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

//? Imports de usuario
import { Trim } from '@common/application/decorators';

//* Formatos únicos: el teléfono se compara tal cual para detectar duplicados (`+34` ≠ `34`)
const PHONE_CODE = /^\+[1-9]\d{0,3}$/;
const PHONE_NUMBER = /^\d{7,15}$/;

export class CreatePhoneDto {
  @ApiProperty({
    description: 'Código ISO alfa-2 (Required)',
    required: true,
    example: 'ES',
  })
  @IsNotEmpty()
  @IsString()
  @IsUppercase()
  @IsISO31661Alpha2()
  @Trim()
  cca2: string;

  @ApiProperty({
    description: 'Prefijo telefónico con `+` (Required)',
    required: true,
    example: '+34',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(PHONE_CODE, { message: 'code must be "+" followed by 1 to 4 digits' })
  @Trim()
  code: string;

  @ApiProperty({
    description: 'Número local, solo dígitos (Required)',
    required: true,
    example: '600606060',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(PHONE_NUMBER, { message: 'number must contain only 7 to 15 digits' })
  @Trim()
  number: string;
}
