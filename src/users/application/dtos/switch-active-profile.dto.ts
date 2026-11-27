//? Imports de codigo
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

//? Imports de usuario
import { TEXT_MAX_LENGTH } from '@common/application/constants';
import { IsAbsentWhen, Trim } from '@common/application/decorators';
import { ProfileTypeEnum } from '@users/domain/enums';

export class SwitchActiveProfileDto {
  @ApiProperty({ required: true, enum: ProfileTypeEnum, example: ProfileTypeEnum.BUSINESS })
  @IsEnum(ProfileTypeEnum)
  activeProfileType: ProfileTypeEnum;

  @ApiProperty({
    required: false,
    description:
      'Empresa a activar (id de businessProfiles). Si se omite, la última activa o la primera. Prohibido con PERSONAL',
  })
  //! Con PERSONAL no se informa: cambiar al perfil personal no cambia la empresa activa
  @IsAbsentWhen<SwitchActiveProfileDto>('activeProfileType', ProfileTypeEnum.PERSONAL)
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(TEXT_MAX_LENGTH.ID)
  @Trim()
  businessProfileId?: string;
}
