//? Imports de codigo
import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

//? Imports de usuario
import { GetUser } from '@common/infrastructure/decorators';

import { UserEntity, UserInterface } from '@users/domain/entities';
import { UserMapper } from '@users/infrastructure/persistence';

//* El alta de usuarios se hace en POST /auth/register: el uid y el email salen del token verificado
@ApiTags('Users')
@Controller('users')
export class UsersController {
  //* La JwtStrategy ya cargó el usuario (existe y está ACTIVE): no hace falta otra consulta
  @Get('me')
  @ApiOperation({ summary: 'Devuelve los datos del usuario autenticado' })
  public me(@GetUser() user: UserEntity): UserInterface {
    return UserMapper.toResponse(user);
  }
}
