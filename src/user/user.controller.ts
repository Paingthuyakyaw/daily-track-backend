import { Controller, Get, HttpCode } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @HttpCode(200)
  async findAll() {
    const data = await this.userService.getAllUser();
    return {
      message: 'Good Job',
      data,
    };
  }
}
