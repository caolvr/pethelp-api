import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateUserDto } from '../dtos/CreateUserDto';
import { UserService } from '../services/user.service';
import { UpdateUserDto } from '../dtos/UpdateUserDto';

@Controller('users')
export class UsersController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findById(@CurrentUser('ongId') ongId: string, @Param('id') userId: string) {
    return this.userService.findOneById(userId, ongId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() user: UpdateUserDto,
    @CurrentUser('ongId') ongId: string,
  ) {
    return this.userService.update(user, ongId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@CurrentUser('ongId') ongId: string) {
    return this.userService.findAll(ongId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@CurrentUser('ongId') ongId: string, @Body() user: CreateUserDto) {
    return this.userService.create(user, ongId);
  }
}
