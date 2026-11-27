//? Imports de codigo
import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

//? Imports de usuario
import { GetUser } from '@common/infrastructure/decorators';

import { CreateBusinessProfileDto, CreatePersonalProfileDto } from '@users/application/dtos';
import { AddBusinessProfileService, AddPersonalProfileService } from '@users/application/services';
import { UserEntity, UserInterface } from '@users/domain/entities';
import { UserMapper } from '@users/infrastructure/persistence';

//* El alta de usuarios se hace en POST /auth/register: el uid y el email salen del token verificado
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly addPersonalProfileService: AddPersonalProfileService,
    private readonly addBusinessProfileService: AddBusinessProfileService,
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
}
