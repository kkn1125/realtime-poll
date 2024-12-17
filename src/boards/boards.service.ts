import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { PrismaService } from '@database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class BoardsService {
  boardSelect: Prisma.BoardSelect = {
    id: true,
    userId: true,
    category: true,
    title: true,
    content: true,
    viewCount: true,
    order: true,
    isOnlyCrew: true,
    isPrivate: true,
    createdAt: true,
    updatedAt: true,
    author: {
      select: {
        id: true,
        username: true,
        email: true,
      },
    },
  };

  constructor(private readonly prisma: PrismaService) {}

  async validatePassword(id: string, password: string, isUser: boolean) {
    if (isUser) {
      const errorCode = await this.prisma.getErrorCode('board', 'Forbidden');
      throw new ForbiddenException(errorCode);
    }
    const board = await this.prisma.board.findUnique({ where: { id } });
    if (!board) {
      const errorCode = await this.prisma.getErrorCode('board', 'NotFound');
      throw new NotFoundException(errorCode);
    }
    const encryptedPassword = this.prisma.encryptPassword(password);

    return board.password === encryptedPassword;
  }

  create(createBoardDto: CreateBoardDto, isUser: boolean) {
    if (!isUser && createBoardDto.password) {
      createBoardDto.password = this.prisma.encryptPassword(
        createBoardDto.password,
      );
    }
    if (isUser) {
      delete createBoardDto['password'];
    }
    return this.prisma.board.create({ data: createBoardDto });
  }

  async findAll(page: number = 1) {
    const boards = await this.prisma.board.findMany({
      where: { deletedAt: null },
      take: 10,
      skip: (page - 1) * 10,
      orderBy: { createdAt: 'desc' },
      select: this.boardSelect,
    });
    const count = await this.prisma.board.count();
    return { board: boards, count };
  }

  async findCategoryOne(category: string, id: string) {
    const board = await this.prisma.board.findUnique({
      where: { id, category, deletedAt: null },
      select: this.boardSelect,
    });
    if (!board) {
      const errorCode = await this.prisma.getErrorCode('board', 'NotFound');
      throw new NotFoundException(errorCode);
    }
    return board;
  }

  async findCategory(category: string, page: number = 1) {
    const boards = await this.prisma.board.findMany({
      where: { category, deletedAt: null },
      take: 10,
      skip: (page - 1) * 10,
      orderBy: { createdAt: 'desc' },
      select: this.boardSelect,
    });
    const count = await this.prisma.board.count({ where: { category } });
    return { board: boards, count };
  }

  async findOne(id: string) {
    const board = await this.prisma.board.findUnique({
      where: { id, deletedAt: null },
      select: this.boardSelect,
    });
    if (!board) {
      const errorCode = await this.prisma.getErrorCode('board', 'NotFound');
      throw new NotFoundException(errorCode);
    }
    return this.prisma.board.update({
      where: { id, deletedAt: null },
      data: { viewCount: { increment: 1 } },
      select: this.boardSelect,
    });
  }

  async update(id: string, updateBoardDto: UpdateBoardDto, isUser: boolean) {
    const { password, title, content } = updateBoardDto;
    const board = await this.prisma.board.findUnique({ where: { id } });

    if (!board) {
      const errorCode = await this.prisma.getErrorCode('board', 'NotFound');
      throw new NotFoundException(errorCode);
    }

    if (!isUser && board.password !== null) {
      if (!password) {
        const errorCode = await this.prisma.getErrorCode('board', 'Forbidden');
        throw new ForbiddenException(errorCode);
      }
      const encryptedPassword = this.prisma.encryptPassword(password);
      if (board.password !== encryptedPassword) {
        const errorCode = await this.prisma.getErrorCode('board', 'Forbidden');
        throw new ForbiddenException(errorCode);
      }
    }

    return this.prisma.board.update({
      where: { id },
      data: { title, content },
    });
  }

  async remove(id: string, password: string, isUser: boolean) {
    const board = await this.prisma.board.findUnique({ where: { id } });
    if (!board) {
      const errorCode = await this.prisma.getErrorCode('board', 'NotFound');
      throw new NotFoundException(errorCode);
    }

    if (!isUser && board.password !== null) {
      if (!password) {
        const errorCode = await this.prisma.getErrorCode('board', 'Forbidden');
        throw new ForbiddenException(errorCode);
      }
      const encryptedPassword = this.prisma.encryptPassword(password);
      if (board.password !== encryptedPassword) {
        const errorCode = await this.prisma.getErrorCode('board', 'Forbidden');
        throw new ForbiddenException(errorCode);
      }
    }

    return this.prisma.board.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
