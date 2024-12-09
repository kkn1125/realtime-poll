import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { CookieGuard } from './cookie.guard';
import { BatchService } from './batch.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly batchService: BatchService,
  ) {}

  @Get('check/email/:email')
  async checkEmail(@Res() res: Response, @Param('email') email: string) {
    const token = await this.authService.checkEmail(email);

    const data = await new Promise<{ token: string } | boolean>((resolve) =>
      this.batchService.mapper.set(token, {
        resolve,
        start: Date.now(),
        email,
      }),
    );

    if (data && data instanceof Object && 'token' in data) {
      this.batchService.mapper.delete(data.token);
    }

    res.json({
      ok: !!data,
    });
  }

  @Post('validate')
  validateEmail(@Body() data: any, @Res() res: Response) {
    const style = `
    <style>
      html, body {
        margin: 0;
        height: 100%;
        overflow: hidden;
      }
      .header {
        font-size: 1.5rem;
        margin-bottom: 1em;
      }
      button {
        border-radius: 0.3rem;
        border-width: 1px;
        border-color: #5193cf;
        border-style: solid;
        transition: all 150ms ease-in-out;
        box-sizing: border-box;
        background: transparent;
        padding: 0.3rem 0.8rem;
        font-weight: 700;
        font-size: 1rem;
        &:hover {
          cursor: pointer;
          border-color: #ffffff00;
          background: #5193cf;
          color: white;
        }
      }
      .wrap {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        justify-content: center;
        align-items: center;
        height: 100%;
      }
    </style>`;

    const mapper = this.batchService.mapper.get(data.token);

    if (!mapper) {
      res.send(`
        ${style}
        <div class="wrap">
          <h3>존재하지 않는 토큰입니다.</h3>
          <button onclick="window.close()">닫기</button>
        </div>
      `);
      return;
    }

    const { resolve, email, start, expired } = mapper;

    const gap = Date.now() - start;
    const expiresAt = gap > this.batchService.cacheTime;

    const compareToken = this.authService.prisma.encryptPassword(email);
    // console.log(compareToken, data.token, email);
    const matched = compareToken === data.token;
    const has = !!resolve;

    if (expired || expiresAt) {
      this.batchService.mapper.delete(data.token);

      res.send(`
          ${style}
          <div class="wrap">
            <h3>토큰 유효기간이 만료되었습니다.</h3>
            <button onclick="window.close()">닫기</button>
          </div>
        `);
      return;
    }

    if (has && matched) {
      resolve(data);
      res.send(`
          ${style}
          <div class="wrap">
            <h3>${email}님의 계정이 확인되었습니다.</h3>
            <h5>페이지로 돌아가 남은 과정을 진행해주세요.</h5>
            <button onclick="window.close()">닫기</button>
          </div>
        `);
    } else {
      resolve(false);
      res.send(`
          ${style}
          <div class="wrap">
            <h3>잘못된 토큰 형식입니다.</h3>
            <button onclick="window.close()">닫기</button>
          </div>
        `);
    }
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req: Request, @Res() res: Response) {
    if (req.user) {
      const user = req.user;
      const { token, refreshToken } = this.authService.getToken({
        id: user.id,
        username: user.username,
        email: user.email,
      });

      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
      });
      res.cookie('refresh', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
      });

      res.json({
        ok: true,
      });
    } else {
      throw new UnauthorizedException('회원정보를 다시 확인해주세요.');
    }
  }

  @UseGuards(CookieGuard)
  @Post('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    if (req.user) {
      res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
      });
      res.clearCookie('refresh', {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
      });

      res.json({
        ok: true,
      });
    } else {
      throw new UnauthorizedException('잘못된 접근입니다.');
    }
  }

  @UseGuards(CookieGuard)
  @Post('verify')
  async verify(@Req() req: Request, @Res() res: Response) {
    if (!req.verify) {
      throw new UnauthorizedException('토큰이 만료되었습니다.');
    }
    // const profile = req.user?.['userProfile'];
    // console.log('profile:', profile);
    // const blob = new Blob([new Uint8Array(profile.data)], {
    //   type: 'image/jpeg',
    // });
    // const dataUrl = URL.createObjectURL(blob);
    res.json({
      ok: !!req.user,
      token: req.cookies?.token,
      // userId: req.user?.id,
      // username: req.user?.username,
      // profile: profile?.[0]?.image,
    });
  }
}
