import {
    Controller,
    Get,
    Req,
    UseGuards,
    Body,
    Patch,
    UseInterceptors,
    ClassSerializerInterceptor,
    Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('profile')
    @UseGuards(AuthGuard('jwt'))
    async getProfile(@Req() req) {
        const userId = req.user.userId;
        return this.userService.getProfile(userId);
    }

    @Patch('profile')
    @UseGuards(AuthGuard('jwt'))
    async updateProfile(
        @Req() req,
        @Body() updateProfileDto: UpdateProfileDto
    ) {
        const userId = req.user.userId;
        return await this.userService.updateProfile(userId, updateProfileDto);
    }

    @Delete('profile')
    @UseGuards(AuthGuard('jwt'))
    async deleteProfile(@Req() req) {
        const userId = req.user.userId;
        await this.userService.removeUser(userId);
        return { message: 'User deleted successfully' };
    }
}
