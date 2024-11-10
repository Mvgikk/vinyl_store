import {
    Controller,
    Post,
    Body,
    UseGuards,
    Get,
    Req,
    UseInterceptors,
    ClassSerializerInterceptor,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserProfileResponseDto } from 'src/user/dto/user-profile-response.dto';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('register')
    async register(
        @Body() registerDto: RegisterDto
    ): Promise<UserProfileResponseDto> {
        return await this.authService.register(registerDto);
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
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(HttpStatus.OK)
    async logout(@Req() req) {
        const sessionId = req.user.sessionId;
        return await this.authService.logout(sessionId);
    }
}
