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
import { FinancasService } from '../services/financas.service';
import { CreateCategoriaDto } from '../dtos/CreateCategoriaDto';
import { CategoriaLancamento } from '../entities/categoria-lancamento.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('categoria-financas')
export class CategoriaController {
  constructor(private readonly financasService: FinancasService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAllCategories(@CurrentUser('ongId') ongId: string) {
    return this.financasService.findAllCategories(ongId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOneCategory(
    @Param('id') id: string,
    @CurrentUser('ongId') ongId: string,
  ) {
    return this.financasService.findOneCategory(id, ongId);
  }

  @Post()
  createCategory(
    @Body() categoria: CreateCategoriaDto,
    @CurrentUser('ongId') ongId: string,
  ) {
    return this.financasService.createCategory(categoria, ongId);
  }

  @Delete(':id')
  removeCategory(@Param('id') id: string, @CurrentUser('ongId') ongId: string) {
    return this.financasService.removeCategory(id, ongId);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() categoria: CategoriaLancamento,
    @CurrentUser('ongId') ongId: string,
  ) {
    return this.financasService.updateCategory(id, categoria, ongId);
  }
}
