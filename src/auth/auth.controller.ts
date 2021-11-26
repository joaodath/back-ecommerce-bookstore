import { Controller, Request, UseGuards, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiTags, ApiHeader, ApiResponse } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({ status: 201, description: 'Recurso criado' })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @ApiResponse({ status: 404, description: 'Não encontrado.' })
  @ApiHeader({
    name: 'Authorization',
    description: 'JWT Token',
  })
  @UseGuards(JwtAuthGuard)
  @Get('test')
  getProfile(@Request() req) {
    return req.user;
  }
}
