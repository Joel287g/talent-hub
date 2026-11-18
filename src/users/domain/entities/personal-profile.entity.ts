//? Imports de usuario
import {
  AddressEntity,
  AddressInterface,
  MediaFileEntity,
  MediaFileInterface,
} from '@common/domain/entities';
import { DanceStyleEnum, SpecialtyEnum } from '@users/domain/enums';

export interface PersonalProfileInterface {
  headline?: string | null;
  biography?: string | null;
  alias?: string | null;
  avatar?: MediaFileInterface | null;
  address: AddressInterface;
  availableToTravel: boolean;
  ownTransportation: boolean;
  specialties: SpecialtyEnum[];
  danceStyles: DanceStyleEnum[];
  createdAt?: Date;
  updatedAt?: Date;
}

export type CreatePersonalProfileType = Omit<
  PersonalProfileInterface,
  | 'availableToTravel'
  | 'ownTransportation'
  | 'specialties'
  | 'danceStyles'
  | 'createdAt'
  | 'updatedAt'
> & {
  availableToTravel?: boolean;
  ownTransportation?: boolean;
  specialties?: SpecialtyEnum[];
  danceStyles?: DanceStyleEnum[];
};

export class PersonalProfileEntity {
  private readonly _headline: string | null;
  private readonly _biography: string | null;
  private readonly _alias: string | null;
  private readonly _avatar: MediaFileEntity | null;
  private readonly _address: AddressEntity;
  private readonly _availableToTravel: boolean;
  private readonly _ownTransportation: boolean;
  private readonly _specialties: SpecialtyEnum[];
  private readonly _danceStyles: DanceStyleEnum[];
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  constructor(personalProfile: PersonalProfileInterface) {
    this._headline = personalProfile.headline ?? null;
    this._biography = personalProfile.biography ?? null;
    this._alias = personalProfile.alias ?? null;
    this._avatar = personalProfile.avatar
      ? personalProfile.avatar instanceof MediaFileEntity
        ? personalProfile.avatar
        : new MediaFileEntity(personalProfile.avatar)
      : null;
    this._address =
      personalProfile.address instanceof AddressEntity
        ? personalProfile.address
        : new AddressEntity(personalProfile.address);
    this._availableToTravel = personalProfile.availableToTravel;
    this._ownTransportation = personalProfile.ownTransportation;
    this._specialties = personalProfile.specialties;
    this._danceStyles = personalProfile.danceStyles;
    this._createdAt = personalProfile.createdAt ?? new Date();
    this._updatedAt = personalProfile.updatedAt ?? new Date();
  }

  //? Getters
  public get headline(): string | null {
    return this._headline;
  }

  public get biography(): string | null {
    return this._biography;
  }

  public get alias(): string | null {
    return this._alias;
  }

  public get avatar(): MediaFileEntity | null {
    return this._avatar;
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

  public get specialties(): SpecialtyEnum[] {
    return this._specialties;
  }

  public get danceStyles(): DanceStyleEnum[] {
    return this._danceStyles;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  //? Methods static
  public static create(personalProfile: CreatePersonalProfileType): PersonalProfileEntity {
    return new PersonalProfileEntity({
      headline: personalProfile.headline ?? null,
      biography: personalProfile.biography ?? null,
      alias: personalProfile.alias ?? null,
      avatar: personalProfile.avatar ? MediaFileEntity.create(personalProfile.avatar) : null,
      address: AddressEntity.create(personalProfile.address),
      availableToTravel: personalProfile.availableToTravel ?? false,
      ownTransportation: personalProfile.ownTransportation ?? false,
      specialties: personalProfile.specialties ?? [],
      danceStyles: personalProfile.danceStyles ?? [],
    });
  }
}
