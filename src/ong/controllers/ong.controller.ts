import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { OngService } from '../services/ong.service';
import { Ong } from '../entities/ong.entity';
import { CreateOngDto } from '../dtos/CreateOngDto';
import { TokenValidationGuard } from 'src/auth/guards/token-validation.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('ongs')
export class OngController {
  constructor(private readonly ongService: OngService) {}

  @Post() create(@Body() ong: CreateOngDto) {
    return this.ongService.create(ong);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ongService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.ongService.findAll();
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() ong: Ong) {
    return this.ongService.update(id, ong);
  }
}
