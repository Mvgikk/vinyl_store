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
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiOperation({ summary: 'User login' })
    @ApiResponse({ status: 200, description: 'User successfully logged in' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }
    @ApiOperation({ summary: 'User registration' })
    @ApiResponse({
        status: 201,
        description: 'User successfully registered',
        type: UserProfileResponseDto,
    })
    @ApiResponse({ status: 400, description: 'Email already exists' })
    @Post('register')
    async register(
        @Body() registerDto: RegisterDto
    ): Promise<UserProfileResponseDto> {
        return await this.authService.register(registerDto);
    }

    @ApiOperation({ summary: 'Initiate Google OAuth2 login' })
    @ApiResponse({ status: 200, description: 'Redirects to Google login' })
    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth() {
        // Initiates Google OAuth2 login
    }

    @ApiOperation({ summary: 'Google OAuth2 login callback' })
    @ApiResponse({
        status: 200,
        description: 'User information from Google',
        schema: {
            example: {
                access_token: 'jwt-token-here',
            },
        },
    })
    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req) {
        const user = req.user;
        const loginResponse = await this.authService.loginWithGoogle(user);
        return { access_token: loginResponse.access_token };
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'User logout' })
    @ApiResponse({ status: 200, description: 'User successfully logged out' })
    @Post('logout')
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(HttpStatus.OK)
    async logout(@Req() req) {
        const sessionId = req.user.sessionId;
        return await this.authService.logout(sessionId);
    }
}
