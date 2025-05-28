import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { JogosService } from './jogos.service';
import { CreateJogoDto } from './dto/create-jogo.dto';
import { UpdateJogoDto } from './dto/update-jogo.dto';
import { AuthService } from 'src/auth/auth.service';

@Controller('jogos')
export class JogosController {
  constructor(
    private readonly jogosService: JogosService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  create(
    //@Headers('x-api-key') token: string,
    @Body() createJogoDto: CreateJogoDto,
  ) {
    //if (!token) throw new UnauthorizedException('Token não informado');
    //this.authService.validateToken(token);
    return this.jogosService.create(createJogoDto);
  }

  @Get()
  findAll(
    //@Headers('x-api-key') token: string,
    @Query('nome') nome?: string,
    @Query('valor') valor?: string,
    @Query('empresa') empresa?: string,
    @Query('lancamento') lancamento?: string,
    @Query('genero') genero?: string,
    @Query('consoles') consoles?: string,
    @Query('avaliacao') avaliacao?: number,
  ) {
    //if (!token) throw new UnauthorizedException('Token não informado');
    //this.authService.validateToken(token);

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
  findOne(@Headers('x-api-key') token: string, @Param('id') id: string) {
    if (!token) throw new UnauthorizedException('Token não informado');
    this.authService.validateToken(token);
    return this.jogosService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Headers('x-api-key') token: string,
    @Param('id') id: string,
    @Body() updateJogoDto: UpdateJogoDto,
  ) {
    if (!token) throw new UnauthorizedException('Token não informado');
    this.authService.validateToken(token);
    return this.jogosService.update(+id, updateJogoDto);
  }

  @Delete(':id')
  remove(@Headers('x-api-key') token: string, @Param('id') id: string) {
    if (!token) throw new UnauthorizedException('Token não informado');
    this.authService.validateToken(token);
    return this.jogosService.remove(+id);
  }
}
