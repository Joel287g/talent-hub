//? Imports de codigo
import { registerDecorator, ValidationArguments } from 'class-validator';

const VALIDATOR_NAME = 'isAbsentWhen';

/**
 * Exige que la propiedad no se informe (`undefined` o `null`) cuando otra propiedad del mismo DTO
 * tiene un valor concreto. Ej: `businessProfileId` prohibido si `activeProfileType` es PERSONAL.
 *
 * @param {string} property - Propiedad del DTO que se compara.
 * @param {unknown} value - Valor de `property` con el que esta propiedad debe omitirse.
 */
export const IsAbsentWhen =
  <TDto>(property: keyof TDto & string, value: unknown): PropertyDecorator =>
  (target, propertyName) =>
    registerDecorator({
      name: VALIDATOR_NAME,
      target: target.constructor,
      propertyName: propertyName as string,
      constraints: [property, value],
      options: {
        message: ({ property: current, constraints }: ValidationArguments) =>
          `${current} must be omitted when ${constraints[0]} is ${String(constraints[1])}`,
      },
      validator: {
        validate: (current: unknown, { object, constraints }: ValidationArguments) =>
          object[constraints[0]] !== constraints[1] || current === undefined || current === null,
      },
    });
