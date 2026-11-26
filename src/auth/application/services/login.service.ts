//? Imports de codigo
import { Inject, Injectable } from '@nestjs/common';

//? Imports de usuario
import { FindUserByUidUseCase } from '@users/application/use-cases';
import { UserErrors } from '@users/domain/exceptions';

import { AuthService } from '@auth/application/services/auth.service';
import { AuthErrors } from '@auth/domain/exceptions';
import { AuthSession } from '@auth/domain/interfaces';
import { IDENTITY_PROVIDER, IdentityProvider } from '@auth/domain/ports';

@Injectable()
export class LoginService {
  constructor(
    @Inject(IDENTITY_PROVIDER)
    private readonly identityProvider: IdentityProvider,
    private readonly findUserByUidUseCase: FindUserByUidUseCase,
    private readonly authService: AuthService,
  ) {}

  /**
   * Canjea el token del proveedor de identidad por una sesión (JWT) del backend.
   *
   * @param {string} identityToken - Token del proveedor de identidad (ej. ID token de Firebase).
   * @returns {Promise<AuthSession>} Sesión con el JWT del usuario.
   * @throws {BaseException} 401/403/503 si el token no es válido, 404 si el usuario no ha completado
   * el registro (el cliente debe enviarlo al onboarding) o 401 si su cuenta está inactiva.
   */
  public async execute(identityToken: string): Promise<AuthSession> {
    const IDENTITY = await this.identityProvider.verifyToken(identityToken);
    const USER = await this.findUserByUidUseCase.execute(IDENTITY.uid, false);

    if (!USER) {
      throw UserErrors.notFound('AUTH-APP-SER-LOGI-001');
    }

    if (!USER.isActive()) {
      throw AuthErrors.inactiveUser('AUTH-APP-SER-LOGI-002');
    }

    return { accessToken: this.authService.sign(USER) };
  }
}
