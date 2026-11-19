//? Imports de usuario
import { PhoneEntity } from '@common/domain/entities';
import { Phone } from '@common/infrastructure/persistence/schemas';

export class PhoneMapper {
  /**
   * Transforma el documento crudo de MongoDB a una Entidad de Dominio pura.
   */
  public static toDomain(phone: Phone): PhoneEntity {
    return new PhoneEntity({
      cca2: phone.cca2,
      code: phone.code,
      number: phone.number,
    });
  }

  /**
   * Transforma la Entidad de Dominio pura en un objeto plano que Mongoose pueda guardar.
   */
  public static toPersistence(phone: PhoneEntity): Record<string, any> {
    return {
      cca2: phone.cca2,
      code: phone.code,
      number: phone.number,
    };
  }
}
