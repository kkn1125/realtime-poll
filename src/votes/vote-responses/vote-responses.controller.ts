import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { VoteResponsesService } from './vote-responses.service';
import { CreateVoteResponseDto } from './dto/create-vote-response.dto';
import { UpdateVoteResponseDto } from './dto/update-vote-response.dto';
import { RoleGuard } from '@auth/role.guard';

@Controller('response')
export class VoteResponsesController {
  constructor(private readonly voteResponsesService: VoteResponsesService) {}

  @Post()
  create(
    @Body()
    createVoteResponseDto: CreateVoteResponseDto,
  ) {
    return this.voteResponsesService.create(createVoteResponseDto);
  }

  @UseGuards(RoleGuard)
  @Get()
  findAll() {
    return this.voteResponsesService.findAll();
  }

  @UseGuards(RoleGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.voteResponsesService.findOne(id);
  }

  @UseGuards(RoleGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateVoteResponseDto: UpdateVoteResponseDto,
  ) {
    return this.voteResponsesService.update(id, updateVoteResponseDto);
  }

  @UseGuards(RoleGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.voteResponsesService.remove(id);
  }
}
