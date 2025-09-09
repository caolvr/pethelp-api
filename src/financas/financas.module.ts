import { Module } from '@nestjs/common';
import { Lancamento } from './entities/lancamento.entity';
import { CategoriaLancamento } from './entities/categoria-lancamento.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LancamentosController } from './controllers/lancamento.controller';
import { CategoriaController } from './controllers/categoria-lancamento.controller';
import { FinancasService } from './services/financas.service';

@Module({
  imports: [TypeOrmModule.forFeature([Lancamento, CategoriaLancamento])],
  controllers: [LancamentosController, CategoriaController],
  providers: [FinancasService],
})
export class FinancasModule {}
