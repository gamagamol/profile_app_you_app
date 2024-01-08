import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Controller()
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('api/login')
  async Login(@Body() login:LoginDto) {
    
    return this.auth.login(login)
  }

  @Post('api/register')
  async register(@Body() registerDto: RegisterDto) {
    if (registerDto.password != registerDto.confirmPassword) {
      return {
        StatusCode: 400,
        Message: 'Password And Confirm Password Should Same',
      };
    }

    return this.auth.register(registerDto);
  }
}
