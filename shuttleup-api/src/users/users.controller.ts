import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { SubmitOnboardingDto } from './dto/submit-onboarding.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user profile' })
  @UseGuards(AuthGuard)
  @Get('me')
  getProfile(@CurrentUser('id') userId: string) {
    return this.usersService.findOne(userId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit onboarding skill questionnaire' })
  @UseGuards(AuthGuard)
  @Patch('me/onboarding')
  submitOnboarding(
    @CurrentUser('id') userId: string,
    @Body() dto: SubmitOnboardingDto,
  ) {
    return this.usersService.submitOnboarding(userId, dto);
  }

  @ApiOperation({ summary: 'Get all users (admin)' })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Get user by ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user profile' })
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }
}
