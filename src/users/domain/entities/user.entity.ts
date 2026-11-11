//? Imports de usuario
import { UserStatus } from '@users/domain/enums';

import { CreateUserDto } from '@users/application/dtos';

export interface UserInterface {
  id?: string | null;
  uid: string;
  name: string;
  lastName: string;
  status: UserStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UserEntity {
  private readonly _id: string | null;
  private readonly _uid: string;
  private readonly _name: string;
  private readonly _lastName: string;
  private readonly _status: UserStatus;
  private readonly _createdAt?: Date;
  private readonly _updatedAt?: Date;

  constructor(user: UserInterface) {
    this._id = user.id;
    this._uid = user.uid;
    this._name = user.name;
    this._lastName = user.lastName;
    this._status = user.status;
    this._createdAt = user.createdAt ?? new Date();
    this._updatedAt = user.updatedAt ?? new Date();
  }

  //? Getters
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
  public get status(): UserStatus {
    return this._status;
  }
  public get createdAt(): Date | undefined {
    return this._createdAt;
  }
  public get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  //? Methods static
  public static create(user: CreateUserDto): UserEntity {
    return new UserEntity({
      uid: user.uid,
      name: user.name,
      lastName: user.lastName,
      status: UserStatus.ACTIVE,
    });
  }
}
