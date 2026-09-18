//? Imports de codigo
import { Controller, Post, Body } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

//? Imports de usuario
import { CreateUserDto } from '@users/application/dtos';
import { CreateUserUseCase } from '@users/application/use-cases';

@Controller('users')
export class UsersController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post('create')
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiBody({ type: CreateUserDto })
  async createUser(@Body() payload: CreateUserDto) {
    return await this.createUserUseCase.execute(payload);
  }
}
