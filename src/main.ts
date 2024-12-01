import { ConfigService, ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import commonConf from './common/common.conf';
import whiteList from './common/whiteList';
import { allowOrigins } from './utils/allowOrigins';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { hosts, ports } = whiteList;
  const configService = app.get(ConfigService);
  const common = configService.get<ConfigType<typeof commonConf>>('common');
  const allowList = allowOrigins(hosts, ports);
  console.log('allowList:', allowList);
  app.enableCors({
    origin: allowList,
    credentials: true,
  });
  app.setGlobalPrefix('api');
  app.use(cookieParser());

  await app.listen(common.PORT, common.HOST, async () => {
    console.log(`server listening on ${await app.getUrl()}`);
  });
}
bootstrap();
