import { PrismaService } from '@database/prisma.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import SnapLogger from '@utils/SnapLogger';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  logger = new SnapLogger(this);

  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    this.logger.debug('payload 확인:', email, password);
    if (!email || !password) {
      const errorCode = this.prisma.getErrorCode('auth', 'BadRequest');
      throw new UnauthorizedException(errorCode);
    }

    return this.authService.validateUser(email, password);
  }
}
