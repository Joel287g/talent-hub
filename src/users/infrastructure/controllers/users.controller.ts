//? Imports de codigo
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

//? Imports de usuario
import { CreateUserDto } from '@users/application/dtos';
import { CreateUserService } from '@users/application/services';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly createUserService: CreateUserService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crea un usuario completo tras finalizar el flujo de onboarding' })
  @ApiBody({ type: CreateUserDto })
  public async create(@Body() createUserDto: CreateUserDto) {
    return await this.createUserService.execute(createUserDto);
  }
}
