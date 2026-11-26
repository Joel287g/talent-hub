//? Imports de codigo
import { Matches } from 'class-validator';

//* Sin `<`, `>` ni caracteres de control o invisibles (categoría Unicode `C`, ej. U+200B)
const SINGLE_LINE_TEXT = /^[^<>\p{C}]*$/u;

//* Igual que el anterior, pero admite saltos de línea y tabuladores
const MULTI_LINE_TEXT = /^(?:[^<>\p{C}]|[\n\r\t])*$/u;

interface SafeTextOptions {
  multiline?: boolean;
}

/**
 * Rechaza los textos libres con caracteres invisibles o de marcado.
 * No limita el alfabeto: hay nombres legítimos con tildes, apóstrofos, guiones u otros alfabetos.
 */
export const IsSafeText = ({ multiline = false }: SafeTextOptions = {}): PropertyDecorator =>
  Matches(multiline ? MULTI_LINE_TEXT : SINGLE_LINE_TEXT, {
    message: ({ property }) => `${property} contains forbidden characters`,
  });
