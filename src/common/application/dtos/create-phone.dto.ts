//? Imports de codigo
import { IsNotEmpty, IsString, IsUppercase, Length, MaxLength, MinLength } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

//? Imports de usuario
import { Trim } from '@common/application/decorators';

export class CreatePhoneDto {
  @ApiProperty({
    description: 'Código ISO alfa-2 (Required)',
    required: true,
    example: 'ES',
  })
  @IsNotEmpty()
  @IsString()
  @IsUppercase()
  @Length(2, 2)
  @Trim()
  cca2: string;

  @ApiProperty({
    description: 'Prefijo telefónico (Required)',
    required: true,
    example: '+34',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(5)
  @Trim()
  code: string;

  @ApiProperty({
    description: 'Número local (Required)',
    required: true,
    example: '600606060',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(7)
  @MaxLength(15)
  @Trim()
  number: string;
}
