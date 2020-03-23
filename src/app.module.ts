import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MorganModule, MorganInterceptor } from 'nest-morgan';
import { UserModule, ScooterModule, ExamModule } from './models';
@Module({
  imports: [
    MorganModule.forRoot(),
    UserModule,
    ScooterModule,
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
