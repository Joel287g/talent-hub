//? Imports de codigo
import { Transform } from 'class-transformer';

/**
 * Elimina los espacios de los extremos antes de validar el DTO.
 * Los schemas de Mongoose también recortan (`trim`): sin este decorador, un texto con solo espacios
 * superaría `IsNotEmpty` y fallaría después al persistir.
 */
export const Trim = (): PropertyDecorator =>
  Transform(({ value }) => (typeof value === 'string' ? value.trim() : value));
