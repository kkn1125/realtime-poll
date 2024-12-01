import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { VotesService } from './votes.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { Request } from 'express';
import { RoleGuard } from '@/auth/role.guard';

@UseGuards(RoleGuard)
@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Post()
  create(@Body() createVoteDto: CreateVoteDto) {
    return this.votesService.create(createVoteDto);
  }

  @Get()
  findAll(@Query('page') page: number = 1) {
    return this.votesService.findAll(page);
  }

  @Get('me')
  findMe(@Req() req: Request, @Query('page') page: number = 1) {
    const { id } = req.user;
    console.log(page);
    return this.votesService.findMe(id, page);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.votesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVoteDto: UpdateVoteDto) {
    return this.votesService.update(id, updateVoteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.votesService.remove(id);
  }
}
