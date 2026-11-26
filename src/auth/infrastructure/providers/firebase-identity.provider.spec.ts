//? Imports de codigo
import { Auth, AuthErrorCode, DecodedIdToken, FirebaseAuthError } from 'firebase-admin/auth';

//? Imports de usuario
import { BaseException } from '@common/domain/exceptions';

import { SignInProviderEnum } from '@auth/domain/enums';
import { AuthErrorsEnum } from '@auth/domain/exceptions/enums';
import { FirebaseIdentityProvider } from '@auth/infrastructure/providers/firebase-identity.provider';

//? Construye un DecodedIdToken mínimo para las pruebas
const buildDecodedToken = (overrides: Partial<DecodedIdToken> = {}, signInProvider = 'password') =>
  ({
    uid: 'firebase-uid-123',
    email: 'Valeria@Test.com',
    email_verified: true,
    firebase: { sign_in_provider: signInProvider, identities: {} },
    ...overrides,
  }) as DecodedIdToken;

const buildFirebaseError = (code: AuthErrorCode) =>
  new FirebaseAuthError({ code, message: `Firebase error ${code}` });

//? Captura la excepción lanzada para comprobar su contenido
const catchError = async (promise: Promise<unknown>): Promise<BaseException> => {
  try {
    await promise;
  } catch (error) {
    return error as BaseException;
  }

  throw new Error('Se esperaba una excepción');
};

describe(FirebaseIdentityProvider.name, () => {
  let verifyIdToken: ReturnType<typeof vi.fn>;
  let provider: FirebaseIdentityProvider;

  beforeEach(() => {
    verifyIdToken = vi.fn();
    provider = new FirebaseIdentityProvider({ verifyIdToken } as unknown as Auth);
  });

  describe('token válido', () => {
    it('devuelve la identidad de correo/contraseña con el email en minúsculas', async () => {
      verifyIdToken.mockResolvedValue(buildDecodedToken());

      await expect(provider.verifyToken('id-token')).resolves.toEqual({
        uid: 'firebase-uid-123',
        email: 'valeria@test.com',
        emailVerified: true,
        provider: SignInProviderEnum.EMAIL_PASSWORD,
      });
    });

    it('verifica el token comprobando la revocación', async () => {
      verifyIdToken.mockResolvedValue(buildDecodedToken());

      await provider.verifyToken('id-token');

      expect(verifyIdToken).toHaveBeenCalledWith('id-token', true);
    });

    it('identifica el inicio de sesión con Google', async () => {
      verifyIdToken.mockResolvedValue(buildDecodedToken({}, 'google.com'));

      const IDENTITY = await provider.verifyToken('id-token');

      expect(IDENTITY.provider).toBe(SignInProviderEnum.GOOGLE);
    });

    it('trata como no verificado un email sin email_verified', async () => {
      verifyIdToken.mockResolvedValue(buildDecodedToken({ email_verified: undefined }));

      const IDENTITY = await provider.verifyToken('id-token');

      expect(IDENTITY.emailVerified).toBe(false);
    });
  });

  describe('token rechazado antes de llamar a Firebase', () => {
    it.each(['', '   ', undefined as unknown as string])(
      'rechaza el token vacío (%j) con 401',
      async (token) => {
        const ERROR = await catchError(provider.verifyToken(token));

        expect(ERROR.message).toBe(AuthErrorsEnum.INVALID_IDENTITY_TOKEN);
        expect(ERROR.statusCode).toBe(401);
        expect(ERROR.code).toBe('AUTH-INF-PRO-FIRE_IDEN-001');
        expect(verifyIdToken).not.toHaveBeenCalled();
      },
    );
  });

  describe('token rechazado por Firebase', () => {
    it.each([
      [AuthErrorCode.INVALID_ARGUMENT, 'AUTH-INF-PRO-FIRE_IDEN-002'],
      [AuthErrorCode.INVALID_ID_TOKEN, 'AUTH-INF-PRO-FIRE_IDEN-002'],
      [AuthErrorCode.ID_TOKEN_EXPIRED, 'AUTH-INF-PRO-FIRE_IDEN-003'],
      [AuthErrorCode.ID_TOKEN_REVOKED, 'AUTH-INF-PRO-FIRE_IDEN-004'],
      [AuthErrorCode.USER_DISABLED, 'AUTH-INF-PRO-FIRE_IDEN-005'],
      [AuthErrorCode.USER_NOT_FOUND, 'AUTH-INF-PRO-FIRE_IDEN-006'],
    ])('traduce %s a 401 con el código %s', async (firebaseCode, expectedCode) => {
      const FIREBASE_ERROR = buildFirebaseError(firebaseCode);
      verifyIdToken.mockRejectedValue(FIREBASE_ERROR);

      const ERROR = await catchError(provider.verifyToken('id-token'));

      expect(ERROR.message).toBe(AuthErrorsEnum.INVALID_IDENTITY_TOKEN);
      expect(ERROR.statusCode).toBe(401);
      expect(ERROR.code).toBe(expectedCode);
      expect(ERROR.cause).toBe(FIREBASE_ERROR);
    });
  });

  describe('identidad no admitida', () => {
    it.each(['anonymous', 'custom', 'phone'])(
      'rechaza el método de inicio de sesión "%s" con 403',
      async (signInProvider) => {
        verifyIdToken.mockResolvedValue(buildDecodedToken({}, signInProvider));

        const ERROR = await catchError(provider.verifyToken('id-token'));

        expect(ERROR.message).toBe(AuthErrorsEnum.UNSUPPORTED_SIGN_IN_PROVIDER);
        expect(ERROR.statusCode).toBe(403);
        expect(ERROR.code).toBe('AUTH-INF-PRO-FIRE_IDEN-007');
      },
    );

    it('rechaza el token sin email con 401', async () => {
      verifyIdToken.mockResolvedValue(buildDecodedToken({ email: undefined }));

      const ERROR = await catchError(provider.verifyToken('id-token'));

      expect(ERROR.message).toBe(AuthErrorsEnum.INVALID_IDENTITY_TOKEN);
      expect(ERROR.statusCode).toBe(401);
      expect(ERROR.code).toBe('AUTH-INF-PRO-FIRE_IDEN-008');
    });
  });

  describe('fallo del proveedor', () => {
    it.each([
      ['un error interno de Firebase', buildFirebaseError(AuthErrorCode.INTERNAL_ERROR)],
      [
        'falta de permisos de la cuenta de servicio',
        buildFirebaseError(AuthErrorCode.INSUFFICIENT_PERMISSION),
      ],
      ['un error de red', new Error('getaddrinfo ENOTFOUND www.googleapis.com')],
    ])('responde 503 ante %s', async (_, failure) => {
      verifyIdToken.mockRejectedValue(failure);

      const ERROR = await catchError(provider.verifyToken('id-token'));

      expect(ERROR.message).toBe(AuthErrorsEnum.IDENTITY_PROVIDER_UNAVAILABLE);
      expect(ERROR.statusCode).toBe(503);
      expect(ERROR.code).toBe('AUTH-INF-PRO-FIRE_IDEN-009');
      expect(ERROR.cause).toBe(failure);
    });
  });
});
