import { ApiProperty } from '@nestjs/swagger';
import * as CommonApiDocs from '../swagger/common.swagger';

class People {
  @ApiProperty({ description: 'people id' })
  id: number;

  @ApiProperty({ description: 'age' })
  age: number;
}

class ExamResult {
  @ApiProperty({ description: 'people', type: [People] })
  people: People[];

  @ApiProperty({ description: 'Sum of people age' })
  result: number;
}

export class GetExamResponse extends CommonApiDocs.SuccessResponse {
  @ApiProperty({ description: 'Sum of people age' })
  data: ExamResult;
}