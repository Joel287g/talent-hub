//? Imports de codigo
import { registerDecorator, ValidationArguments } from 'class-validator';

//? Imports de usuario
import { MediaExtension, MediaMimeType } from '@common/domain/enums';

//* Tipo MIME de cada extensión (el `Record` obliga a cubrir cualquier extensión nueva)
const MIME_TYPE_BY_EXTENSION: Record<MediaExtension, MediaMimeType> = {
  [MediaExtension.MP4]: MediaMimeType.VIDEO_MP4,
  [MediaExtension.MOV]: MediaMimeType.VIDEO_QUICKTIME,
  [MediaExtension.WEBM]: MediaMimeType.VIDEO_WEBM,
  [MediaExtension.JPG]: MediaMimeType.IMAGE_JPEG,
  [MediaExtension.JPEG]: MediaMimeType.IMAGE_JPEG,
  [MediaExtension.PNG]: MediaMimeType.IMAGE_PNG,
  [MediaExtension.WEBP]: MediaMimeType.IMAGE_WEBP,
};

const VALIDATOR_NAME = 'isMimeTypeOfExtension';

/**
 * Comprueba que el tipo MIME corresponde a la extensión indicada en otra propiedad del mismo DTO.
 *
 * @param {string} extensionProperty - Propiedad del DTO que contiene la extensión.
 */
export const IsMimeTypeOfExtension =
  <TDto>(extensionProperty: keyof TDto & string): PropertyDecorator =>
  (target, propertyName) =>
    registerDecorator({
      name: VALIDATOR_NAME,
      target: target.constructor,
      propertyName: propertyName as string,
      constraints: [extensionProperty],
      options: {
        message: ({ property, constraints }: ValidationArguments) =>
          `${property} does not match ${constraints[0]}`,
      },
      validator: {
        validate: (value: unknown, { object, constraints }: ValidationArguments) =>
          MIME_TYPE_BY_EXTENSION[object[constraints[0]] as MediaExtension] === value,
      },
    });
