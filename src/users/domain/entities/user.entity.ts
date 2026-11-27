//? Imports de usuario
import { SystemRoleEnum } from '@common/domain/enums';
import { PhoneEntity, PhoneInterface } from '@common/domain/entities';

import {
  BusinessProfileEntity,
  BusinessProfileInterface,
  CreateBusinessProfileType,
} from '@users/domain/entities/business-profile.entity';
import {
  CreatePersonalProfileType,
  PersonalProfileEntity,
  PersonalProfileInterface,
  UpdatePersonalProfileType,
} from '@users/domain/entities/personal-profile.entity';
import { ProfileTypeEnum, UserStatus } from '@users/domain/enums';
import { UserErrors } from '@users/domain/exceptions';

export interface UserInterface {
  id?: string | null;
  uid: string;
  name: string;
  lastName: string;
  email: string;
  phone?: PhoneInterface | null;
  activeProfileType: ProfileTypeEnum;
  activeBusinessProfileId?: string | null;
  personalProfile?: PersonalProfileInterface | null;
  businessProfiles?: BusinessProfileInterface[];
  role: SystemRoleEnum;
  status: UserStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

//* Datos de la identidad del usuario: nunca llegan en el body, salen del token verificado
export type UserIdentityType = Pick<UserInterface, 'uid' | 'email'>;

export type CreateUserType = Omit<
  UserInterface,
  | 'id' //\
  | 'activeBusinessProfileId'
  | 'personalProfile'
  | 'businessProfiles'
  | 'role'
  | 'status'
  | 'createdAt'
  | 'updatedAt'
> & {
  personalProfile?: CreatePersonalProfileType | null;
  businessProfiles?: CreateBusinessProfileType[];
};

export class UserEntity {
  private readonly _id: string | null;
  private readonly _uid: string;
  private readonly _name: string;
  private readonly _lastName: string;
  private readonly _email: string;
  private readonly _phone: PhoneEntity | null;
  private _activeProfileType: ProfileTypeEnum;
  private _activeBusinessProfileId: string | null;
  private _personalProfile: PersonalProfileEntity | null;
  private readonly _businessProfiles: BusinessProfileEntity[];
  private readonly _role: SystemRoleEnum;
  private readonly _status: UserStatus;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  //#region Constructor
  constructor(user: UserInterface) {
    this._id = user.id ?? null;
    this._uid = user.uid;
    this._name = user.name;
    this._lastName = user.lastName;
    this._email = user.email;
    this._phone = user.phone
      ? user.phone instanceof PhoneEntity
        ? user.phone
        : new PhoneEntity(user.phone)
      : null;
    this._activeProfileType = user.activeProfileType;
    this._activeBusinessProfileId = user.activeBusinessProfileId ?? null;
    this._personalProfile = user.personalProfile
      ? user.personalProfile instanceof PersonalProfileEntity
        ? user.personalProfile
        : new PersonalProfileEntity(user.personalProfile)
      : null;
    this._businessProfiles = (user.businessProfiles ?? []).map((profile) =>
      profile instanceof BusinessProfileEntity ? profile : new BusinessProfileEntity(profile),
    );
    this._role = user.role;
    this._status = user.status;
    this._createdAt = user.createdAt ?? new Date();
    this._updatedAt = user.updatedAt ?? new Date();
  }
  //#endregion

  //#region Getters
  public get id(): string | null {
    return this._id;
  }

  public get uid(): string {
    return this._uid;
  }

  public get name(): string {
    return this._name;
  }

  public get lastName(): string {
    return this._lastName;
  }

  public get email(): string {
    return this._email;
  }

  public get phone(): PhoneEntity | null {
    return this._phone;
  }

  public get activeProfileType(): ProfileTypeEnum {
    return this._activeProfileType;
  }

  public get activeBusinessProfileId(): string | null {
    return this.activeBusinessProfile?.id ?? null;
  }

  public get activeBusinessProfile(): BusinessProfileEntity | null {
    const STORED = this._businessProfiles.find(
      (profile) => profile.id !== null && profile.id === this._activeBusinessProfileId,
    );

    return STORED ?? this._businessProfiles[0] ?? null;
  }

  public get personalProfile(): PersonalProfileEntity | null {
    return this._personalProfile;
  }

  public get businessProfiles(): BusinessProfileEntity[] {
    return this._businessProfiles;
  }

  public get role(): SystemRoleEnum {
    return this._role;
  }

  public get status(): UserStatus {
    return this._status;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }
  //#endregion

  //#region Methods
  public isActive(): boolean {
    return this._status === UserStatus.ACTIVE;
  }

  public hasPersonalProfile(): boolean {
    return this._personalProfile !== null;
  }

  /**
   * Añade el perfil personal a un usuario que se registró solo con su cuenta de empresa.
   *
   * @param {CreatePersonalProfileType} profile - Datos del perfil personal.
   * @returns {PersonalProfileEntity} Perfil personal creado y asignado al usuario.
   * @throws {BaseException} 409 si el usuario ya tiene un perfil personal.
   */
  public addPersonalProfile(profile: CreatePersonalProfileType): PersonalProfileEntity {
    if (this.hasPersonalProfile()) {
      throw UserErrors.personalProfileAlreadyExists('USER-DOM-ENT-USER-003');
    }

    this._personalProfile = PersonalProfileEntity.create(profile);
    return this._personalProfile;
  }

