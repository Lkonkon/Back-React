import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  //private readonly validToken = '123456';

  validateToken(token: string): void {
    // if (token !== this.validToken) {
    //throw new UnauthorizedException('Token inválido');
    //}
  }

  async login(email: string, senha: string) {
    const user = await this.prisma.usuario.findUnique({
      where: { email },
    });
    if (!user || user.senha !== senha) {
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }
    return user;
  }
}
