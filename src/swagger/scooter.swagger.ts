import { ApiProperty } from '@nestjs/swagger';
import * as CommonApiDocs from '../swagger/common.swagger';

export class Scooter {
  @ApiProperty({ description: 'scooter ID' })
  id: number;

  @ApiProperty({ description: 'scooter name' })
  plateNo: string;
  
  @ApiProperty({ description: 'create time of scooter' })
  createTime: number;
  
  @ApiProperty({ description: 'last update time of scooter' })
  updateTime: number;
}

class ScooterList {
  @ApiProperty({ description: 'page information' })
  page: CommonApiDocs.PageInfo;

  @ApiProperty({ description: 'scooter list', type: [Scooter] })
  list: Scooter[];
}

export const ScooterID = {
  name: "id",
  description: "Scooter ID",
  required: true,
  type: Number
};

export class CreateScooterDto {
  @ApiProperty({ description: 'scooter name' })
  plateNo: string;
}

export class UpdateScooterDto {
  @ApiProperty({ description: 'scooter plate number' })
  plateNo: string;
}

export class GetScootersResponse extends CommonApiDocs.SuccessResponse {
  @ApiProperty({ description: 'scooter list' })
  data: ScooterList;
}

export class GetScooterResponse extends CommonApiDocs.SuccessResponse {
  @ApiProperty({ description: 'scooter information' })
  data: Scooter;
}

export class CreateScooterResponse extends CommonApiDocs.SuccessResponse {
  @ApiProperty({ description: 'scooter' })
  data: Scooter;
}

export class UpdateScooterResponse extends CommonApiDocs.SuccessResponse {
  @ApiProperty({ description: 'scooter' })
  data: Scooter;
}

export class DeleteScooterResponse extends CommonApiDocs.SuccessResponse {
  @ApiProperty({ description: 'scooter' })
  data: string;
}