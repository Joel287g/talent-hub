//? Imports de codigo
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

//? Imports de usuario
import { TEXT_MAX_LENGTH } from '@common/application/constants';
import { IsOptionalNotNull, IsSafeText, Trim } from '@common/application/decorators';

/**
 * Edición parcial de los datos base del usuario: los campos omitidos no cambian y no se pueden borrar.
 *
 * //! `email` y `phone` no se editan por esta vía: cambiarlos exige confirmarlos antes (flujo de seguridad).
 * //! El `ValidationPipe` (`whitelist`) los descarta del body.
 */
export class UpdateUserDto {
  @ApiProperty({ required: false, example: 'Valeria' })
  @IsOptionalNotNull()
  @IsNotEmpty()
  @IsString()
  @MaxLength(TEXT_MAX_LENGTH.NAME)
  @IsSafeText()
  @Trim()
  name?: string;

  @ApiProperty({ required: false, example: 'Mendoza' })
  @IsOptionalNotNull()
  @IsNotEmpty()
  @IsString()
  @MaxLength(TEXT_MAX_LENGTH.NAME)
  @IsSafeText()
  @Trim()
  lastName?: string;
}
