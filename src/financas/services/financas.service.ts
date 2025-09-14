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

  findAll(ongId: string): Promise<Lancamento[]> {
    return this.financasRepository.find({ where: { ong: { id: ongId } } });
  }

  findAllCategories(ongId: string): Promise<CategoriaLancamento[]> {
    return this.categoriaLancamentoRepository.find({
      where: { ong: { id: ongId } },
    });
  }

  findOne(id: string, ongId: string): Promise<Lancamento | null> {
    return this.financasRepository.findOne({
      where: { id: id, ong: { id: ongId } },
    });
  }

  findOneCategory(
    id: string,
    ongId: string,
  ): Promise<CategoriaLancamento | null> {
    return this.categoriaLancamentoRepository.findOne({
      where: { id: id, ong: { id: ongId } },
    });
  }

  async remove(id: string, ongId: string): Promise<void> {
    await this.financasRepository.delete({ id: id, ong: { id: ongId } });
  }

  async removeCategory(id: string, ongId: string): Promise<void> {
    await this.categoriaLancamentoRepository.delete({
      id: id,
      ong: { id: ongId },
    });
  }

  async create(
    createLancamentoDto: CreateLancamentoDto,
    ongId: string,
  ): Promise<Lancamento> {
    const lancamento = this.financasRepository.create({
      ...createLancamentoDto,
      ong: { id: ongId },
    });
    return await this.financasRepository.save(lancamento);
  }

  async createCategory(
    createCategoriaDto: CreateCategoriaDto,
    ongId: string,
  ): Promise<CategoriaLancamento> {
    const categoria = this.categoriaLancamentoRepository.create({
      ...createCategoriaDto,
      ong: { id: ongId },
    });
    return await this.categoriaLancamentoRepository.save(categoria);
  }

  async update(
    id: string,
    lancamento: Lancamento,
    ongId: string,
  ): Promise<Lancamento> {
    await this.financasRepository.update(
      { id, ong: { id: ongId } },
      lancamento,
    );
    const updatedLancamento = await this.financasRepository.findOneBy({ id });
    if (!updatedLancamento) {
      throw new Error(`Lancamento com o id ${id} não encontrado após update.`);
    }
    return updatedLancamento;
  }

  async updateCategory(
    id: string,
    categoria: CategoriaLancamento,
    ongId: string,
  ): Promise<CategoriaLancamento> {
    await this.categoriaLancamentoRepository.update(
      { id, ong: { id: ongId } },
      categoria,
    );
    const updatedCategoria = await this.categoriaLancamentoRepository.findOneBy(
      { id },
    );
    if (!updatedCategoria) {
      throw new Error(`Categoria com o id ${id} não encontrado após update.`);
    }
    return updatedCategoria;
  }
}
