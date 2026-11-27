//? Imports de codigo
import { spawnSync } from 'child_process';
import fs from 'fs';
import { parseArgs } from 'util';

/**
 * Obtiene un JWT del backend sin pasar por el frontend (solo para desarrollo):
 *
 * 1. Inicia sesión en Firebase Authentication con correo y contraseña (API REST).
 * 2. Canjea el ID token de Firebase por el JWT del backend en `POST /api/auth/login`.
 * 3. Muestra el `accessToken` y lo copia al portapapeles para pegarlo en Swagger (Authorize).
 *
 * Si el usuario aún no está registrado en el backend (404), muestra el ID token de Firebase
 * para usarlo en la cabecera `firebase-token` de `POST /api/auth/register`.
 *
 * Uso:
 *   npm run auth:token -- <email> <password>
 *   npm run auth:token -- <email> <password> --sign-up   (crea antes la cuenta en Firebase)
 *   npm run auth:token                                    (usa FIREBASE_TEST_EMAIL / FIREBASE_TEST_PASSWORD)
 */

//* Constantes de configuración
const NODE_ENV: string = process.env.NODE_ENV ?? 'development';
const ENV_FILE: string = `.env.${NODE_ENV}`;
const FIREBASE_TOKEN_HEADER: string = 'firebase-token';

//! Este script nunca debe usarse contra producción
if (NODE_ENV === 'production') {
  console.error('❌ auth:token es solo para desarrollo.');
  process.exit(1);
}

if (fs.existsSync(ENV_FILE)) process.loadEnvFile(ENV_FILE);

const { values: OPTIONS, positionals: POSITIONALS } = parseArgs({
  allowPositionals: true,
  options: {
    'sign-up': { type: 'boolean', default: false },
    'no-copy': { type: 'boolean', default: false },
  },
});

const EMAIL: string | undefined = POSITIONALS[0] ?? process.env.FIREBASE_TEST_EMAIL;
const PASSWORD: string | undefined = POSITIONALS[1] ?? process.env.FIREBASE_TEST_PASSWORD;
const EMULATOR_HOST: string | undefined = process.env.FIREBASE_AUTH_EMULATOR_HOST;

//* Con el emulador no hace falta la Web API key real
const WEB_API_KEY: string | undefined = EMULATOR_HOST ? 'fake' : process.env.FIREBASE_WEB_API_KEY;
const IDENTITY_TOOLKIT_URL: string = EMULATOR_HOST
  ? `http://${EMULATOR_HOST}/identitytoolkit.googleapis.com/v1`
  : 'https://identitytoolkit.googleapis.com/v1';
const BACKEND_URL: string = `http://localhost:${process.env.PORT}/api`;

//? Respuestas JSON de Firebase (Identity Toolkit) y del backend
interface FirebaseAuthResponse {
  idToken?: string;
  error?: { message?: string };
}

interface BackendLoginResponse {
  accessToken?: string;
  message?: string;
}

function fail(message: string): never {
  console.error(`❌ ${message}`);
  process.exit(1);
}

//? Copia el texto al portapapeles del sistema; si no hay herramienta disponible, no hace nada
function copyToClipboard(text: string): boolean {
  const COMMANDS: Record<string, [string, string[]]> = {
    win32: ['clip', []],
    darwin: ['pbcopy', []],
    linux: ['xclip', ['-selection', 'clipboard']],
  };
  const COMMAND = COMMANDS[process.platform];

  if (!COMMAND) return false;

  const RESULT = spawnSync(COMMAND[0], COMMAND[1], { input: text });
  return RESULT.status === 0;
}

async function getFirebaseIdToken(signUp: boolean): Promise<string> {
  const ENDPOINT = signUp ? 'accounts:signUp' : 'accounts:signInWithPassword';
  const RESPONSE = await fetch(`${IDENTITY_TOOLKIT_URL}/${ENDPOINT}?key=${WEB_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD, returnSecureToken: true }),
  });
  const BODY = (await RESPONSE.json()) as FirebaseAuthResponse;

  //* Firebase devuelve el motivo en error.message (ej. INVALID_LOGIN_CREDENTIALS, EMAIL_EXISTS)
  if (!RESPONSE.ok) fail(`Firebase (${ENDPOINT}): ${BODY?.error?.message ?? RESPONSE.status}`);

  return BODY.idToken;
}

async function main(): Promise<void> {
  if (!EMAIL || !PASSWORD) {
    fail('Uso: npm run auth:token -- <email> <password> [--sign-up] [--no-copy]');
  }

  if (!WEB_API_KEY) {
    fail(
      `Falta FIREBASE_WEB_API_KEY en ${ENV_FILE} (Firebase Console ➔ Configuración del proyecto ➔ General).`,
    );
  }

  if (!process.env.PORT) fail(`Falta PORT en ${ENV_FILE}.`);

  const FIREBASE_ID_TOKEN = await getFirebaseIdToken(OPTIONS['sign-up']);
  console.info(`✅ Sesión iniciada en Firebase${EMULATOR_HOST ? ' (emulador)' : ''}: ${EMAIL}`);

  let response: Response;

  try {
    response = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: { [FIREBASE_TOKEN_HEADER]: FIREBASE_ID_TOKEN },
    });
  } catch {
    fail(
      `No se pudo conectar con el backend en ${BACKEND_URL}. ¿Está arrancado (npm run start:dev)?`,
    );
  }

  const BODY = (await response.json()) as BackendLoginResponse;

  //* Usuario de Firebase sin registrar en el backend: el ID token sirve para POST /auth/register
  if (response.status === 404) {
    console.warn('\n⚠️  El usuario no está registrado en el backend (404 USER-NOT_FOUND).');
    console.info(
      `   Usa este ID token en la cabecera "${FIREBASE_TOKEN_HEADER}" de POST /api/auth/register:\n`,
    );
    console.info(FIREBASE_ID_TOKEN);

    if (!OPTIONS['no-copy'] && copyToClipboard(FIREBASE_ID_TOKEN)) {
      console.info('\n📋 ID token de Firebase copiado al portapapeles (válido 1 hora).');
    }
    return;
  }

  if (!response.ok) {
    fail(`Backend (${response.status}): ${BODY?.message ?? 'error desconocido'}`);
  }

  console.info('\n🔑 accessToken (cabecera "authorization", sin Bearer):\n');
  console.info(BODY.accessToken);

  if (!OPTIONS['no-copy'] && copyToClipboard(BODY.accessToken)) {
    console.info('\n📋 Copiado al portapapeles: pégalo en Swagger ➔ Authorize.');
  }
}

main().catch((error: unknown) => fail(error instanceof Error ? error.message : String(error)));
