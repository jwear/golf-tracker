import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signup(
    createUserDto: CreateUserDto,
  ): Promise<{ id: string; email: string }> {
    const user = await this.usersService.create(createUserDto);
    return { id: user.id, email: user.email };
  }
}
