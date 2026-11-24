//? Imports de usuario
import { PersonalProfile } from '@users/infrastructure/persistence/schemas';
import { PersonalProfileEntity, PersonalProfileInterface } from '@users/domain/entities';

import { AddresMapper, MediaFileMapper } from '@common/infrastructure/persistence';

export class PersonalProfileMapper {
  /**
   * Transforma el documento crudo de MongoDB a una Entidad de Dominio pura.
   */
  public static toDomain(profile: PersonalProfile): PersonalProfileEntity {
    return new PersonalProfileEntity({
      alias: profile.alias,
      headline: profile.headline,
      biography: profile.biography,
      avatar: profile.avatar ? MediaFileMapper.toDomain(profile.avatar) : null,
      address: AddresMapper.toDomain(profile.address),
      availableToTravel: profile.availableToTravel,
      ownTransportation: profile.ownTransportation,
      specialties: profile.specialties ?? [],
      danceStyles: profile.danceStyles ?? [],
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    });
  }

  /**
   * Transforma la Entidad de Dominio pura en un objeto plano que Mongoose pueda guardar.
   */
  public static toPersistence(profile: PersonalProfileEntity): Record<string, any> {
    return {
      alias: profile.alias,
      headline: profile.headline,
      biography: profile.biography,
      avatar: profile.avatar ? MediaFileMapper.toPersistence(profile.avatar) : null,
      address: AddresMapper.toPersistence(profile.address),
      availableToTravel: profile.availableToTravel,
      ownTransportation: profile.ownTransportation,
      specialties: profile.specialties,
      danceStyles: profile.danceStyles,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }

  /**
   * Transforma la Entidad de Dominio pura en un objeto plano para la respuesta HTTP (sin prefijos `_`).
   */
  public static toResponse(profile: PersonalProfileEntity): PersonalProfileInterface {
    return {
      alias: profile.alias,
      headline: profile.headline,
      biography: profile.biography,
      avatar: profile.avatar ? MediaFileMapper.toResponse(profile.avatar) : null,
      address: AddresMapper.toResponse(profile.address),
      availableToTravel: profile.availableToTravel,
      ownTransportation: profile.ownTransportation,
      specialties: profile.specialties,
      danceStyles: profile.danceStyles,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }
}
