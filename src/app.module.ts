import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MorganModule, MorganInterceptor } from 'nest-morgan';
import { UserModule } from './models/user/user.module';
import { ExamModule } from './models/exam/exam.module';
@Module({
  imports: [
    MorganModule.forRoot(),
    UserModule,
    ExamModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: MorganInterceptor('combined'),
    },
  ],
})
export class AppModule {}
