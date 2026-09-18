//? Imports de codigo
import { IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'UID del usuario (Required)',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  uid: string;

  @ApiProperty({
    description: 'Nombre del usuario (Required)',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Apellido del usuario (Required)',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  lastName: string;
}
