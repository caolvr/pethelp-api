import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PetsService } from '../services/pets.service';
import { Pet } from '../entities/pet.entity';
import { CreatePetDto } from '../dtos/CreatePetDto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { BlackbazeService } from '../services/backblaze.service';
import { FilterAdocaoDto } from '../dtos/FilterAdocaoDto';
import { IsAdmin } from 'src/auth/decorators/is-admin.decorator';
import { UpdatePetDto } from '../dtos/UpdatePetDto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('pets')
export class PetsController {
  constructor(
    private readonly petsService: PetsService,
    private readonly blackbazeService: BlackbazeService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@CurrentUser('ongId') ongId: string) {
    return this.petsService.findAll(ongId);
  }

  @Get('adocao')
  findAllAdocao(@Query() query: FilterAdocaoDto) {
    return this.petsService.findAllAdocao(query);
  }

  @Get('upload-url')
  async getUploadUrl() {
    const res = await this.blackbazeService.getUploadUrl();
    console.log(res);
    return res;
  }

  @Get('download-img-auth')
  async getDownloadAuth() {
    return this.blackbazeService.getDownloadAuthorization();
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
  remove(
    @Param('id') id: string,
    @CurrentUser('ongId') ongId: string,
    @IsAdmin('is_admin') isAdmin: boolean,
  ) {
    if (!isAdmin) {
      throw new UnauthorizedException('Ação restrita para administradores');
    }
    return this.petsService.remove(id, ongId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() pet: UpdatePetDto,
    @CurrentUser('ongId') ongId: string,
  ) {
    return this.petsService.update(id, pet, ongId);
  }
}
