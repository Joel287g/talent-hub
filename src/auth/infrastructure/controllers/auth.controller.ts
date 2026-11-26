//? Imports de codigo
import { Body, Controller, Headers, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';

//? Imports de usuario
import { PublicJwt } from '@common/infrastructure/decorators';

import { CreateUserDto } from '@users/application/dtos';

import { LoginService, RegisterService } from '@auth/application/services';
import { AuthSession } from '@auth/domain/interfaces';

//* Cabecera con el ID token de Firebase (distinta de `authorization`, que lleva el JWT del backend)
export const FIREBASE_TOKEN_HEADER = 'firebase-token';

const FIREBASE_TOKEN_API_HEADER = {
  name: FIREBASE_TOKEN_HEADER,
  description: 'ID token de Firebase Authentication (sin prefijo Bearer)',
  required: true,
};

//? Rutas públicas para el JWT: la identidad se verifica con el ID token de Firebase
@PublicJwt()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginService: LoginService,
    private readonly registerService: RegisterService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Canjea el ID token de Firebase por el JWT del backend',
  })
  @ApiHeader(FIREBASE_TOKEN_API_HEADER)
  public async login(@Headers(FIREBASE_TOKEN_HEADER) firebaseToken: string): Promise<AuthSession> {
    return await this.loginService.execute(firebaseToken);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registra al usuario tras el onboarding y devuelve el JWT del backend',
  })
  @ApiHeader(FIREBASE_TOKEN_API_HEADER)
  @ApiBody({ type: CreateUserDto })
  public async register(
    @Headers(FIREBASE_TOKEN_HEADER) firebaseToken: string,
    @Body() createUserDto: CreateUserDto,
  ): Promise<AuthSession> {
    return await this.registerService.execute(firebaseToken, createUserDto);
  }
}
