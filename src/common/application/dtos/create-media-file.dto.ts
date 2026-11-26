//? Imports de codigo
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

//? Imports de usuario
import { HTTPS_URL_OPTIONS, TEXT_MAX_LENGTH } from '@common/application/constants';
import { IsMimeTypeOfExtension, IsSafeText, Trim } from '@common/application/decorators';
import { MediaExtension, MediaMimeType } from '@common/domain/enums';

export class CreateMediaFileDto {
  @ApiProperty({
    description: 'URL pública del CDN, con https (Required)',
    required: true,
    example: 'https://cdn.talenthub.app/avatars/usr_123/avatar.webp',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(TEXT_MAX_LENGTH.URL)
  @IsUrl(HTTPS_URL_OPTIONS)
  @Trim()
  url: string;

  @ApiProperty({
    description: 'Clave de almacenamiento en bucket (Required)',
    required: true,
    example: 'avatars/usr_123/avatar.webp',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(TEXT_MAX_LENGTH.STORAGE_KEY)
  @IsSafeText()
  @Trim()
  key: string;

  @ApiProperty({
    description: 'URL de la miniatura, con https (Optional)',
    required: false,
    example: 'https://cdn.talenthub.app/avatars/usr_123/avatar-thumb.webp',
  })
  @IsOptional()
  @IsString()
  @MaxLength(TEXT_MAX_LENGTH.URL)
  @IsUrl(HTTPS_URL_OPTIONS)
  @Trim({ emptyToNull: true })
  thumbnailUrl?: string;

  @ApiProperty({
    description: 'Nombre original del archivo (Required)',
    required: true,
    example: 'headshot_2026.webp',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(TEXT_MAX_LENGTH.FILE_NAME)
  @IsSafeText()
  @Trim()
  originalName: string;

  @ApiProperty({
    description: 'Extensión del archivo (Required)',
    required: true,
    enum: MediaExtension,
    example: MediaExtension.MP4,
  })
  @IsNotEmpty()
  @IsEnum(MediaExtension)
  extension: MediaExtension;

  @ApiProperty({
    description: 'Tipo MIME del archivo, debe corresponder a la extensión (Required)',
    required: true,
    enum: MediaMimeType,
    example: MediaMimeType.VIDEO_MP4,
  })
  @IsNotEmpty()
  @IsEnum(MediaMimeType)
  @IsMimeTypeOfExtension<CreateMediaFileDto>('extension')
  mimeType: MediaMimeType;

  @ApiProperty({
    description: 'Tamaño en bytes del archivo (Required)',
    required: true,
    example: 784320,
  })
  @IsInt()
  @Min(1)
  size: number;

  @ApiProperty({
    description: 'Duración del archivo en segundos (Optional)',
    required: false,
    example: 15.5,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  duration?: number;
}
