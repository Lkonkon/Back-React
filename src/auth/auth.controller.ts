import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; senha: string }) {
    return this.authService.login(body.email, body.senha);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(@Body() body: { token: string }) {
    return this.authService.logout(body.token);
  }
}
