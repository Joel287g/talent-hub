//? Imports de codigo
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import { App, AppOptions, cert, getApps, initializeApp } from 'firebase-admin/app';
import { Auth, getAuth } from 'firebase-admin/auth';

//? Imports de usuario
import { environmentsConfig } from '@configuration/env';

//* Token de inyección de la instancia de Firebase Auth (Admin SDK)
export const FIREBASE_AUTH = Symbol('FIREBASE_AUTH');

//* Única fuente de configuración de Firebase Admin: inicializa la app una sola vez y expone su Auth
@Injectable()
export class FirebaseConfigService {
  constructor(
    @Inject(environmentsConfig.KEY)
    private readonly configService: ConfigType<typeof environmentsConfig>,
  ) {}

  public createAuth(): Auth {
    return getAuth(this.getOrInitializeApp());
  }

  //? Reutiliza la app por defecto si ya existe (ej. recarga en caliente) para evitar "app/duplicate-app"
  private getOrInitializeApp(): App {
    const [EXISTING_APP] = getApps();

    return EXISTING_APP ?? initializeApp(this.createAppOptions());
  }

  private createAppOptions(): AppOptions {
    const FIREBASE = this.configService.security.firebase;

    //* Emulador: firebase-admin lee FIREBASE_AUTH_EMULATOR_HOST y no necesita credenciales
    if (FIREBASE.auth_emulator_host) {
      return { projectId: FIREBASE.project_id };
    }

    return {
      projectId: FIREBASE.project_id,
      credential: cert({
        projectId: FIREBASE.project_id,
        clientEmail: FIREBASE.client_email,
        privateKey: FIREBASE.private_key,
      }),
    };
  }
}
