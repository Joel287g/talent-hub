export interface AddressInterface {
  country: string;
  city: string;
  postalCode: string;
  street: string;
}

export type CreateAddressType = AddressInterface;

export class AddressEntity {
  private readonly _country: string;
  private readonly _city: string;
  private readonly _postalCode: string;
  private readonly _street: string;

  constructor(address: AddressInterface) {
    this._country = address.country;
    this._city = address.city;
    this._postalCode = address.postalCode;
    this._street = address.street;
  }

  //? Getters
  public get country(): string {
    return this._country;
  }

  public get city(): string {
    return this._city;
  }

  public get postalCode(): string {
    return this._postalCode;
  }

  public get street(): string {
    return this._street;
  }

  //? Methods static
  public static create(address: CreateAddressType): AddressEntity {
    return new AddressEntity({
      country: address.country,
      city: address.city,
      postalCode: address.postalCode,
      street: address.street,
    });
  }
}
