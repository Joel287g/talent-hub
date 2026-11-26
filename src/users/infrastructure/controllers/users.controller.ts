//? Imports de codigo
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

//* El alta de usuarios se hace en POST /auth/register: el uid y el email salen del token verificado
@ApiTags('Users')
@Controller('users')
export class UsersController {
  //TODO: GET /users/me con los datos del usuario autenticado (@GetUser() + UserMapper.toResponse)
}
