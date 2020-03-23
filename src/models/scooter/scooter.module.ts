import { Module } from '@nestjs/common';
import { ScooterController } from './scooter.controller';
import { ScooterService } from './scooter.service';

@Module({
  imports: [],
  controllers: [ScooterController],
  providers: [ScooterService],
})
export class ScooterModule {}