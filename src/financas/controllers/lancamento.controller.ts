import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { FinancasService } from '../services/financas.service';
import { CreateLancamentoDto } from '../dtos/CreateLancamentoDto';
import { Lancamento } from '../entities/lancamento.entity';
import { TokenValidationGuard } from 'src/auth/guards/token-validation.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { IsAdmin } from 'src/auth/decorators/is-admin.decorator';
import { UpdateLancamentoDto } from '../dtos/UpdateLancamentoDto';

@Controller('financas')
export class LancamentosController {
  constructor(private readonly financasService: FinancasService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@CurrentUser('ongId') ongId: string) {
    return this.financasService.findAll(ongId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser('ongId') ongId: string) {
    return this.financasService.findOne(id, ongId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @CurrentUser('ongId') ongId: string,
    @Body() lancamento: CreateLancamentoDto,
  ) {
    return this.financasService.create(lancamento, ongId);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser('ongId') ongId: string,
    @IsAdmin('is_admin') isAdmin: boolean,
  ) {
    if (!isAdmin) {
      throw new UnauthorizedException('Ação restrita para administradores');
    }
    return this.financasService.remove(id, ongId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() lancamento: UpdateLancamentoDto,
    @CurrentUser('ongId') ongId: string,
  ) {
    console.log(lancamento);
    return this.financasService.update(id, lancamento, ongId);
  }
}
