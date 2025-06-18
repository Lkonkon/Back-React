import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  //private readonly validToken = '123456';

  private generateToken(): string {
    return randomBytes(32).toString('hex');
  }

  async validateToken(token: string): Promise<boolean> {
    const user = await this.prisma.usuario.findUnique({
      where: { token },
    });
    return !!user;
  }

  async login(email: string, senha: string) {
    const user = await this.prisma.usuario.findUnique({
      where: { email },
    });

    if (!user || user.senha !== senha) {
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }

    // Gera um novo token para o usuário
    const token = this.generateToken();

    // Atualiza o token do usuário
    await this.prisma.usuario.update({
      where: { id: user.id },
      data: { token },
    });

    return { ...user, token };
  }

  async logout(token: string) {
    await this.prisma.usuario.updateMany({
      where: { token },
      data: { token: null },
    });
  }
}
