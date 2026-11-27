//? Imports de codigo
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

//? Imports de usuario
import { GetUser } from '@common/infrastructure/decorators';

import {
  CreateBusinessProfileDto,
  CreatePersonalProfileDto,
  SwitchActiveProfileDto,
  UpdateBusinessProfileDto,
  UpdatePersonalProfileDto,
} from '@users/application/dtos';
import {
  AddBusinessProfileService,
  AddPersonalProfileService,
  UpdatePersonalProfileService,
} from '@users/application/services';
import {
  SwitchActiveProfileUseCase,
  UpdateBusinessProfileUseCase,
} from '@users/application/use-cases';
import { UserEntity, UserInterface } from '@users/domain/entities';
import { UserMapper } from '@users/infrastructure/persistence';

//* El alta de usuarios se hace en POST /auth/register: el uid y el email salen del token verificado
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly addPersonalProfileService: AddPersonalProfileService,
    private readonly addBusinessProfileService: AddBusinessProfileService,
    private readonly switchActiveProfileUseCase: SwitchActiveProfileUseCase,
    private readonly updatePersonalProfileService: UpdatePersonalProfileService,
    private readonly updateBusinessProfileUseCase: UpdateBusinessProfileUseCase,
  ) {}

  //* La JwtStrategy ya cargó el usuario (existe y está ACTIVE): no hace falta otra consulta
  @Get('me')
  @ApiOperation({ summary: 'Devuelve los datos del usuario autenticado' })
  public me(@GetUser() user: UserEntity): UserInterface {
    return UserMapper.toResponse(user);
  }

  //* Para quien se registró con su cuenta de empresa y ahora quiere su perfil personal
  @Post('me/personal-profile')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Añade el perfil personal al usuario autenticado' })
  @ApiBody({ type: CreatePersonalProfileDto })
  public async addPersonalProfile(
    @GetUser() user: UserEntity,
    @Body() createPersonalProfileDto: CreatePersonalProfileDto,
  ): Promise<UserInterface> {
    const USER = await this.addPersonalProfileService.execute(user, createPersonalProfileDto);
    return UserMapper.toResponse(USER);
  }

  //* Edición parcial: los campos omitidos no cambian; `null` borra los opcionales
  @Patch('me/personal-profile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Edita el perfil personal del usuario autenticado' })
  @ApiBody({ type: UpdatePersonalProfileDto })
  public async updatePersonalProfile(
    @GetUser() user: UserEntity,
    @Body() updatePersonalProfileDto: UpdatePersonalProfileDto,
  ): Promise<UserInterface> {
    const USER = await this.updatePersonalProfileService.execute(user, updatePersonalProfileDto);
    return UserMapper.toResponse(USER);
  }

  //* Para quien se registró con su perfil personal y ahora quiere una cuenta de empresa (0..N)
  @Post('me/business-profiles')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Añade una cuenta de empresa al usuario autenticado' })
  @ApiBody({ type: CreateBusinessProfileDto })
  public async addBusinessProfile(
    @GetUser() user: UserEntity,
    @Body() createBusinessProfileDto: CreateBusinessProfileDto,
  ): Promise<UserInterface> {
    const USER = await this.addBusinessProfileService.execute(user, createBusinessProfileDto);
    return UserMapper.toResponse(USER);
  }

  //* Edición parcial de una empresa del usuario; sin consultas previas, así que llama al caso de uso
  @Patch('me/business-profiles/:businessProfileId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Edita una cuenta de empresa del usuario autenticado' })
  @ApiParam({ name: 'businessProfileId', description: 'Id de la empresa (de businessProfiles)' })
  @ApiBody({ type: UpdateBusinessProfileDto })
  public async updateBusinessProfile(
    @GetUser() user: UserEntity,
    @Param('businessProfileId') businessProfileId: string,
    @Body() updateBusinessProfileDto: UpdateBusinessProfileDto,
  ): Promise<UserInterface> {
    const USER = await this.updateBusinessProfileUseCase.execute(
      user,
      businessProfileId,
      updateBusinessProfileDto,
    );
    return UserMapper.toResponse(USER);
  }

  //* Cambia entre el perfil personal y las empresas del usuario (decide qué datos muestra el cliente)
  @Patch('me/active-profile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cambia el perfil activo del usuario autenticado' })
  @ApiBody({ type: SwitchActiveProfileDto })
  public async switchActiveProfile(
    @GetUser() user: UserEntity,
    @Body() switchActiveProfileDto: SwitchActiveProfileDto,
  ): Promise<UserInterface> {
    const USER = await this.switchActiveProfileUseCase.execute(user, switchActiveProfileDto);
    return UserMapper.toResponse(USER);
  }
}
