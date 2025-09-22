import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class NewMigration1758510079974 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ong
    await queryRunner.createTable(
      new Table({
        name: 'ong',
        columns: [
          { name: 'id', type: 'char', length: '36', isPrimary: true }, // REMOVIDO default: 'uuid()'
          {
            name: 'razao_social',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'cnpj',
            type: 'varchar',
            length: '18',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isUnique: true,
            isNullable: false,
          },
          { name: 'celular', type: 'varchar', length: '20', isNullable: false },
          { name: 'cep', type: 'varchar', length: '9', isNullable: false },
          {
            name: 'estado_uf',
            type: 'varchar',
            length: '2',
            isNullable: false,
          },
          { name: 'cidade', type: 'varchar', length: '100', isNullable: false },
          {
            name: 'logradouro',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          { name: 'bairro', type: 'varchar', length: '100', isNullable: false },
          { name: 'numero', type: 'varchar', length: '10', isNullable: false },
          {
            name: 'complemento',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'referencia',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
        ],
      }),
    );

    // user
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          { name: 'id', type: 'char', length: '36', isPrimary: true }, // REMOVIDO default
          { name: 'nome', type: 'varchar', length: '100', isNullable: false },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'cpf',
            type: 'varchar',
            length: '255',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'celular',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          { name: 'senha', type: 'varchar', length: '255', isNullable: false },
          { name: 'ativo', type: 'boolean', isNullable: false, default: true },
          {
            name: 'is_admin',
            type: 'boolean',
            isNullable: false,
            default: false,
          },
          { name: 'ong_id', type: 'char', length: '36', isNullable: true },
        ],
        foreignKeys: [
          new TableForeignKey({
            columnNames: ['ong_id'],
            referencedTableName: 'ong',
            referencedColumnNames: ['id'],
            onDelete: 'NO ACTION',
          }),
        ],
      }),
    );

    // pet
    await queryRunner.createTable(
      new Table({
        name: 'pet',
        columns: [
          { name: 'id', type: 'char', length: '36', isPrimary: true }, // REMOVIDO default
          { name: 'nome', type: 'varchar', length: '50', isNullable: false },
          {
            name: 'especie',
            type: 'enum',
            enum: ['cao', 'gato'],
            isNullable: false,
          },
          {
            name: 'sexo',
            type: 'enum',
            enum: ['macho', 'femea'],
            isNullable: false,
          },
          { name: 'data_nascimento', type: 'date', isNullable: true },
          {
            name: 'porte',
            type: 'enum',
            enum: ['pequeno', 'medio', 'grande'],
            isNullable: false,
          },
          {
            name: 'informacoes',
            type: 'varchar',
            length: '350',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['disponivel', 'adotado'],
            isNullable: false,
          },
          {
            name: 'foto_url',
            type: 'varchar',
            length: '200',
            isNullable: true,
          },
          { name: 'ong_id', type: 'char', length: '36', isNullable: true },
        ],
        foreignKeys: [
          new TableForeignKey({
            columnNames: ['ong_id'],
            referencedTableName: 'ong',
            referencedColumnNames: ['id'],
            onDelete: 'NO ACTION',
          }),
        ],
      }),
    );

    // categoria_lancamento
    await queryRunner.createTable(
      new Table({
        name: 'categoria_lancamento',
        columns: [
          { name: 'id', type: 'char', length: '36', isPrimary: true }, // REMOVIDO default
          { name: 'nome', type: 'varchar', length: '100', isNullable: false },
          {
            name: 'tipo_categoria',
            type: 'enum',
            enum: ['receita', 'despesa'],
            isNullable: false,
          },
          { name: 'ong_id', type: 'char', length: '36', isNullable: true },
        ],
        foreignKeys: [
          new TableForeignKey({
            columnNames: ['ong_id'],
            referencedTableName: 'ong',
            referencedColumnNames: ['id'],
            onDelete: 'NO ACTION',
          }),
        ],
      }),
    );

    // lancamento
    await queryRunner.createTable(
      new Table({
        name: 'lancamento',
        columns: [
          { name: 'id', type: 'char', length: '36', isPrimary: true }, // REMOVIDO default
          { name: 'data', type: 'date', isNullable: false },
          {
            name: 'valor',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'descricao',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          { name: 'data_vencimento', type: 'date', isNullable: true },
          { name: 'pago', type: 'boolean', isNullable: false },
          { name: 'data_pagamento', type: 'date', isNullable: true },
          {
            name: 'observacoes',
            type: 'varchar',
            length: '150',
            isNullable: true,
          },
          {
            name: 'categoria_id',
            type: 'char',
            length: '36',
            isNullable: true,
          },
          { name: 'ong_id', type: 'char', length: '36', isNullable: true },
        ],
        foreignKeys: [
          new TableForeignKey({
            columnNames: ['categoria_id'],
            referencedTableName: 'categoria_lancamento',
            referencedColumnNames: ['id'],
            onDelete: 'NO ACTION',
          }),
          new TableForeignKey({
            columnNames: ['ong_id'],
            referencedTableName: 'ong',
            referencedColumnNames: ['id'],
            onDelete: 'NO ACTION',
          }),
        ],
      }),
    );

    // password_reset_tokens
    await queryRunner.createTable(
      new Table({
        name: 'password_reset_tokens',
        columns: [
          { name: 'id', type: 'char', length: '36', isPrimary: true }, // REMOVIDO default
          { name: 'userId', type: 'char', length: '36', isNullable: true },
          {
            name: 'token_hash',
            type: 'varchar',
            length: '64',
            isUnique: true,
            isNullable: false,
          },
          { name: 'expires_at', type: 'timestamp', isNullable: false },
          { name: 'used_at', type: 'timestamp', isNullable: true },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          new TableForeignKey({
            columnNames: ['userId'],
            referencedTableName: 'user',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          }),
        ],
        indices: [{ name: 'IDX_password_reset_user', columnNames: ['userId'] }],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('password_reset_tokens', true);
    await queryRunner.dropTable('lancamento', true);
    await queryRunner.dropTable('categoria_lancamento', true);
    await queryRunner.dropTable('pet', true);
    await queryRunner.dropTable('user', true);
    await queryRunner.dropTable('ong', true);
  }
}
