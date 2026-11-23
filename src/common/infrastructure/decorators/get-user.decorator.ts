//? Imports de codigo
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

//? Imports de usuario
import { CommonErrors } from '@common/domain/exceptions';

/**
 * Extrae del `request` el usuario autenticado que la `JwtStrategy` adjunta tras validar el token.
 *
 * - `@GetUser()` ➔ Devuelve el usuario completo.
 * - `@GetUser('id')` ➔ Devuelve únicamente el valor de la propiedad indicada.
 * - `@GetUser(['id', 'email'])` ➔ Devuelve un objeto con las propiedades indicadas.
 *
 * @throws {BaseException} 500 si se usa en una ruta donde no se ejecutó la validación del JWT.
 */
export const GetUser = createParamDecorator(
  (data: string | string[] | undefined, ctx: ExecutionContext) => {
    const REQUEST = ctx.switchToHttp().getRequest();
    const USER = REQUEST.user;

    //! Si no hay usuario, el decorador se está usando en una ruta pública (@PublicJwt)
    if (!USER) {
      throw CommonErrors.internalServerErrorException('COMM-INF-DEC-GET_USER-001');
    }

    const PROPERTIES = (Array.isArray(data) ? data : [data]).filter(
      (property): property is string => property !== undefined,
    );

    if (PROPERTIES.length === 0) return USER;

    if (PROPERTIES.length === 1) return USER[PROPERTIES[0]];

    return Object.fromEntries(PROPERTIES.map((property) => [property, USER[property]]));
  },
);
