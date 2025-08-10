import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ong } from './entities/ong.entity';
import { OngService } from './services/ong.service';
import { OngController } from './controllers/ong.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Ong])],
  providers: [OngService],
  controllers: [OngController],
})
export class OngModule {}
