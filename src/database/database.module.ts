import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { existsSync } from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();

const ENTITIES = [join(__dirname, '/../**/*.entity{.ts,.js}')];
const MIGRATIONS = [join(__dirname, '/../migrations/*{.ts,.js}')];

console.log('[DB PATHS]', {
  __dirname,
  ENTITIES,
  MIGRATIONS,
  entityDirExists: existsSync(join(__dirname, '/../users/entities')),
  migrationsDirExists: existsSync(join(__dirname, '/../migrations')),
});

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        if (process.env.NODE_ENV === 'test') {
          console.log('Usando SQLite para testes');
          return {
            type: 'sqlite' as const,
            database: ':memory:',
            dropSchema: true,
            entities: ENTITIES,
            synchronize: true,
            logging: ['query', 'error'],
          };
        }

        console.log('Usando MySQL', process.env.DATABASE_URL);
        return {
          type: 'mysql' as const,
          url: process.env.DATABASE_URL,
          synchronize: false,
          logging: true,
          entities: ENTITIES,
          migrations: MIGRATIONS,
          migrationsRun: true,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
