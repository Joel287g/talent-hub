//? Imports de codigo
import { Inject, Injectable } from '@nestjs/common';

//? Imports de usuario
import { CreateUserDto } from '@users/application/dtos';
import { CreateUserService } from '@users/application/services';

import { AuthService } from '@auth/application/services/auth.service';
import { AuthSession } from '@auth/domain/interfaces';
import { IDENTITY_PROVIDER, IdentityProvider } from '@auth/domain/ports';

@Injectable()
export class RegisterService {
  constructor(
    @Inject(IDENTITY_PROVIDER)
    private readonly identityProvider: IdentityProvider,
    private readonly createUserService: CreateUserService,
    private readonly authService: AuthService,
  ) {}

  /**
   * Registra al usuario con la identidad del token verificado y le abre una sesión (JWT).
   *
   * @param {string} identityToken - Token del proveedor de identidad (ej. ID token de Firebase).
   * @param {CreateUserDto} payload - Datos del onboarding (sin `uid` ni `email`).
   * @returns {Promise<AuthSession>} Sesión con el JWT del usuario recién creado.
   * @throws {BaseException} 401/403/503 si el token no es válido o 409 si el usuario, su contacto,
   * su alias o alguna de sus empresas ya existen.
   */
  public async execute(identityToken: string, payload: CreateUserDto): Promise<AuthSession> {
    const IDENTITY = await this.identityProvider.verifyToken(identityToken);

    //TODO: Cuando exista la verificación de correo, crear la cuenta como pendiente si !IDENTITY.emailVerified
    const USER = await this.createUserService.execute(IDENTITY, payload);

    return { accessToken: this.authService.sign(USER) };
  }
}
