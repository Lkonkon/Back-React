import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { PrismaService } from 'prisma/prisma.service';
import { randomBytes } from 'crypto';

@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  private generateToken(): string {
    return randomBytes(32).toString('hex');
  }

  async create(createUsuarioDto: CreateUsuarioDto) {
    try {
      const existingUser = await this.prisma.usuario.findUnique({
        where: { email: createUsuarioDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email já em utilização');
      }

      const token = this.generateToken();

      const usuario = await this.prisma.usuario.create({
        data: {
          nome: createUsuarioDto.nome,
          email: createUsuarioDto.email,
          senha: createUsuarioDto.senha,
          token,
        },
      });
      return usuario;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      console.error('Erro ao criar usuário:', error);
      throw new InternalServerErrorException('Erro ao criar usuário');
    }
  }

  findAll() {
    return `TESSSSSSSSSSSSSSSSSSSSSTEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE`;
  }

  findOne(id: number) {
    return `This action returns a #${id} usuario`;
  }

  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return `This action updates a #${id} usuario`;
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }
}
