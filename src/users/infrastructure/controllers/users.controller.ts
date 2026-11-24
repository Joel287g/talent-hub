//? Imports de codigo
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

//? Imports de usuario
import { PublicJwt } from '@common/infrastructure/decorators';

import { CreateUserDto } from '@users/application/dtos';
import { CreateUserService } from '@users/application/services';
import { UserInterface } from '@users/domain/entities';
import { UserMapper } from '@users/infrastructure/persistence';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly createUserService: CreateUserService) {}

  @PublicJwt()
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crea un usuario completo tras finalizar el flujo de onboarding' })
  @ApiBody({ type: CreateUserDto })
  public async create(@Body() createUserDto: CreateUserDto): Promise<UserInterface> {
    const USER = await this.createUserService.execute(createUserDto);

    return UserMapper.toResponse(USER);
  }
}
