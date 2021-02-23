import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../shared/guard/jwt.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.body.username);
  }
}
