import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lancamento } from '../entities/lancamento.entity';
import { CategoriaLancamento } from '../entities/categoria-lancamento.entity';
import { CreateLancamentoDto } from '../dtos/CreateLancamentoDto';
import { CreateCategoriaDto } from '../dtos/CreateCategoriaDto';

@Injectable()
export class FinancasService {
  constructor(
    @InjectRepository(Lancamento)
    private financasRepository: Repository<Lancamento>,
    @InjectRepository(CategoriaLancamento)
    private categoriaLancamentoRepository: Repository<CategoriaLancamento>,
  ) {}

  findAll(): Promise<Lancamento[]> {
    return this.financasRepository.find();
  }

  findAllCategories(): Promise<CategoriaLancamento[]> {
    return this.categoriaLancamentoRepository.find();
  }

  findOne(id: string): Promise<Lancamento | null> {
    return this.financasRepository.findOneBy({ id: id });
  }

  findOneCategory(id: string): Promise<CategoriaLancamento | null> {
    return this.categoriaLancamentoRepository.findOneBy({ id: id });
  }

  async remove(id: string): Promise<void> {
    await this.financasRepository.delete(id);
  }

  async removeCategory(id: string): Promise<void> {
    await this.categoriaLancamentoRepository.delete(id);
  }

  async create(createLancamentoDto: CreateLancamentoDto): Promise<Lancamento> {
    const lancamento = this.financasRepository.create(createLancamentoDto);
    return await this.financasRepository.save(lancamento);
  }

  async createCategory(
    createCategoriaDto: CreateCategoriaDto,
  ): Promise<CategoriaLancamento> {
    const categoria =
      this.categoriaLancamentoRepository.create(createCategoriaDto);
    return await this.categoriaLancamentoRepository.save(categoria);
  }

  async update(id: string, lancamento: Lancamento): Promise<Lancamento> {
    await this.financasRepository.update(id, lancamento);
    const updatedLancamento = await this.financasRepository.findOneBy({ id });
    if (!updatedLancamento) {
      throw new Error(`Lancamento com o id ${id} não encontrado após update.`);
    }
    return updatedLancamento;
  }

  async updateCategory(
    id: string,
    categoria: CategoriaLancamento,
  ): Promise<CategoriaLancamento> {
    await this.categoriaLancamentoRepository.update(id, categoria);
    const updatedCategoria = await this.categoriaLancamentoRepository.findOneBy(
      { id },
    );
    if (!updatedCategoria) {
      throw new Error(`Categoria com o id ${id} não encontrado após update.`);
    }
    return updatedCategoria;
  }
}
