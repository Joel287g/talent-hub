//? Imports de codigo
import { Transform } from 'class-transformer';

interface TrimOptions {
  //* Convierte el texto vacío en `null`, para que un campo opcional vacío equivalga a no informarlo
  emptyToNull?: boolean;
}

/**
 * Elimina los espacios de los extremos antes de validar el DTO.
 * Los schemas de Mongoose también recortan (`trim`): sin este decorador, un texto con solo espacios
 * superaría `IsNotEmpty` y fallaría después al persistir.
 */
export const Trim = ({ emptyToNull = false }: TrimOptions = {}): PropertyDecorator =>
  Transform(({ value }) => {
    if (typeof value !== 'string') return value;

    const TRIMMED = value.trim();

    return emptyToNull && TRIMMED === '' ? null : TRIMMED;
  });
