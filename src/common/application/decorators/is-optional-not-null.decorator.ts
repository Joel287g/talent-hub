//? Imports de codigo
import { ValidateIf } from 'class-validator';

/**
 * Permite omitir la propiedad (`undefined` ➔ no se valida), pero valida cualquier otro valor, incluido `null`.
 * Para los campos obligatorios de una edición parcial: omitirlos no cambia nada, pero no se pueden borrar.
 *
 * //! A diferencia de `@IsOptional()`, que trata `null` igual que `undefined` y lo deja sin validar.
 */
export const IsOptionalNotNull = (): PropertyDecorator =>
  ValidateIf((_object: object, value: unknown) => value !== undefined);
