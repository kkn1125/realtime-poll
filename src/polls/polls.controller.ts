import { Roles } from '@/auth/roles.decorator';
import { Role } from '@common/enums/Role';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { PollsService } from './polls.service';
import { RoleGuard } from '@/auth/role.guard';
import { Request } from 'express';

// @Roles([Role.User])
@UseGuards(RoleGuard)
@Controller('polls')
export class PollsController {
  constructor(private readonly pollsService: PollsService) {}

  @Post()
  create(@Req() req: Request, @Body() createPollDto: CreatePollDto) {
    createPollDto.createdBy = req.user.id;
    return this.pollsService.create(createPollDto);
  }

  // @Roles([Role.User])
  @Get()
  findAll(@Query('page') page: number = 1) {
    return this.pollsService.findAll(page);
  }

  @Get('me')
  findMe(@Req() req: Request, @Query('page') page: number = 1) {
    const { id } = req.user;
    return this.pollsService.findMe(id, page);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pollsService.findOne(id);
  }

  @Get(':id/response')
  findOneResponses(@Param('id') id: string) {
    return this.pollsService.findResponses(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePollDto: UpdatePollDto) {
    return this.pollsService.update(id, updatePollDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pollsService.remove(id);
  }
}
