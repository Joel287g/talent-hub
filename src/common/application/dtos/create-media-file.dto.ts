//? Imports de codigo
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

//? Imports de usuario
import { MediaExtension, MediaMimeType } from '@common/domain/enums';

export class CreateMediaFileDto {
  @ApiProperty({
    description: 'URL pública del CDN (Required)',
    required: true,
    example: 'https://cdn.talenthub.app/avatars/usr_123/avatar.webp',
  })
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @ApiProperty({
    description: 'Clave de almacenamiento en bucket (Required)',
    required: true,
    example: 'avatars/usr_123/avatar.webp',
  })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({
    description: 'URL de la miniatura (Optional)',
    required: false,
    example: 'https://cdn.talenthub.app/avatars/usr_123/avatar-thumb.webp',
  })
  @IsOptional()
  @IsUrl()
  thumbnailUrl?: string;

  @ApiProperty({
    description: 'Nombre original del archivo (Required)',
    required: true,
    example: 'headshot_2026.webp',
  })
  @IsString()
  @IsNotEmpty()
  originalName: string;

  @ApiProperty({
    description: 'Extensión del archivo (Required)',
    required: true,
    enum: MediaExtension,
    example: MediaExtension.MP4,
  })
  @IsEnum(MediaExtension)
  @IsNotEmpty()
  extension: MediaExtension;

  @ApiProperty({
    description: 'Tipo MIME del archivo (Required)',
    required: true,
    enum: MediaMimeType,
    example: MediaMimeType.VIDEO_MP4,
  })
  @IsEnum(MediaMimeType)
  @IsNotEmpty()
  mimeType: MediaMimeType;

  @ApiProperty({
    description: 'Tamaño en bytes del archivo (Required)',
    required: true,
    example: 784320,
  })
  @IsNumber()
  @IsPositive()
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
