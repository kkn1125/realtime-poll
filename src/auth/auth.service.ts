import { MailerService } from '@/mailer/mailer.service';
import { PrismaService } from '@database/prisma.service';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export class AuthService {
  constructor(
    private readonly mailer: MailerService,
    public readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, userPassword: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;
    if (user.deletedAt !== null) {
      throw new BadRequestException('탈퇴된 계정입니다.');
    }

    const encryptedPassword = this.prisma.encryptPassword(userPassword);

    if (user.password !== encryptedPassword) return null;

    const { password, ...result } = user;
    return result;
  }

  async checkEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (user) {
      throw new ConflictException('이미 사용중인 이메일입니다.');
    }

    console.log('to:', email);

    const address = this.configService.get('email.ADDRESS');
    const mode = this.configService.get('common.MODE');

    const domain =
      mode === 'development'
        ? 'http://localhost:8080'
        : 'https://snappoll.kro.kr';

    console.log('admin email', address);

    const token = this.prisma.encryptPassword(email);

    const message = {
      from: `SnapPollHelper <${address}>`,
      to: `${email}`,
      subject: 'SnapPoll 이메일 확인 요청',
      text: '확인해주세요.',
      html: `<div>
        <h2>이메일 본인인증</h2>
        <p>본인인증을 위한 메일입니다. 본인에 의한 확인 메일이 아닌 경우, 아래 메일로 문의해주세요.</p>

        <form method="post" action="${domain}/api/auth/validate">
          <input type="hidden" name="token" value="${token}" />
          <input type="hidden" name="domain" value="snappollhelper" />
          <button type="submit">확인</button>
        </form>
        
        <a href="mailto:devkimsonhelper@gmail.com">devkimsonhelper@gmail.com</a>
      </div>`,
    } as Mail.Options;
    console.log(this.mailer);
    const result = await this.mailer.sendConfirmMail(message);

    console.log(result);

    console.log(`send email to ${email}`);

    return token;
  }

  getToken(userData: { id: string; email: string; username: string }) {
    const secretKey = this.configService.get<string>('common.SECRET_KEY');
    const token = jwt.sign(
      {
        ...userData,
        loginAt: Date.now(),
      },
      secretKey,
      {
        expiresIn: '30m',
        issuer: 'snapPoll',
        algorithm: 'HS256',
      },
    );
    const refreshToken = jwt.sign(
      {
        ...userData,
        loginAt: Date.now(),
      },
      secretKey,
      {
        subject: 'refresh',
        expiresIn: '1h',
        issuer: 'snapPoll',
        algorithm: 'HS256',
      },
    );
    return { token, refreshToken };
  }

  getMe(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        // poll: true,
        userProfile: true,
      },
    });
  }
}
