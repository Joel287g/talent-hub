//? Imports de codigo
import { Types } from 'mongoose';

//? Imports de usuario
import { UserEntity } from '@users/domain/entities';
import { Users } from '@users/infrastructure/persistence/schemas';

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
      status: user.status,
      createdAt: (user as any).createdAt,
      updatedAt: (user as any).updatedAt,
    });
  }

  /**
   * Transforma la Entidad de Dominio pura en un objeto plano que Mongoose pueda guardar.
   */
  public static toPersistence(user: UserEntity): any {
    return {
      _id: user.id ? new Types.ObjectId(user.id) : new Types.ObjectId(),
      uid: user.uid,
      name: user.name,
      lastName: user.lastName,
      status: user.status,
      createdAt: user.createdAt ?? new Date(),
      updatedAt: user.updatedAt ?? new Date(),
    };
  }
}
