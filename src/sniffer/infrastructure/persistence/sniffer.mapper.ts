//? Imports de codigo
import { Types } from 'mongoose';

//? Imports de usuario
import { SnifferEntity } from '@sniffer/domain/entities';
import { Sniffer } from '@sniffer/infrastructure/persistence/schemas';

export class SnifferMapper {
  /**
   * Transforma el documento crudo de MongoDB a una Entidad de Dominio pura.
   */
  public static toDomain(sniffer: Sniffer): SnifferEntity {
    return new SnifferEntity({
      id: sniffer._id.toString(),
      userId: sniffer.userId ? sniffer.userId.toString() : undefined,
      auth: sniffer.auth,
      url: sniffer.url,
      ip: sniffer.ip,
      request: sniffer.request,
      response: sniffer.response,
      headers: sniffer.headers,
      method: sniffer.method,
      statusCode: sniffer.statusCode,
      processingTime: sniffer.processingTime,
      userAgent: sniffer.userAgent,
      referer: sniffer.referer,
      appVersion: sniffer.appVersion,
      createdAt: (sniffer as any).createdAt,
      updatedAt: (sniffer as any).updatedAt,
    });
  }

  /**
   * Transforma la Entidad de Dominio pura en un objeto plano que Mongoose pueda guardar.
   */
  public static toPersistence(entity: SnifferEntity): any {
    return {
      _id: entity.id ? new Types.ObjectId(entity.id) : new Types.ObjectId(),
      userId: entity.userId ? new Types.ObjectId(entity.userId) : undefined,
      auth: entity.auth,
      url: entity.url,
      ip: entity.ip,
      request: entity.request,
      response: entity.response,
      headers: entity.headers,
      method: entity.method,
      statusCode: entity.statusCode,
      processingTime: entity.processingTime,
      userAgent: entity.userAgent,
      referer: entity.referer,
      appVersion: entity.appVersion,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
