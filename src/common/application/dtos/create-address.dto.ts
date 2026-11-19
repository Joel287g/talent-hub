//? Imports de codigo
import { IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateAddressDto {
  @ApiProperty({
    description: 'País de residencia (Required)',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  country: string;

  @ApiProperty({
    description: 'Ciudad de residencia (Required)',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({
    description: 'Código postal de residencia (Required)',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  postalCode: string;

  @ApiProperty({
    description: 'Dirección de residencia (Required)',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  street: string;
}
