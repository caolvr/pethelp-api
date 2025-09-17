import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PetsService } from '../services/pets.service';
import { Pet } from '../entities/pet.entity';
import { CreatePetDto } from '../dtos/CreatePetDto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { BlackbazeService } from '../services/blackbaze.service';
import { FilterAdocaoDto } from '../dtos/FilterAdocaoDto';

@Controller('pets')
export class PetsController {
  constructor(
    private readonly petsService: PetsService,
    private readonly blackbazeService: BlackbazeService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @CurrentUser('ongId') ongId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.petsService.findAll(ongId, {
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
    });
  }

  @Get('adocao')
  findAllAdocao(@Query() query: FilterAdocaoDto) {
    return this.petsService.findAllAdocao(query);
  }

  // @Get('adocao')
  // findAllAdocao() {
  //   return this.petsService.findAllAdocao();
  // }

  @Get('upload-url')
  async getUploadUrl() {
    const res = await this.blackbazeService.getUploadUrl();
    console.log(res);
    return res;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser('ongId') ongId: string) {
    return this.petsService.findOne(id, ongId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@CurrentUser('ongId') ongId: string, @Body() pet: CreatePetDto) {
    return this.petsService.create(pet, ongId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser('ongId') ongId: string) {
    return this.petsService.remove(id, ongId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() pet: Pet,
    @CurrentUser('ongId') ongId: string,
  ) {
    return this.petsService.update(id, pet, ongId);
  }
}
