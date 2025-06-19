import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

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

    const token = this.generateToken();

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
