import {
    Controller,
    Post,
    Body,
    UseGuards,
    Get,
    Req,
    Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth() {
        // Initiates Google OAuth2 login
    }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req) {
        return {
            message: 'User information from Google',
            user: req.user,
        };
    }

    @Post('logout')
    async logout(@Headers('Authorization') authHeader: string) {
        const token = authHeader.replace('Bearer ', '');
        return this.authService.logout(token);
    }
}
