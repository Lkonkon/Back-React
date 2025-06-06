import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [PrismaModule],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
