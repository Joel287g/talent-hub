//? Imports de usuario
import { AddressEntity, AddressInterface } from '@common/domain/entities';
import { Address } from '@common/infrastructure/persistence/schemas';

export class AddresMapper {
  /**
   * Transforma el documento crudo de MongoDB a una Entidad de Dominio pura.
   */
  public static toDomain(address: Address): AddressEntity {
    return new AddressEntity({
      country: address.country,
      city: address.city,
      postalCode: address.postalCode,
      street: address.street,
    });
  }

  /**
   * Transforma la Entidad de Dominio pura en un objeto plano que Mongoose pueda guardar.
   */
  public static toPersistence(address: AddressEntity): Record<string, any> {
    return {
      country: address.country,
      city: address.city,
      postalCode: address.postalCode,
      street: address.street,
    };
  }

  /**
   * Transforma la Entidad de Dominio pura en un objeto plano para la respuesta HTTP (sin prefijos `_`).
   */
  public static toResponse(address: AddressEntity): AddressInterface {
    return {
      country: address.country,
      city: address.city,
      postalCode: address.postalCode,
      street: address.street,
    };
  }
}
