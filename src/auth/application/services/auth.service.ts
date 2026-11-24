//? Imports de codigo
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

//? Imports de usuario
import { JwtPayload } from '@auth/domain/interfaces';

import { UserEntity } from '@users/domain/entities';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  //? Algoritmo, expiración y audiencia se heredan de JwtConfigService (signOptions)
  public sign(user: UserEntity): string {
    const PAYLOAD: JwtPayload = {
      id: user.id,
    };

    return this.jwtService.sign(PAYLOAD);
  }
}
