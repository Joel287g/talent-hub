const REDACTED = '[REDACTED]';

//? Claves cuyo valor nunca se registra (sin guiones, guiones bajos ni mayúsculas)
const SENSITIVE_KEYS = [
  'auth',
  'authorization',
  'proxyauthorization',
  'apikey',
  'xapikey',
  'cookie',
  'setcookie',
  'token',
  'accesstoken',
  'refreshtoken',
  'idtoken',
  'password',
  'secret',
];

//? Cualquier JWT dentro de un texto (ej. en la URL o en el mensaje de un error)
const JWT_PATTERN = /eyJ[\w-]+\.[\w-]+\.[\w-]*/g;

/**
 * Devuelve una copia del valor con los datos sensibles ocultos. Nunca modifica el original.
 * Si el valor no se puede serializar devuelve `null`, para no interrumpir la petición.
 */
export function redactSensitive<T>(value: T): T | null {
  try {
    const COPY = JSON.stringify(value ?? null, (key, data) => {
      const IS_SENSITIVE = SENSITIVE_KEYS.includes(key.replace(/[_-]/g, '').toLowerCase());

      if (IS_SENSITIVE && data) return REDACTED;

      return typeof data === 'string' ? data.replace(JWT_PATTERN, REDACTED) : data;
    });

    return JSON.parse(COPY);
  } catch {
    return null;
  }
}
