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
import { CreateCategoriaDto } from '../dtos/CreateCategoriaDto';
import { CategoriaLancamento } from '../entities/categoria-lancamento.entity';

@Controller('categoria-financas')
export class CategoriaController {
  constructor(private readonly financasService: FinancasService) {}
  @Get()
  findAllCategories() {
    return this.financasService.findAllCategories();
  }

  @Get(':id')
  findOneCategory(@Param('id') id: string) {
    return this.financasService.findOneCategory(id);
  }

  @Post() createCategory(@Body() categoria: CreateCategoriaDto) {
    return this.financasService.createCategory(categoria);
  }

  @Delete(':id')
  removeCategory(@Param('id') id: string) {
    return this.financasService.removeCategory(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() categoria: CategoriaLancamento) {
    return this.financasService.updateCategory(id, categoria);
  }
}
