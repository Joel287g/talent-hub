//? Imports de codigo
import { IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

//? Imports de usuario
import { Trim } from '@common/application/decorators';

export class CreateAddressDto {
  @ApiProperty({
    description: 'País de residencia (Required)',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Trim()
  country: string;

  @ApiProperty({
    description: 'Ciudad de residencia (Required)',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Trim()
  city: string;

  @ApiProperty({
    description: 'Código postal de residencia (Required)',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Trim()
  postalCode: string;

  @ApiProperty({
    description: 'Dirección de residencia (Required)',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Trim()
  street: string;
}
