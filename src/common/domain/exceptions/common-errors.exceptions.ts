//? Imports de usuario
import { BaseErrors } from '@common/domain/exceptions/base-errors.abstract';

//* Catálogo de errores transversales (sin módulo de negocio propio). Hereda todos los métodos de BaseErrors
class CommonErrorsFactory extends BaseErrors {}

//* Solo se exporta la instancia, nunca la clase
export const CommonErrors = new CommonErrorsFactory();
