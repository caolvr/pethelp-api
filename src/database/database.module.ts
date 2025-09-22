import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { existsSync } from 'fs';

const ENTITIES = [join(__dirname, '/../**/*.entity.js')];
const MIGRATIONS = [join(__dirname, '/../migrations/*.js')];

console.log('[DB PATHS]', {
  __dirname,
  ENTITIES,
  MIGRATIONS,
  entityDirExists: existsSync(join(__dirname, '/../users/entities')),
  migrationsDirExists: existsSync(join(__dirname, '/../migrations')),
});

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      url: process.env.DATABASE_URL,
      synchronize: false,
      logging: true,
      entities: ENTITIES,
      migrations: MIGRATIONS,
      migrationsRun: true,
    }),
  ],
})
export class DatabaseModule {}
