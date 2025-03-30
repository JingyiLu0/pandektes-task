import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PublicationCategoryModule } from './publication-category/publication-category.module';
import { Category } from './categories/category.entity';
import { Publication } from './publications/publication.entity';
import { PublicationCategory } from './publication-category/publication-category.entity';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: false,
        entities: [Category, Publication, PublicationCategory],
        migrations: ['dist/migrations/*.js'],
        migrationsRun: true,
      }),
    }),
    PublicationCategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
