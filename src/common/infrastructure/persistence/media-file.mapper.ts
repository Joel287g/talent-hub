//? Imports de codigo
import { Types } from 'mongoose';

//? Imports de usuario
import { MediaFileEntity, MediaFileInterface } from '@common/domain/entities';
import { MediaFile } from '@common/infrastructure/persistence/schemas';

export class MediaFileMapper {
  /**
   * Transforma el documento crudo de MongoDB a una Entidad de Dominio pura.
   */
  public static toDomain(mediaFile: MediaFile): MediaFileEntity {
    return new MediaFileEntity({
      id: mediaFile._id.toString(),
      url: mediaFile.url,
      key: mediaFile.key,
      thumbnailUrl: mediaFile.thumbnailUrl,
      originalName: mediaFile.originalName,
      extension: mediaFile.extension,
      mimeType: mediaFile.mimeType,
      size: mediaFile.size,
      createdAt: mediaFile.createdAt,
      updatedAt: mediaFile.updatedAt,
    });
  }

  /**
   * Transforma la Entidad de Dominio pura en un objeto plano que Mongoose pueda guardar.
   */
  public static toPersistence(mediaFile: MediaFileEntity): Record<string, any> {
    return {
      _id: mediaFile.id ? new Types.ObjectId(mediaFile.id) : new Types.ObjectId(),
      url: mediaFile.url,
      key: mediaFile.key,
      thumbnailUrl: mediaFile.thumbnailUrl,
      originalName: mediaFile.originalName,
      extension: mediaFile.extension,
      mimeType: mediaFile.mimeType,
      size: mediaFile.size,
      createdAt: mediaFile.createdAt,
      updatedAt: mediaFile.updatedAt,
    };
  }

  /**
   * Transforma la Entidad de Dominio pura en un objeto plano para la respuesta HTTP (sin prefijos `_`).
   */
  public static toResponse(mediaFile: MediaFileEntity): MediaFileInterface {
    return {
      id: mediaFile.id,
      url: mediaFile.url,
      key: mediaFile.key,
      thumbnailUrl: mediaFile.thumbnailUrl,
      originalName: mediaFile.originalName,
      extension: mediaFile.extension,
      mimeType: mediaFile.mimeType,
      size: mediaFile.size,
      duration: mediaFile.duration,
      createdAt: mediaFile.createdAt,
      updatedAt: mediaFile.updatedAt,
    };
  }
}
