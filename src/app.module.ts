import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { PrismaModule } from './prisma/prisma.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';


@Module({
  imports: [
    AuthModule,
    ProfileModule,
    PrismaModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '.', 'uploads'),
    }),
  ],
})
export class AppModule {}
