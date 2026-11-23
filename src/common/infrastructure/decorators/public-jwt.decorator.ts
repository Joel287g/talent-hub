//? Imports de codigo
import { SetMetadata } from '@nestjs/common';

//? Imports de usuario
import { GuardsDecorators } from '@common/domain/enums';

//* Marca un controlador o endpoint como público: el JwtAuthGuard global omite la validación del token
export const PublicJwt = () => SetMetadata(GuardsDecorators.IS_PUBLIC_JWT, true);
