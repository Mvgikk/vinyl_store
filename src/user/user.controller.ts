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
    HttpCode,
    HttpStatus,
    UploadedFile,
    BadRequestException,
    Param,
    Res,
    NotFoundException,
    Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { UpdateProfileDto } from './dto/update-profile.dto';
import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiConsumes,
} from '@nestjs/swagger';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { Response } from 'express';

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

    @ApiOperation({ summary: 'Update the avatar of the authenticated user' })
    @ApiConsumes('multipart/form-data')
    @ApiResponse({
        status: 200,
        description: 'User avatar updated successfully',
    })
    @ApiResponse({ status: 400, description: 'Invalid file' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @Put('profile/avatar')
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('file'))
    @HttpCode(HttpStatus.OK)
    async updateAvatar(@Req() req, @UploadedFile() file: Express.Multer.File) {
        const userId = req.user.userId;
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }
        await this.userService.updateAvatar(userId, file.buffer);
        return { message: 'User avatar updated successfully' };
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

    @ApiOperation({ summary: 'Get the avatar of user' })
    @Get('profile/avatar/:userId')
    async getAvatar(@Param('userId') userId: number, @Res() res: Response) {
        const user = await this.userService.findOneById(userId);
        if (!user.avatar) {
            throw new NotFoundException('Avatar not found');
        }
        res.setHeader('Content-Type', 'image/jpeg');
        res.send(user.avatar);
    }

    @ApiOperation({ summary: 'Delete the avatar of the authenticated user' })
    @Delete('profile/avatar')
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(HttpStatus.OK)
    async deleteAvatar(@Req() req) {
        const userId = req.user.userId;
        await this.userService.removeAvatar(userId);
        return { message: 'Avatar deleted successfully' };
    }
}