  /**
   * Edita parcialmente el perfil personal del usuario.
   *
   * @param {UpdatePersonalProfileType} changes - Campos a cambiar; los omitidos se conservan.
   * @returns {PersonalProfileEntity} Perfil personal actualizado.
   * @throws {BaseException} 400 si no se indica ningún campo; 404 si el usuario no tiene perfil personal.
   */
  public updatePersonalProfile(changes: UpdatePersonalProfileType): PersonalProfileEntity {
    if (!Object.values(changes).some((value) => value !== undefined)) {
      throw UserErrors.nothingToUpdate('USER-DOM-ENT-USER-009');
    }

    if (!this.hasPersonalProfile()) {
      throw UserErrors.personalProfileNotFound('USER-DOM-ENT-USER-010');
    }

    this._personalProfile = this._personalProfile.update(changes);
    return this._personalProfile;
  }

  /**
   * Cambia el perfil activo del usuario (personal o una de sus empresas).
   *
   * @param {ProfileTypeEnum} profileType - Perfil que pasa a estar activo.
   * @param {string} [businessProfileId] - Empresa a activar. Si se omite, la última activa o la primera.
   *   Prohibido con PERSONAL: cambiar al perfil personal no cambia la empresa activa.
   * @throws {BaseException} 400 si se indica una empresa al activar el perfil personal.
   * @throws {BaseException} 404 si el usuario no tiene el perfil personal o la empresa indicada.
   * @throws {BaseException} 409 si el perfil (o la empresa) ya está activo.
   */
  public switchActiveProfile(
    profileType: ProfileTypeEnum,
    businessProfileId?: string | null,
  ): void {
    if (profileType === ProfileTypeEnum.PERSONAL) {
      //* La empresa activa se conserva para volver a ella al cambiar de nuevo a BUSINESS
      if (businessProfileId) {
        throw UserErrors.invalidProfileSwitch('USER-DOM-ENT-USER-006');
      }

      //* Invariante: solo se puede activar un perfil que el usuario tenga
      if (!this.hasPersonalProfile()) {
        throw UserErrors.personalProfileNotFound('USER-DOM-ENT-USER-004');
      }

      if (this._activeProfileType === ProfileTypeEnum.PERSONAL) {
        throw UserErrors.profileAlreadyActive('USER-DOM-ENT-USER-007');
      }

      this._activeProfileType = ProfileTypeEnum.PERSONAL;
      return;
    }

    const BUSINESS_PROFILE = businessProfileId
      ? this._businessProfiles.find((profile) => profile.id === businessProfileId)
      : this.activeBusinessProfile;

    if (!BUSINESS_PROFILE) {
      throw UserErrors.businessProfileNotFound('USER-DOM-ENT-USER-005');
    }

    //* Entre empresas sí se puede cambiar: solo se rechaza la misma empresa que ya está activa
    if (
      this._activeProfileType === ProfileTypeEnum.BUSINESS &&
      BUSINESS_PROFILE.id === this.activeBusinessProfileId
    ) {
      throw UserErrors.profileAlreadyActive('USER-DOM-ENT-USER-008');
    }

    this._activeProfileType = ProfileTypeEnum.BUSINESS;
    this._activeBusinessProfileId = BUSINESS_PROFILE.id;
  }

  /**
   * Añade una cuenta de empresa al usuario (0..N empresas por usuario).
   *
   * @param {CreateBusinessProfileType} profile - Datos de la cuenta de empresa.
   * @returns {BusinessProfileEntity} Cuenta de empresa creada y asignada al usuario.
   */
  public addBusinessProfile(profile: CreateBusinessProfileType): BusinessProfileEntity {
    const BUSINESS_PROFILE = BusinessProfileEntity.create(profile);

    this._businessProfiles.push(BUSINESS_PROFILE);
    return BUSINESS_PROFILE;
  }
  //#endregion

  //#region Methods static
  public static create(user: CreateUserType): UserEntity {
    const PERSONAL_PROFILE = user.personalProfile
      ? PersonalProfileEntity.create(user.personalProfile)
      : null;

    const BUSINESS_PROFILES = (user.businessProfiles ?? []).map((profile) =>
      BusinessProfileEntity.create(profile),
    );

    //* Invariante: Ninguna cuenta nace sin el perfil correspondiente a su contexto inicial
    if (user.activeProfileType === ProfileTypeEnum.PERSONAL && !PERSONAL_PROFILE) {
      throw UserErrors.invalidInitialProfile('USER-DOM-ENT-USER-001');
    }

    if (user.activeProfileType === ProfileTypeEnum.BUSINESS && BUSINESS_PROFILES.length === 0) {
      throw UserErrors.invalidInitialProfile('USER-DOM-ENT-USER-002');
    }

    return new UserEntity({
      uid: user.uid,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone ? PhoneEntity.create(user.phone) : null,
      activeProfileType: user.activeProfileType,
      personalProfile: PERSONAL_PROFILE,
      businessProfiles: BUSINESS_PROFILES,
      role: SystemRoleEnum.USER,
      status: UserStatus.ACTIVE,
    });
  }
  //#endregion
}
