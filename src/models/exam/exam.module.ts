import { Module } from '@nestjs/common';
import { ExamController } from './exam.controller';

@Module({
  imports: [],
  controllers: [ExamController],
  providers: [],
})
export class ExamModule {}