//? Imports de codigo
import { Types } from 'mongoose';

//? Imports de usuario
import { BusinessProfileEntity } from '@users/domain/entities';
import { BusinessProfile } from '@users/infrastructure/persistence/schemas';
import { AddresMapper, MediaFileMapper, PhoneMapper } from '@common/infrastructure/persistence';

export class BusinessProfileMapper {
  /**
   * Transforma el documento crudo de MongoDB a una Entidad de Dominio pura.
   */
  public static toDomain(profile: BusinessProfile): BusinessProfileEntity {
    return new BusinessProfileEntity({
      id: profile._id.toString(),
      name: profile.name,
      description: profile.description,
      type: profile.type,
      avatar: MediaFileMapper.toDomain(profile.avatar),
      taxId: profile.taxId,
      email: profile.email,
      phone: PhoneMapper.toDomain(profile.phone),
      address: AddresMapper.toDomain(profile.address),
      availableToTravel: profile.availableToTravel,
      ownTransportation: profile.ownTransportation,
      offeredStyles: profile.offeredStyles ?? [],
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    });
  }

  /**
   * Transforma la Entidad de Dominio pura en un objeto plano que Mongoose pueda guardar.
   */
  public static toPersistence(profile: BusinessProfileEntity): Record<string, any> {
    return {
      _id: profile.id ? new Types.ObjectId(profile.id) : new Types.ObjectId(),
      name: profile.name,
      description: profile.description,
      type: profile.type,
      avatar: profile.avatar ? MediaFileMapper.toPersistence(profile.avatar) : null,
      taxId: profile.taxId,
      email: profile.email,
      phone: PhoneMapper.toPersistence(profile.phone),
      address: AddresMapper.toPersistence(profile.address),
      availableToTravel: profile.availableToTravel,
      ownTransportation: profile.ownTransportation,
      offeredStyles: profile.offeredStyles,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }
}
