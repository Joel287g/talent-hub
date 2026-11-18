//? Imports de usuario
import {
  AddressEntity,
  AddressInterface,
  MediaFileEntity,
  MediaFileInterface,
  PhoneEntity,
  PhoneInterface,
} from '@common/domain/entities';
import { BusinessTypeEnum, DanceStyleEnum } from '@users/domain/enums';

export interface BusinessProfileInterface {
  id?: string | null;
  name: string;
  description?: string | null;
  type: BusinessTypeEnum;
  avatar?: MediaFileInterface | null;
  taxId?: string | null;
  email: string;
  phone: PhoneInterface;
  address: AddressInterface;
  availableToTravel: boolean;
  ownTransportation: boolean;
  offeredStyles: DanceStyleEnum[];
  createdAt?: Date;
  updatedAt?: Date;
}

export type CreateBusinessProfileType = Omit<
  BusinessProfileInterface,
  'id' | 'availableToTravel' | 'ownTransportation' | 'offeredStyles' | 'createdAt' | 'updatedAt'
> & {
  availableToTravel?: boolean;
  ownTransportation?: boolean;
  offeredStyles?: DanceStyleEnum[];
};

export class BusinessProfileEntity {
  private readonly _id: string | null;
  private readonly _name: string;
  private readonly _description: string | null;
  private readonly _type: BusinessTypeEnum;
  private readonly _avatar: MediaFileEntity | null;
  private readonly _taxId: string | null;
  private readonly _email: string;
  private readonly _phone: PhoneEntity;
  private readonly _address: AddressEntity;
  private readonly _availableToTravel: boolean;
  private readonly _ownTransportation: boolean;
  private readonly _offeredStyles: DanceStyleEnum[];
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  constructor(businessProfile: BusinessProfileInterface) {
    this._id = businessProfile.id ?? null;
    this._name = businessProfile.name;
    this._description = businessProfile.description ?? null;
    this._type = businessProfile.type;
    this._avatar = businessProfile.avatar
      ? businessProfile.avatar instanceof MediaFileEntity
        ? businessProfile.avatar
        : new MediaFileEntity(businessProfile.avatar)
      : null;
    this._taxId = businessProfile.taxId ?? null;
    this._email = businessProfile.email;
    this._phone =
      businessProfile.phone instanceof PhoneEntity
        ? businessProfile.phone
        : new PhoneEntity(businessProfile.phone);
    this._address =
      businessProfile.address instanceof AddressEntity
        ? businessProfile.address
        : new AddressEntity(businessProfile.address);
    this._availableToTravel = businessProfile.availableToTravel;
    this._ownTransportation = businessProfile.ownTransportation;
    this._offeredStyles = businessProfile.offeredStyles ?? [];
    this._createdAt = businessProfile.createdAt ?? new Date();
    this._updatedAt = businessProfile.updatedAt ?? new Date();
  }

  //? Getters
  public get id(): string | null {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }

  public get description(): string | null {
    return this._description;
  }

  public get type(): BusinessTypeEnum {
    return this._type;
  }

  public get avatar(): MediaFileEntity | null {
    return this._avatar;
  }

  public get taxId(): string | null {
    return this._taxId;
  }

  public get email(): string {
    return this._email;
  }

  public get phone(): PhoneEntity {
    return this._phone;
  }

  public get address(): AddressEntity {
    return this._address;
  }

  public get availableToTravel(): boolean {
    return this._availableToTravel;
  }

  public get ownTransportation(): boolean {
    return this._ownTransportation;
  }

  public get offeredStyles(): DanceStyleEnum[] {
    return this._offeredStyles;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  //? Methods static
  public static create(businessProfile: CreateBusinessProfileType): BusinessProfileEntity {
    return new BusinessProfileEntity({
      name: businessProfile.name,
      description: businessProfile.description ?? null,
      type: businessProfile.type,
      avatar: businessProfile.avatar ? MediaFileEntity.create(businessProfile.avatar) : null,
      taxId: businessProfile.taxId ?? null,
      email: businessProfile.email,
      phone: PhoneEntity.create(businessProfile.phone),
      address: AddressEntity.create(businessProfile.address),
      availableToTravel: businessProfile.availableToTravel ?? false,
      ownTransportation: businessProfile.ownTransportation ?? false,
      offeredStyles: businessProfile.offeredStyles ?? [],
    });
  }
}
