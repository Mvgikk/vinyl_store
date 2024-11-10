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
import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
} from '@nestjs/swagger';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiOperation({ summary: 'Get the profile of the authenticated user' })
    @ApiResponse({
        status: 200,
        description: 'User profile retrieved successfully',
        type: UserProfileResponseDto,
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @Get('profile')
    @UseGuards(AuthGuard('jwt'))
    async getProfile(@Req() req) {
        const userId = req.user.userId;
        return this.userService.getProfile(userId);
    }

    @ApiOperation({ summary: 'Update the profile of the authenticated user' })
    @ApiResponse({
        status: 200,
        description: 'User profile updated successfully',
        type: UserProfileResponseDto,
    })
    @ApiResponse({ status: 400, description: 'Invalid data' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @Patch('profile')
    @UseGuards(AuthGuard('jwt'))
    async updateProfile(
        @Req() req,
        @Body() updateProfileDto: UpdateProfileDto
    ) {
        const userId = req.user.userId;
        return await this.userService.updateProfile(userId, updateProfileDto);
    }

    @ApiOperation({ summary: 'Delete the profile of the authenticated user' })
    @ApiResponse({ status: 200, description: 'User deleted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @Delete('profile')
    @UseGuards(AuthGuard('jwt'))
    async deleteProfile(@Req() req) {
        const userId = req.user.userId;
        await this.userService.removeUser(userId);
        return { message: 'User deleted successfully' };
    }
}
