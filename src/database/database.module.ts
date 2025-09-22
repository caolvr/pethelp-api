// src/database/database.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'r00t',
      database: 'pethelp',
      entities: [__dirname + '/../**/*.entity.{ts,js}'],
      synchronize: false,
      migrations: [__dirname + '/../migrations/*{.ts,.js}'],
      migrationsRun: true,
      logging: true,
    }),
  ],
})
export class DatabaseModule {}
