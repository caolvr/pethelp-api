import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OngService } from '../services/ong.service';
import { Ong } from '../entities/ong.entity';
import { CreateOngDto } from '../dtos/CreateOngDto';
import { TokenValidationGuard } from 'src/auth/guards/token-validation.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';

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
  findAll(@Req() req: Request) {
    console.log('Cookies:', req.cookies);
    return this.ongService.findAll();
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() ong: Ong) {
    return this.ongService.update(id, ong);
  }
}
