import { MailerModule } from '@/mailer/mailer.module';
import { DatabaseModule } from '@database/database.module';
import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '@users/users.module';
import { UsersService } from '@users/users.service';
import { EncryptManager } from '@utils/EncryptManager';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BatchService } from './batch.service';
import { LocalStrategy } from './local.strategy';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    forwardRef(() => MailerModule),
    forwardRef(() => UsersModule),
    DatabaseModule,
    PassportModule,
    HttpModule,
  ],
  providers: [
    AuthService,
    UsersService,
    LocalStrategy,
    BatchService,
    EncryptManager,
    ConfigService,
  ],
  controllers: [AuthController],
  exports: [AuthService, BatchService],
})
export class AuthModule {}
