import { Injectable } from '@nestjs/common';
import { CreateJogoDto } from './dto/create-jogo.dto';
import { UpdateJogoDto } from './dto/update-jogo.dto';
import { Jogo } from './entities/jogo.entity';
import { PrismaService } from 'prisma/prisma.service';

interface PrismaJogo {
  id: number;
  nome: string;
  empresa: string;
  valor: string;
  lancamento: Date;
  genero: string;
  consoles: string;
  avaliacao: number;
}

@Injectable()
export class JogosService {
  constructor(private prisma: PrismaService) {}

  async create(createJogoDto: CreateJogoDto): Promise<Jogo> {
    const jogo = await this.prisma.jogos.create({
      data: {
        nome: createJogoDto.nome,
        empresa: createJogoDto.empresa,
        valor: createJogoDto.valor,
        lancamento: new Date(createJogoDto.lancamento),
        genero: createJogoDto.genero,
        consoles: createJogoDto.consoles,
        avaliacao: createJogoDto.avaliacao,
      },
    });
    return this.mapToEntity(jogo);
  }

  async findAll(
    nome?: string,
    valor?: string,
    empresa?: string,
    lancamento?: Date,
    genero?: string,
    consoles?: string,
    avaliacao?: number,
  ): Promise<Jogo[]> {
    const jogos = await this.prisma.jogos.findMany({
      where: {
        ...(nome && { nome: { contains: nome, mode: 'insensitive' } }),
        ...(valor && { valor: { contains: valor, mode: 'insensitive' } }),
        ...(empresa && { empresa: { contains: empresa, mode: 'insensitive' } }),
        ...(lancamento && { lancamento: new Date(lancamento) }),
        ...(genero && { genero: { contains: genero, mode: 'insensitive' } }),
        ...(consoles && {
          consoles: { contains: consoles, mode: 'insensitive' },
        }),
        ...(avaliacao && { avaliacao }),
      },
      orderBy: { id: 'asc' },
    });
    return jogos.map((jogos) => this.mapToEntity(jogos));
  }

  private mapToEntity(jogo: PrismaJogo): Jogo {
    return {
      id: jogo.id,
      nome: jogo.nome,
      empresa: jogo.empresa,
      valor: jogo.valor,
      lancamento: jogo.lancamento,
      genero: jogo.genero,
      consoles: jogo.consoles,
      avaliacao: jogo.avaliacao,
    };
  }

  async findOne(id: number): Promise<Jogo | null> {
    const jogos = await this.prisma.jogos.findUnique({ where: { id } });
    return jogos ? this.mapToEntity(jogos) : null;
  }

  async update(id: number, updateJogoDto: UpdateJogoDto): Promise<Jogo> {
    const jogos = await this.prisma.jogos.update({
      where: { id },
      data: updateJogoDto,
    });
    return this.mapToEntity(jogos);
  }

  async remove(id: number): Promise<Jogo> {
    const jogos = await this.prisma.jogos.delete({ where: { id } });
    return this.mapToEntity(jogos);
  }
}
