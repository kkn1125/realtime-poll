import { IgnoreCookie } from '@auth/ignore-cookie.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import SnapLogger from '@utils/SnapLogger';
import { Request, Response } from 'express';
import { memoryStorage } from 'multer';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  logger = new SnapLogger(this);

  constructor(private readonly usersService: UsersService) {}

  @IgnoreCookie()
  @Post()
  create(
    @Body(new ValidationPipe({ transform: true })) createUserDto: CreateUserDto,
  ) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Query('page') page: number = 1) {
    return this.usersService.findAll(page);
  }

  @Get('me')
  findMe(@Req() req: Request) {
    return req.user;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  // @IgnoreCookie()
  // @Get('profile/test')
  // async getProfileImageTest(@Res() res: Response) {
  //   const image = await this.usersService.getProfileImageTest();
  //   // console.log(image.image instanceof Buffer);
  //   // this.logger.debug('image.mimetype', image.mimetype);
  //   // 이미지 응답
  //   res.setHeader('Content-Type', 'image/jpg');
  //   // res.setHeader('Content-Disposition', `inline; filename="test.jpg"`);
  //   res.send(image);
  // }

  @IgnoreCookie()
  @Get('profile/:id')
  async getProfileImage(@Res() res: Response, @Param('id') profileId: string) {
    const image = await this.usersService.getProfileImage(profileId);
    // console.log(image.image instanceof Buffer);
    this.logger.debug('image.mimetype', image.mimetype);
    // 이미지 응답
    res.setHeader('Content-Type', image.mimetype);
    // res.setHeader(
    //   'Content-Disposition',
    //   `inline; filename="${image.filename}"`,
    // );
    res.send(Buffer.from(image.image));
  }

  @UseInterceptors(
    FileInterceptor('file', {
      storage:
        memoryStorage(/* {
        // destination: './upload',
        filename(req, file, callback) {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `${uniqueSuffix}-${file.originalname}`);
        },
      } */),
    }),
  )
  @Put('profile')
  async uploadProfile(
    @Req() req: Request,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({
          maxSize: 200 * 1000,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    const id = req.user.id;
    this.logger.debug(file);
    const { image, ...fileData } = await this.usersService.uploadProfile(
      id,
      file,
    );

    return fileData;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  // @IgnoreCookie()
  @Put(':id/password')
  updatePassword(
    @Param('id') id: string,
    @Body('currentPassword') currentPassword: string,
    @Body() updateUserDto: UpdateUserPasswordDto,
  ) {
    return this.usersService.updatePassword(id, currentPassword, updateUserDto);
  }

  @Delete('profile')
  deleteProfileImage(@Req() req: Request) {
    const id = req.user.id;
    return this.usersService.deleteProfileImage(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
