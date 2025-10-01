import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinancasService } from './financas.service';
import { Lancamento } from '../entities/lancamento.entity';
import { CategoriaLancamento } from '../entities/categoria-lancamento.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ong } from '../../ong/entities/ong.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateLancamentoDto } from '../dtos/CreateLancamentoDto';
import { CreateCategoriaDto } from '../dtos/CreateCategoriaDto';
import { INestApplication } from '@nestjs/common';
import { AppModule } from 'src/app.module';

describe('FinancasService (integration)', () => {
  let service: FinancasService;
  let categoriaRepo: Repository<CategoriaLancamento>;
  let lancamentoRepo: Repository<Lancamento>;
  let ongRepo: Repository<Ong>;
  let ongId: string;
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = moduleFixture.get(DataSource);
    service = moduleFixture.get(FinancasService);

    ongRepo = dataSource.getRepository(Ong);
    const ong = ongRepo.create({
      razao_social: 'ONG Teste',
      cnpj: '12345678901234',
      email: 'ongteste@email.com',
      celular: '123456789',
      cep: '12345678',
      estado_uf: 'SP',
      cidade: 'São Paulo',
      logradouro: 'Rua Teste',
      bairro: 'Centro',
      numero: '123',
      complemento: 'Apto 1',
      referencia: 'Próximo à praça',
    });
    await ongRepo.save(ong);
    ongId = ong.id;
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  afterEach(async () => {
    await dataSource.getRepository(Lancamento).clear();
    await dataSource.getRepository(CategoriaLancamento).clear();
  });

  it('deve criar uma categoria', async () => {
    const dto: CreateCategoriaDto = {
      nome: 'Categoria Teste',
      tipo_categoria: 'receita',
    };
    const categoria = await service.createCategory(dto, ongId);
    expect(categoria).toBeDefined();
    expect(categoria.nome).toBe(dto.nome);
    expect(categoria.tipo_categoria).toBe(dto.tipo_categoria);
    expect(categoria.ong.id).toBe(ongId);
  });

  it('deve criar um lançamento', async () => {
    const categoria = await service.createCategory(
      { nome: 'Cat', tipo_categoria: 'despesa' },
      ongId,
    );
    const dto: CreateLancamentoDto = {
      descricao: 'Teste',
      valor: 100.5,
      categoria_id: categoria.id,
      data: new Date().toISOString(),
      pago: false,
    };
    const lancamento = await service.create(dto, ongId);
    expect(lancamento).not.toBeNull();
    if (lancamento) {
      expect(lancamento.valor).toBeCloseTo(100.5);
      expect(lancamento.categoria.id).toBe(categoria.id);
      expect(lancamento.ong.id).toBe(ongId);
    }
  });

  it('deve buscar todos os lançamentos', async () => {
    const categoria = await service.createCategory(
      { nome: 'CatBusca', tipo_categoria: 'despesa' },
      ongId,
    );
    const dto: CreateLancamentoDto = {
      descricao: 'TesteBusca',
      valor: 50.0,
      categoria_id: categoria.id,
      data: new Date().toISOString(),
      pago: false,
    };
    await service.create(dto, ongId);
    const lancamentos = await service.findAll(ongId);
    expect(Array.isArray(lancamentos)).toBe(true);
    expect(lancamentos.length).toBeGreaterThanOrEqual(1);
  });

  it('deve atualizar um lançamento', async () => {
    const categoria = await service.createCategory(
      { nome: 'CatBusca', tipo_categoria: 'despesa' },
      ongId,
    );
    const dto: CreateLancamentoDto = {
      descricao: 'TesteBusca',
      valor: 50.0,
      categoria_id: categoria.id,
      data: new Date().toISOString(),
      pago: false,
    };
    await service.create(dto, ongId);
    const lancamentos = await service.findAll(ongId);
    const lancamento = lancamentos[0];
    const updateDto = {
      descricao: 'Atualizado',
      valor: 200.0,
      pago: false,
      data: new Date().toISOString(),
    };
    const updated = await service.update(lancamento.id, updateDto, ongId);
    expect(updated).not.toBeNull();
    if (updated) {
      expect(updated.descricao).toBe('Atualizado');
      expect(updated.valor).toBeCloseTo(200.0);
    }
  });

  it('deve remover um lançamento', async () => {
    const categoria = await service.createCategory(
      { nome: 'CatBusca', tipo_categoria: 'despesa' },
      ongId,
    );
    const dto: CreateLancamentoDto = {
      descricao: 'TesteBusca',
      valor: 50.0,
      categoria_id: categoria.id,
      data: new Date().toISOString(),
      pago: false,
    };
    await service.create(dto, ongId);
    const lancamentos = await service.findAll(ongId);
    const lancamento = lancamentos[0];
    await service.remove(lancamento.id, ongId);
    const found = await service.findOne(lancamento.id, ongId);
    expect(found).toBeNull();
  });

  it('deve remover uma categoria', async () => {
    await service.createCategory(
      { nome: 'CatBusca', tipo_categoria: 'despesa' },
      ongId,
    );
    const categorias = await service.findAllCategories(ongId);
    const categoria = categorias[0];
    await service.removeCategory(categoria.id, ongId);
    const found = await service.findOneCategory(categoria.id, ongId);
    expect(found).toBeNull();
  });
});
