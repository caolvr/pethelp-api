import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lancamento } from '../entities/lancamento.entity';
import { CategoriaLancamento } from '../entities/categoria-lancamento.entity';
import { CreateLancamentoDto } from '../dtos/CreateLancamentoDto';
import { CreateCategoriaDto } from '../dtos/CreateCategoriaDto';
import { UpdateLancamentoDto } from '../dtos/UpdateLancamentoDto';

@Injectable()
export class FinancasService {
  constructor(
    @InjectRepository(Lancamento)
    private financasRepository: Repository<Lancamento>,
    @InjectRepository(CategoriaLancamento)
    private categoriaLancamentoRepository: Repository<CategoriaLancamento>,
  ) {}

  findAll(ongId: string): Promise<Lancamento[]> {
    return this.financasRepository.find({
      where: { ong: { id: ongId } },
      relations: ['ong', 'categoria'],
    });
  }

  findAllCategories(ongId: string): Promise<CategoriaLancamento[]> {
    return this.categoriaLancamentoRepository.find({
      where: { ong: { id: ongId } },
    });
  }

  findOne(id: string, ongId: string): Promise<Lancamento | null> {
    return this.financasRepository.findOne({
      where: { id, ong: { id: ongId } },
      relations: ['ong', 'categoria'],
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
  ): Promise<Lancamento | null> {
    console.log(createLancamentoDto);
    const lancamento = this.financasRepository.create({
      ...createLancamentoDto,
      valor: parseFloat(createLancamentoDto.valor.toFixed(2)),
      ong: { id: ongId },
      categoria: createLancamentoDto.categoria_id
        ? ({ id: createLancamentoDto.categoria_id } as any)
        : undefined,
    });
    const saved = await this.financasRepository.save(lancamento);
    return this.financasRepository.findOne({
      where: { id: saved.id },
      relations: ['ong', 'categoria'],
    });
  }

  async createCategory(
    createCategoriaDto: CreateCategoriaDto,
    ongId: string,
  ): Promise<CategoriaLancamento> {
    try {
      const categoria = this.categoriaLancamentoRepository.create({
        ...createCategoriaDto,
        ong: { id: ongId },
      });
      return await this.categoriaLancamentoRepository.save(categoria);
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      throw new Error(`Erro ao criar categoria: ${error.message}`);
    }
  }

  async update(
    id: string,
    lancamento: UpdateLancamentoDto,
    ongId: string,
  ): Promise<Lancamento> {
    try {
      const { categoria_id, ...rest } = lancamento as any;
      const updatePayload: any = { ...rest };
      if (categoria_id !== undefined) {
        updatePayload.categoria = categoria_id
          ? ({ id: categoria_id } as any)
          : null;
      }

      await this.financasRepository.update(
        { id: id, ong: { id: ongId } },
        updatePayload,
      );

      const updatedLancamento = await this.financasRepository.findOne({
        where: { id: id, ong: { id: ongId } },
        relations: ['ong', 'categoria'],
      });
      if (!updatedLancamento) {
        throw new Error(
          `Lancamento com o id ${id} não encontrado após update.`,
        );
      }
      return updatedLancamento;
    } catch (error) {
      console.error('Erro ao atualizar lancamento:', error);
      throw new Error(`Erro ao atualizar lancamento: ${error.message}`);
    }
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
