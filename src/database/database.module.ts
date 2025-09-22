// src/database/database.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      url: process.env.DATABASE_URL,
      synchronize: false,
      logging: true,
      entities: [__dirname + '/../../dist/**/*.entity.js'],
      migrations: [__dirname + '/../../dist/migrations/*.js'],
      migrationsRun: true,
    }),
  ],
})
export class DatabaseModule {}
