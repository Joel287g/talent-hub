//? Imports de codigo
import { IsEmpty, IsIn, IsInt, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

//? Imports de usuario
import { AVATAR_MAX_SIZE } from '@common/application/constants';
import { CreateMediaFileDto } from '@common/application/dtos/create-media-file.dto';
import { MediaExtension, MediaMimeType } from '@common/domain/enums';

//* Un avatar solo puede ser una imagen (el tipo MIME ya se cruza con la extensión)
const IMAGE_EXTENSIONS = [
  MediaExtension.JPG,
  MediaExtension.JPEG,
  MediaExtension.PNG,
  MediaExtension.WEBP,
];

const IMAGE_MIME_TYPES = [
  MediaMimeType.IMAGE_JPEG,
  MediaMimeType.IMAGE_PNG,
  MediaMimeType.IMAGE_WEBP,
];

/**
 * Archivo de imagen usado como foto de perfil o logotipo.
 * Hereda las validaciones de `CreateMediaFileDto` y añade las restricciones propias de una imagen.
 */
export class CreateAvatarDto extends CreateMediaFileDto {}

//! TypeScript no permite redeclarar una propiedad heredada solo para decorarla, así que los
//! decoradores se aplican sobre el prototipo. Cuidado: class-validator descarta los validadores
//! heredados de una propiedad en cuanto la subclase define los suyos, hay que repetir los que sigan aplicando
const AVATAR = CreateAvatarDto.prototype;

ApiProperty({
  description: 'Extensión de la imagen (Required)',
  required: true,
  enum: IMAGE_EXTENSIONS,
  example: MediaExtension.WEBP,
})(AVATAR, 'extension');
IsIn(IMAGE_EXTENSIONS)(AVATAR, 'extension');

//! Sin redeclarar el ejemplo, Swagger hereda el de `CreateMediaFileDto` (video/mp4) y el ejemplo es inválido
ApiProperty({
  description: 'Tipo MIME de la imagen, debe corresponder a la extensión (Required)',
  required: true,
  enum: IMAGE_MIME_TYPES,
  example: MediaMimeType.IMAGE_WEBP,
})(AVATAR, 'mimeType');

ApiProperty({
  description: `Tamaño en bytes de la imagen, máximo ${AVATAR_MAX_SIZE} (Required)`,
  required: true,
  example: 784320,
})(AVATAR, 'size');
IsInt()(AVATAR, 'size');
Min(1)(AVATAR, 'size');
Max(AVATAR_MAX_SIZE)(AVATAR, 'size');

ApiProperty({
  description: 'Una imagen no tiene duración: debe omitirse',
  required: false,
  readOnly: true,
})(AVATAR, 'duration');
IsEmpty()(AVATAR, 'duration');
