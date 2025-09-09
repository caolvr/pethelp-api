import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { FinancasService } from '../services/financas.service';
import { CreateLancamentoDto } from '../dtos/CreateLancamentoDto';
import { Lancamento } from '../entities/lancamento.entity';
import { CreateCategoriaDto } from '../dtos/CreateCategoriaDto';

@Controller('financas')
export class LancamentosController {
  constructor(private readonly financasService: FinancasService) {}

  @Get()
  findAll() {
    return this.financasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.financasService.findOne(id);
  }

  @Post() create(@Body() lancamento: CreateLancamentoDto) {
    return this.financasService.create(lancamento);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.financasService.remove(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() lancamento: Lancamento) {
    return this.financasService.update(id, lancamento);
  }
}
