export interface PhoneInterface {
  cca2: string;
  code: string;
  number: string;
}

export type CreatePhoneType = PhoneInterface;

export class PhoneEntity {
  private readonly _cca2: string;
  private readonly _code: string;
  private readonly _number: string;

  constructor(phone: PhoneInterface) {
    this._cca2 = phone.cca2;
    this._code = phone.code;
    this._number = phone.number;
  }

  //? Getters
  public get cca2(): string {
    return this._cca2;
  }

  public get code(): string {
    return this._code;
  }

  public get number(): string {
    return this._number;
  }

  //? Methods static
  public static create(phone: CreatePhoneType): PhoneEntity {
    return new PhoneEntity({
      cca2: phone.cca2,
      code: phone.code,
      number: phone.number,
    });
  }
}
