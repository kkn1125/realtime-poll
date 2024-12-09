import commonConf from '@common/common.conf';
import whiteList from '@common/whiteList';
import { RequestMethod } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { allowOrigins } from '@utils/allowOrigins';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { ResponseInterceptor } from '@middleware/response.interceptor';

console.log('Current working directory:', process.cwd());
console.log(
  'Resolved path for ./auth/auth.module:',
  require.resolve('./auth/auth.module'),
);

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
  app.setGlobalPrefix('api', {
    exclude: [{ path: 'sitemap.xml', method: RequestMethod.GET }],
  });
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.use(cookieParser());
  app.use(compression());

  await app.listen(common.PORT, common.HOST, async () => {
    console.log(`server listening on ${await app.getUrl()}`);
  });
}
bootstrap();
