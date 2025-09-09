import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { OngService } from '../services/ong.service';
import { Ong } from '../entities/ong.entity';
import { CreateOngDto } from '../dtos/CreateOngDto';

@Controller('ongs')
export class OngController {
  constructor(private readonly ongService: OngService) {}

  @Get()
  findAll() {
    return this.ongService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ongService.findOne(id);
  }

  @Post() create(@Body() ong: CreateOngDto) {
    return this.ongService.create(ong);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ongService.remove(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() ong: Ong) {
    return this.ongService.update(id, ong);
  }
}
