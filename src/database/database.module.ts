import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import DatabaseLogger from './databaseLogger';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService) => ({
        type: configService.get('TYPEORM_CONNECTION'),
        logger: new DatabaseLogger(),
        host: configService.get('TYPEORM_HOST'),
        port: configService.get('TYPEORM_PORT'),
        username: configService.get('TYPEORM_USERNAME'),
        password: configService.get('TYPEORM_PASSWORD'),
        database:configService.get('TYPEORM_DATABASE'),
        synchronize: configService.get('TYPEORM_SYNCHRONIZE'),
        autoLoadEntities: configService.get('TYPEORM_AUTOLOAD'),
      }),
    })
  ],
})
export class DatabaseModule {}
