//? Imports de codigo
import { Types } from 'mongoose';

//? Imports de usuario
import { PhoneMapper } from '@common/infrastructure/persistence';

import { Users } from '@users/infrastructure/persistence/schemas';
import { UserEntity } from '@users/domain/entities';

import { BusinessProfileMapper } from '@users/infrastructure/persistence/business-profile.mapper';
import { PersonalProfileMapper   } from '@users/infrastructure/persistence/personal-profile.mapper';

export class UserMapper {
  /**
   * Transforma el documento crudo de MongoDB a una Entidad de Dominio pura.
   */
  public static toDomain(user: Users): UserEntity {
    return new UserEntity({
      id: user._id.toString(),
      uid: user.uid,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone ? PhoneMapper.toDomain(user.phone) : null,
      activeProfileType: user.activeProfileType,
      personalProfile: user.personalProfile
        ? PersonalProfileMapper.toDomain(user.personalProfile)
        : null,
      businessProfiles: (user.businessProfiles ?? []).map((profile) =>
        BusinessProfileMapper.toDomain(profile),
      ),
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  /**
   * Transforma la Entidad de Dominio pura en un objeto plano que Mongoose pueda guardar.
   */
  public static toPersistence(user: UserEntity): Record<string, any> {
    return {
      _id: user.id ? new Types.ObjectId(user.id) : new Types.ObjectId(),
      uid: user.uid,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone ? PhoneMapper.toPersistence(user.phone) : null,
      activeProfileType: user.activeProfileType,
      personalProfile: user.personalProfile
        ? PersonalProfileMapper.toPersistence(user.personalProfile)
        : null,
      businessProfiles: user.businessProfiles.map((profile) =>
        BusinessProfileMapper.toPersistence(profile),
      ),
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
