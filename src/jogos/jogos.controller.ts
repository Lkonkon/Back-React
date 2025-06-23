/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Headers,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JogosService } from './jogos.service';
import { CreateJogoDto } from './dto/create-jogo.dto';
import { UpdateJogoDto } from './dto/update-jogo.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthService } from 'src/auth/auth.service';

@Controller('jogos')
@UseGuards(AuthGuard)
export class JogosController {
  private readonly logger = new Logger(JogosController.name);

  constructor(
    private readonly jogosService: JogosService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  async create(
    @Body() createJogoDto: CreateJogoDto,
    @Headers('authorization') authHeader: string,
  ) {
    if (!authHeader) {
      throw new UnauthorizedException('Token não fornecido');
    }
    
    const token = authHeader.replace('Bearer ', '');
    const user = await this.authService.getUserByToken(token);
    
    this.logger.log(`Usuário ${user.nome} (${user.email}) criando jogo: ${createJogoDto.nome}`);
    
    // Aqui você pode adicionar lógica para associar o jogo ao usuário
    // Por exemplo, adicionar um campo userId ao CreateJogoDto
    
    return this.jogosService.create(createJogoDto);
  }

  @Get()
  async findAll(
    @Query('nome') nome?: string,
    @Query('valor') valor?: string,
    @Query('empresa') empresa?: string,
    @Query('lancamento') lancamento?: string,
    @Query('genero') genero?: string,
    @Query('consoles') consoles?: string,
    @Query('avaliacao') avaliacao?: number,
    @Headers('authorization') authHeader?: string,
  ) {
    console.log(authHeader);
    console.log("SSSSS")
    if (!authHeader) {
      throw new UnauthorizedException('Token não fornecido');
    }
    
    const token = authHeader.replace('Bearer ', '');
    console.log(token);
    const user = await this.authService.getUserByToken(token);
    
    this.logger.log(`Usuário ${user.nome} (${user.email}) buscando jogos`);
    
    return this.jogosService.findAll(
      nome,
      valor,
      empresa,
      lancamento ? new Date(lancamento) : undefined,
      genero,
      consoles,
      avaliacao,
    );
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Headers('authorization') authHeader: string,
  ) {
    if (!authHeader) {
      throw new UnauthorizedException('Token não fornecido');
    }
    
    const token = authHeader.replace('Bearer ', '');
    const user = await this.authService.getUserByToken(token);
    
    this.logger.log(`Usuário ${user.nome} (${user.email}) buscando jogo ${id}`);
    
    return this.jogosService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateJogoDto: UpdateJogoDto,
    @Headers('authorization') authHeader: string,
  ) {
    if (!authHeader) {
      throw new UnauthorizedException('Token não fornecido');
    }
    
    const token = authHeader.replace('Bearer ', '');
    const user = await this.authService.getUserByToken(token);
    
    this.logger.log(`Usuário ${user.nome} (${user.email}) atualizando jogo ${id}`);
    
    return this.jogosService.update(+id, updateJogoDto);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Headers('authorization') authHeader: string,
  ) {
    if (!authHeader) {
      throw new UnauthorizedException('Token não fornecido');
    }
    
    const token = authHeader.replace('Bearer ', '');
    const user = await this.authService.getUserByToken(token);
    
    this.logger.log(`Usuário ${user.nome} (${user.email}) deletando jogo ${id}`);
    
    return this.jogosService.remove(+id);
  }
}
