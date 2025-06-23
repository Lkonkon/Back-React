import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    let token = this.extractTokenFromHeader(request);

    // Se não encontrar no header, tenta pegar do query param
    if (!token && request.query && request.query.token) {
      token = request.query.token;
    }

    console.log('Token recebido no guard:', token);

    if (!token) {
      throw new UnauthorizedException('Token não fornecido');
    }

    const isValid = await this.authService.validateToken(token);
    if (!isValid) {
      throw new UnauthorizedException('Token inválido');
    }

    // Armazenar o token na requisição para uso posterior
    request.token = token;

    return true;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
